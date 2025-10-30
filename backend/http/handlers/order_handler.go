package handlers

import (
	"net/http"

	"gorm.io/gorm"

	"github.com/C2Blossoms/Project_SDP/backend/models"
)

type OrderHandlers struct{ DB *gorm.DB }

func NewOrderHandlers(db *gorm.DB) *OrderHandlers { return &OrderHandlers{DB: db} }

// GET /orders/me
func (h *OrderHandlers) ListMyOrders(w http.ResponseWriter, r *http.Request) {
	uid, err := userIDFromCtx(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var orders []models.Order
	if err := h.DB.Where("user_id = ?", uid).Order("id desc").Preload("Items").Find(&orders).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": orders})
}
