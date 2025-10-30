package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"gorm.io/gorm"

	"github.com/C2Blossoms/Project_SDP/backend/models"
)

type CartHandlers struct {
	DB *gorm.DB
}

func NewCartHandlers(db *gorm.DB) *CartHandlers { return &CartHandlers{DB: db} }

// GET /cart  (ต้อง auth)
func (h *CartHandlers) GetCart(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var cart models.Cart
	if err := h.DB.Where("user_id = ?", uid).Preload("Items").First(&cart).Error; err != nil {
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
	writeJSON(w, http.StatusOK, cart)
}

type addItemReq struct {
	ProductID uint `json:"product_id"`
	Qty       int  `json:"qty"`
}

// POST /cart/items {product_id, qty}
func (h *CartHandlers) AddItem(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var in addItemReq
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&in); err != nil || in.ProductID == 0 || in.Qty <= 0 {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	// ensure cart
	var cart models.Cart
	if err := h.DB.Where("user_id = ?", uid).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			cart = models.Cart{UserID: uid}
			if err := h.DB.Create(&cart).Error; err != nil {
				http.Error(w, "db error (create cart)", http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, "db error (find cart)", http.StatusInternalServerError)
			return
		}
	}

	// ดึง product + แปลงราคาเป็น cents จาก DECIMAL price
	type productMin struct {
		ID         uint
		Stock      int
		Status     string
		PriceCents int64
		Currency   string
	}
	var p productMin
	if err := h.DB.Model(&models.Product{}).
		Select("id, stock, status, ROUND(price*100) AS price_cents, 'THB' AS currency").
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

	// upsert item
	var item models.CartItem
	err = h.DB.Where("cart_id = ? AND product_id = ?", cart.ID, in.ProductID).First(&item).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		item = models.CartItem{
			CartID:    cart.ID,
			ProductID: in.ProductID,
			Qty:       in.Qty,
			UnitPrice: p.PriceCents, // snapshot เป็นหน่วย cents
			Currency:  p.Currency,   // 'THB'
		}
		if err := h.DB.Create(&item).Error; err != nil {
			http.Error(w, "db error (create item)", http.StatusInternalServerError)
			return
		}
	} else if err == nil {
		item.Qty += in.Qty
		if err := h.DB.Save(&item).Error; err != nil {
			http.Error(w, "db error (update item)", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "db error (find item)", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, item)
}

// DELETE /cart/items?id={cart_item_id}
func (h *CartHandlers) RemoveItem(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	id, err := queryUint(r, "id")
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}

	// ensure item belongs to user's cart
	var item models.CartItem
	if err := h.DB.Preload("Cart").
		Where("id = ?", id).First(&item).Error; err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	var cart models.Cart
	if err := h.DB.First(&cart, item.CartID).Error; err != nil || cart.UserID != uid {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	if err := h.DB.Delete(&item).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
