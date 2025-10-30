package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	authmw "github.com/C2Blossoms/Project_SDP/backend/http/middleware"
)

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func queryUint(r *http.Request, key string) (uint, error) {
	v := r.URL.Query().Get(key)
	if v == "" {
		return 0, errors.New("missing")
	}
	i, err := strconv.ParseUint(v, 10, 64)
	return uint(i), err
}

// ดึง user id ด้วยฟังก์ชันของ middleware เดิม (เหมือนที่ /me ใช้)
func userIDFromCtx(r *http.Request) (uint, error) {
	if uid, ok := authmw.UserIDFrom(r); ok && uid > 0 {
		return uid, nil
	}
	return 0, errors.New("no user id")
}
