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
	"gorm.io/gorm/clause"

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
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.ProductID == 0 || in.Qty <= 0 {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

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
	if p.Stock < in.Qty {
		http.Error(w, "insufficient stock", http.StatusUnprocessableEntity)
		return
	}

	priceCents := int64(math.Round(p.Price * 100))
	currency := "THB"

	// ===== Upsert โดยไม่ SELECT ก่อน + ข้าม Hooks =====
	item := models.CartItem{
		CartID:    cart.ID,
		ProductID: in.ProductID,
		Qty:       in.Qty,
		UnitPrice: priceCents, // snapshot หน่วย cents
		Currency:  currency,   // e.g. 'THB'
	}

	err := h.DB.
		WithContext(ctx).
		Session(&gorm.Session{SkipHooks: true}).
		Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "cart_id"}, {Name: "product_id"}},
			DoUpdates: clause.Assignments(map[string]any{
				"qty":        gorm.Expr("LEAST(COALESCE(qty,0) + ?, 9999)", in.Qty),
				"updated_at": gorm.Expr("NOW()"),
				// >>> ปลุกแถวที่เคยถูก soft delete
				"deleted_at": gorm.Expr("NULL"),
			}),
		}).
		Create(&item).Error

	if err != nil {
		http.Error(w, "db error (upsert item): "+err.Error(), http.StatusInternalServerError)
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
	// Soft delete item
	if err := h.DB.Delete(&item).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
