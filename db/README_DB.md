# DB Guide (สำหรับโปรเจกต์ใน ZIP)
อัปเดต: 2025-10-31T05:47:23.420963Z

โปรเจกต์นี้ตั้งค่า `.env` ให้ `DB_AUTOMIGRATE=true` ดังนั้นเมื่อรัน backend
ตัวแอปจะ **AutoMigrate** ตารางหลักให้เองจากโมเดล GORM:
- users, o_auth_accounts, refresh_tokens
- products
- carts, cart_items
- orders, order_items, payments

## ใช้อย่างรวดเร็ว (Docker Compose ที่มากับโปรเจกต์)
```bash
docker compose up -d
# backend จะ AutoMigrate ให้เองตามโมเดล
```

> ถ้าอยากทำแบบ manual ให้รัน `00_init_user_db.sql` เพื่อสร้าง DB/User
จากนั้นรัน `11_safe_indexes.sql` เพื่อเติมดัชนีและ constraint ที่ GORM ไม่ได้ใส่ให้

## สคีมาที่เพิ่มความเสถียร (แนะนำ)
- ทำ **unique (cart_id, product_id)** ที่ `cart_items` กันสินค้าชนกันในตะกร้า
- ดัชนีที่ใช้บ่อย: `orders(user_id, created_at)`, `cart_items(cart_id)`, `products(name)`
- เก็บรูปสินค้า: ใช้ตาราง `product_images` (เก็บ URL ไปยัง storage/CDN)

ไฟล์ในชุดนี้:
- 00_init_user_db.sql — สร้าง DB/USER/สิทธิ์
- 11_safe_indexes.sql — สร้างดัชนี/UNIQUE แบบ **ปลอดภัย** (เช็คก่อนค่อยสร้าง)
- 20_product_images.sql — ตารางรูปภาพ (optional)

> รันไฟล์เหล่านี้กับฐาน `ecommerce` ที่คุณใช้อยู่ได้เลย
