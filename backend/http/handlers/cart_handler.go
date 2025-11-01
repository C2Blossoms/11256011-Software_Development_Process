package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"math"
	"net/http"
	"strings"
	"time"

	"gorm.io/gorm"

	authmw "github.com/C2Blossoms/Project_SDP/backend/http/middleware"
	"github.com/C2Blossoms/Project_SDP/backend/models"
)

type CartHandlers struct {
	DB *gorm.DB
}

func NewCartHandlers(db *gorm.DB) *CartHandlers { return &CartHandlers{DB: db} }

// GET /cart (ต้อง auth)
func (h *CartHandlers) GetCart(w http.ResponseWriter, r *http.Request) {
	uid, ok := authmw.UserIDFrom(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// หา/สร้าง cart ของ user (หาเฉพาะที่ยังไม่ถูกลบ)
	var cart models.Cart
	if err := h.DB.Where("user_id = ? AND deleted_at IS NULL", uid).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			cart = models.Cart{UserID: uid}
			if err := h.DB.Create(&cart).Error; err != nil {
				http.Error(w, "cannot create cart", http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
	}

	// โหลด items แบบ query ตรง ๆ (ไม่ใช้ Preload)
	// ห้ามดึง items ที่ถูก soft delete แล้ว
	var items []models.CartItem
	if err := h.DB.
		Where("cart_id = ? AND deleted_at IS NULL", cart.ID).
		Order("id").
		Find(&items).Error; err != nil {
		http.Error(w, "db error (load items)", http.StatusInternalServerError)
		return
	}
	cart.Items = items

	writeJSON(w, http.StatusOK, cart)
}

type addItemReq struct {
	ProductID uint `json:"product_id"`
	Qty       int  `json:"qty"`
}

// POST /cart/items {product_id, qty}
func (h *CartHandlers) AddItem(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 15*time.Second)
	defer cancel()

	uid, ok := authmw.UserIDFrom(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var in addItemReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.ProductID == 0 {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	// บังคับให้ qty = 1 เสมอ (ไม่สนใจค่าที่ส่งมา)
	in.Qty = 1

	// ensure cart (หาเฉพาะที่ยังไม่ถูกลบ)
	var cart models.Cart
	if err := h.DB.WithContext(ctx).Where("user_id = ? AND deleted_at IS NULL", uid).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			cart = models.Cart{UserID: uid}
			if err := h.DB.WithContext(ctx).Create(&cart).Error; err != nil {
				http.Error(w, "db error (create cart): "+err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "db error (find cart): "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// read product (เลี่ยงฟังก์ชันหนักใน SQL)
	var p struct {
		ID     uint
		Stock  int
		Status string
		Price  float64
	}
	if err := h.DB.WithContext(ctx).
		Model(&models.Product{}).
		Select("id, stock, status, price").
		Where("id = ? AND deleted_at IS NULL", in.ProductID).
		First(&p).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "product not found", http.StatusNotFound)
			return
		}
		http.Error(w, "db error (find product): "+err.Error(), http.StatusInternalServerError)
		return
	}
	if !strings.EqualFold(p.Status, "active") {
		http.Error(w, "product inactive", http.StatusBadRequest)
		return
	}
	// เช็ค stock สำหรับการเพิ่มทีละ 1
	if p.Stock < 1 {
		http.Error(w, "insufficient stock", http.StatusUnprocessableEntity)
		return
	}

	priceCents := int64(math.Round(p.Price * 100))
	currency := "THB"

	// ใช้ transaction เพื่อป้องกัน race condition
	var item models.CartItem
	txErr := h.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// หาว่ามี cart item อยู่แล้วหรือไม่ (หาเฉพาะที่ยังไม่ถูกลบ)
		var existingItem models.CartItem
		err := tx.
			Where("cart_id = ? AND product_id = ? AND deleted_at IS NULL", cart.ID, in.ProductID).
			First(&existingItem).Error

		if err == nil {
			// มีอยู่แล้ว → เพิ่ม qty +1
			if err := tx.
				Model(&existingItem).
				Updates(map[string]any{
					"qty":        gorm.Expr("qty + 1"),
					"updated_at": gorm.Expr("NOW()"),
				}).Error; err != nil {
				return err
			}
			// โหลดข้อมูลที่อัพเดทแล้ว
			if err := tx.First(&item, existingItem.ID).Error; err != nil {
				return err
			}
			return nil
		} else if errors.Is(err, gorm.ErrRecordNotFound) {
			// ตรวจสอบว่ามีรายการที่ถูก soft delete อยู่หรือไม่
			// ถ้ามีให้ลบออกก่อน (hard delete) เพื่อหลีกเลี่ยง unique constraint violation
			var softDeletedItem models.CartItem
			if err2 := tx.Unscoped().
				Where("cart_id = ? AND product_id = ? AND deleted_at IS NOT NULL", cart.ID, in.ProductID).
				First(&softDeletedItem).Error; err2 == nil {
				// พบรายการที่ถูก soft delete → hard delete เพื่อให้สามารถสร้างใหม่ได้
				if err2 := tx.Unscoped().Delete(&softDeletedItem).Error; err2 != nil {
					return err2
				}
			}

			// สร้างใหม่ qty = 1
			item = models.CartItem{
				CartID:    cart.ID,
				ProductID: in.ProductID,
				Qty:       1, // เพิ่มทีละ 1 เสมอ
				UnitPrice: priceCents,
				Currency:  currency,
			}
			if err := tx.Create(&item).Error; err != nil {
				// ถ้าเกิด duplicate key error แสดงว่ามี request อื่นเพิ่มไปแล้วระหว่างที่เรากำลังสร้าง
				// ให้ลองหาใหม่แล้วเพิ่ม qty
				if strings.Contains(err.Error(), "Duplicate entry") || strings.Contains(err.Error(), "uq_cart") {
					var existingItem2 models.CartItem
					if err2 := tx.
						Where("cart_id = ? AND product_id = ? AND deleted_at IS NULL", cart.ID, in.ProductID).
						First(&existingItem2).Error; err2 == nil {
						// พบแล้ว → เพิ่ม qty +1
						if err2 := tx.
							Model(&existingItem2).
							Updates(map[string]any{
								"qty":        gorm.Expr("qty + 1"),
								"updated_at": gorm.Expr("NOW()"),
							}).Error; err2 != nil {
							return err2
						}
						// โหลดข้อมูลที่อัพเดทแล้ว
						if err2 := tx.First(&item, existingItem2.ID).Error; err2 != nil {
							return err2
						}
						return nil
					}
				}
				return err
			}
			return nil
		} else {
			return err
		}
	})

	if txErr != nil {
		http.Error(w, "db error: "+txErr.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(item)
}

// DELETE /cart/items?id={cart_item_id}
func (h *CartHandlers) RemoveItem(w http.ResponseWriter, r *http.Request) {
	uid, ok := authmw.UserIDFrom(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	id, err := queryUint(r, "id")
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}

	// ensure item belongs to user's cart (หาเฉพาะที่ยังไม่ถูกลบ)
	var item models.CartItem
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", id).First(&item).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "not found", http.StatusNotFound)
		} else {
			http.Error(w, "db error", http.StatusInternalServerError)
		}
		return
	}
	var cart models.Cart
	if err := h.DB.Where("id = ? AND deleted_at IS NULL", item.CartID).First(&cart).Error; err != nil {
		http.Error(w, "cart not found", http.StatusNotFound)
		return
	}
	if cart.UserID != uid {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	
	// ลบทีละ 1: ถ้า qty > 1 ให้ลด qty ลง 1, ถ้า qty = 1 ให้ลบทั้งรายการ
	if item.Qty > 1 {
		// ลดจำนวนลง 1
		if err := h.DB.Model(&item).Update("qty", gorm.Expr("qty - 1")).Error; err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
	} else {
		// Soft delete item เมื่อ qty = 1
		if err := h.DB.Delete(&item).Error; err != nil {
			http.Error(w, "db error", http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

// DELETE /cart - ลบรายการทั้งหมดในตะกร้า
func (h *CartHandlers) ClearCart(w http.ResponseWriter, r *http.Request) {
	uid, ok := authmw.UserIDFrom(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// หา cart ของ user (หาเฉพาะที่ยังไม่ถูกลบ)
	var cart models.Cart
	if err := h.DB.Where("user_id = ? AND deleted_at IS NULL", uid).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// ไม่มี cart → ไม่มีอะไรให้ลบ
			w.WriteHeader(http.StatusNoContent)
			return
		}
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	// ลบรายการทั้งหมดในตะกร้า (soft delete)
	// ใช้ Model เพื่อให้แน่ใจว่าลบได้ถูกต้อง
	result := h.DB.Where("cart_id = ? AND deleted_at IS NULL", cart.ID).Delete(&models.CartItem{})
	if result.Error != nil {
		http.Error(w, "db error: "+result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// ส่ง response กลับ
	w.WriteHeader(http.StatusNoContent)
}
