package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/C2Blossoms/Project_SDP/backend/models"
	"gorm.io/gorm"
)

type ProductDeps struct {
	DB *gorm.DB
}

// Parse ID
func idFromPath(r *http.Request) (uint, error) {
	idStr := strings.TrimPrefix(r.URL.Path, "/products/")
	if idStr == "" || idStr == "/products" {
		return 0, errors.New("missing id")
	}
	u64, err := strconv.ParseUint(idStr, 10, 64)
	return uint(u64), err
}

// Get By ID
func (h *ProductDeps) GetProduct(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	var p models.Product
	if err := h.DB.First(&p, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.NotFound(w, r)
			return
		}
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(p)
}

// Get Alls
func (h *ProductDeps) ListProducts(w http.ResponseWriter, r *http.Request) {
	var items []models.Product
	q := h.DB

	onlyDeleted := r.URL.Query().Get("only_deleted") == "true"
	includeDeleted := r.URL.Query().Get("include_deleted") == "true"
	if onlyDeleted {
		q = q.Unscoped().Where("deleted_at IS NOT NULL")
	} else if includeDeleted {
		q = q.Unscoped()
	}
	// optional filter: ?q=keyword
	if qstr := r.URL.Query().Get("q"); qstr != "" {
		q = q.Where("name LIKE ? OR sku LIKE ?", "%"+qstr+"%", "%"+qstr+"%")
	}

	// optional limit: ?limit=50
	limit := 100
	if l := r.URL.Query().Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 && v <= 500 {
			limit = v
		}
	}

	if err := q.Limit(limit).Order("id DESC").Find(&items).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	_ = json.NewEncoder(w).Encode(items)
}

// Post
func (h *ProductDeps) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var in struct {
		SKU         string  `json:"sku"`
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
		Stock       int     `json:"stock"`
		Status      string  `json:"status"` // default: active
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "bad json", http.StatusBadRequest)
		return
	}
	p := models.Product{
		SKU:         in.SKU,
		Name:        in.Name,
		Description: in.Description,
		Price:       in.Price,
		Stock:       in.Stock,
		Status: func() string {
			if in.Status == "" {
				return "active"
			}
			return in.Status
		}(),
	}
	if err := h.DB.Create(&p).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	_ = json.NewEncoder(w).Encode(p)
}

// Update/Patch
func (h *ProductDeps) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	var in struct {
		SKU         *string  `json:"sku"`
		Name        *string  `json:"name"`
		Description *string  `json:"description"`
		Price       *float64 `json:"price"`
		Stock       *int     `json:"stock"`
		Status      *string  `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "bad json", http.StatusBadRequest)
		return
	}

	updates := map[string]any{}
	if in.SKU != nil {
		updates["sku"] = *in.SKU
	}
	if in.Name != nil {
		updates["name"] = *in.Name
	}
	if in.Description != nil {
		updates["description"] = *in.Description
	}
	if in.Price != nil {
		updates["price"] = *in.Price
	}
	if in.Stock != nil {
		updates["stock"] = *in.Stock
	}
	if in.Status != nil {
		updates["status"] = *in.Status
	}

	if len(updates) == 0 {
		http.Error(w, "no fields to update", http.StatusBadRequest)
		return
	}

	// เช็คว่ามี record ไหม
	var p models.Product
	if err := h.DB.First(&p, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.NotFound(w, r)
			return
		}
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	if err := h.DB.Model(&p).Updates(updates).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	_ = h.DB.First(&p, id).Error
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(p)
}

// Delete
func (h *ProductDeps) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	hard := r.URL.Query().Get("hard") == "true"
	dbx := h.DB
	if hard {
		dbx = dbx.Unscoped()
	}
	if err := dbx.Delete(&models.Product{}, id).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Post Restore
func (h *ProductDeps) RestoreProduct(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r) // รองรับ /products/{id}/restore ด้วยการตัด suffix ดูใน router ด้านล่าง
	if err != nil {
		http.NotFound(w, r)
		return
	}

	if err := h.DB.Unscoped().
		Model(&models.Product{}).
		Where("id = ?", id).
		Update("deleted_at", nil).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	var p models.Product
	if err := h.DB.First(&p, id).Error; err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(p)
}
