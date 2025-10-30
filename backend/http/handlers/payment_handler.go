package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/C2Blossoms/Project_SDP/backend/models"
)

type PaymentHandlers struct{ DB *gorm.DB }

func NewPaymentHandlers(db *gorm.DB) *PaymentHandlers { return &PaymentHandlers{DB: db} }

// POST /payments/intent  {order_id}
type paymentIntentReq struct {
	OrderID uint `json:"order_id"`
}
type paymentIntentResp struct {
	IntentID string `json:"intent_id"`
	Status   string `json:"status"` // pending
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
}

func (h *PaymentHandlers) CreateIntent(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var in paymentIntentReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.OrderID == 0 {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	var order models.Order
	if err := h.DB.First(&order, "id = ? AND user_id = ?", in.OrderID, uid).Error; err != nil {
		http.Error(w, "order not found", http.StatusNotFound)
		return
	}
	if order.Status != "placed" {
		http.Error(w, "invalid order state", http.StatusBadRequest)
		return
	}

	intentID := uuid.NewString()
	pmt := models.Payment{
		OrderID: order.ID, Provider: "mock",
		Amount: order.Total, Currency: order.Currency,
		Status: "pending", ProviderRef: intentID,
	}
	if err := h.DB.Create(&pmt).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, paymentIntentResp{
		IntentID: intentID, Status: "pending", Amount: order.Total, Currency: order.Currency,
	})
}

// POST /payments/mock/mark-paid {intent_id}
type markPaidReq struct {
	IntentID string `json:"intent_id"`
}

func (h *PaymentHandlers) MarkPaidMock(w http.ResponseWriter, r *http.Request) {
	var in markPaidReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.IntentID == "" {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	err := h.DB.Transaction(func(tx *gorm.DB) error {
		var p models.Payment
		if err := tx.Where("provider = ? AND provider_ref = ?", "mock", in.IntentID).First(&p).Error; err != nil {
			return err
		}
		if p.Status == "paid" {
			return nil
		}
		p.Status = "paid"
		if err := tx.Save(&p).Error; err != nil {
			return err
		}
		return tx.Model(&models.Order{}).Where("id = ?", p.OrderID).Update("status", "paid").Error
	})
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "paid"})
}
