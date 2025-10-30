package handlers

import (
	"encoding/json"
	"net/http"

	"gorm.io/gorm"

	"github.com/C2Blossoms/Project_SDP/backend/models"
)

type CheckoutHandlers struct{ DB *gorm.DB }

func NewCheckoutHandlers(db *gorm.DB) *CheckoutHandlers { return &CheckoutHandlers{DB: db} }

// POST /checkout/place-order  {note?: string}
type placeOrderReq struct {
	Note string `json:"note"`
}
type placeOrderResp struct {
	OrderID uint   `json:"order_id"`
	Status  string `json:"status"`
	Total   int64  `json:"total"`
}

func (h *CheckoutHandlers) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var in placeOrderReq
	_ = json.NewDecoder(r.Body).Decode(&in)

	// load cart + items
	var cart models.Cart
	if err := h.DB.Where("user_id = ?", uid).Preload("Items").First(&cart).Error; err != nil {
		http.Error(w, "cart not found", http.StatusBadRequest)
		return
	}
	if len(cart.Items) == 0 {
		http.Error(w, "cart empty", http.StatusBadRequest)
		return
	}

	// compute totals
	var subtotal int64
	for _, it := range cart.Items {
		subtotal += int64(it.Qty) * it.UnitPrice
	}
	shipping := int64(0) // mock: กำหนดคงที่ก่อน
	discount := int64(0)
	total := subtotal + shipping - discount

	// tx: create order + order_items; clear cart
	err = h.DB.Transaction(func(tx *gorm.DB) error {
		order := models.Order{
			UserID: uid, Status: "placed",
			Subtotal: subtotal, ShippingFee: shipping, Discount: discount,
			Total: total, Currency: "THB", Note: in.Note,
		}
		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		items := make([]models.OrderItem, 0, len(cart.Items))
		for _, it := range cart.Items {
			items = append(items, models.OrderItem{
				OrderID:   order.ID,
				ProductID: it.ProductID,
				Qty:       it.Qty,
				UnitPrice: it.UnitPrice,
				Currency:  it.Currency,
			})
		}
		if err := tx.Create(&items).Error; err != nil {
			return err
		}

		// ล้าง cart (soft delete ก็ได้)
		if err := tx.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
			return err
		}

		// ตอบกลับ
		writeJSON(w, http.StatusCreated, placeOrderResp{
			OrderID: order.ID, Status: order.Status, Total: order.Total,
		})
		return nil
	})
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
}
