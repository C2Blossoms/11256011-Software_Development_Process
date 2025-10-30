-- 00_init_user_db.sql
-- สร้าง DB และผู้ใช้ตาม .env ของโปรเจกต์ (ปลอดภัยรันได้หลายครั้ง)
-- ปรับรหัสผ่านให้เหมาะสมก่อนใช้งานโปรดักชัน

CREATE DATABASE IF NOT EXISTS `ecommerce`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- ผู้ใช้แอป
CREATE USER IF NOT EXISTS 'ecom'@'%' IDENTIFIED BY '5948623';
GRANT ALL PRIVILEGES ON `ecommerce`.* TO 'ecom'@'%';
FLUSH PRIVILEGES;
