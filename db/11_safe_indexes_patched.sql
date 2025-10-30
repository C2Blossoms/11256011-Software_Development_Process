
-- 11_safe_indexes.sql (patched for current project schema)
USE ecommerce;

-- UNIQUE SKU
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'products' AND index_name = 'uq_products_sku'
);
SET @sql := IF(@exists=0, 'ALTER TABLE products ADD CONSTRAINT uq_products_sku UNIQUE (sku)', 'SELECT "skip uq_products_sku"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ค้นชื่อสินค้าไวขึ้น
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'products' AND index_name = 'idx_products_name'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_products_name ON products(name)', 'SELECT "skip idx_products_name"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ตะกร้า: เข้าถึงตาม cart_id และ product_id
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'cart_items' AND index_name = 'idx_cart_items_cart'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_cart_items_cart ON cart_items(cart_id)', 'SELECT "skip idx_cart_items_cart"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'cart_items' AND index_name = 'idx_cart_items_product'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_cart_items_product ON cart_items(product_id)', 'SELECT "skip idx_cart_items_product"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- บังคับ 1 แถวต่อสินค้าในตะกร้า
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'cart_items' AND index_name = 'uq_cart_items_cart_product'
);
SET @sql := IF(@exists=0, 'ALTER TABLE cart_items ADD CONSTRAINT uq_cart_items_cart_product UNIQUE (cart_id, product_id)', 'SELECT "skip uq_cart_items_cart_product"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- carts: index เฉพาะ user_id (ไม่มีคอลัมน์ status ในสคีมานี้)
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'carts' AND index_name = 'idx_carts_user'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_carts_user ON carts(user_id)', 'SELECT "skip idx_carts_user"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- orders: ประวัติคำสั่งซื้อผู้ใช้ (เรียงวันที่)
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'orders' AND index_name = 'idx_orders_user_created'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_orders_user_created ON orders(user_id, created_at)', 'SELECT "skip idx_orders_user_created"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- orders: ค้นตามสถานะ (คอลัมน์ status มีอยู่ในโมเดล)
SET @exists := (
  SELECT COUNT(1) FROM information_schema.statistics 
  WHERE table_schema = DATABASE() AND table_name = 'orders' AND index_name = 'idx_orders_status'
);
SET @sql := IF(@exists=0, 'CREATE INDEX idx_orders_status ON orders(status)', 'SELECT "skip idx_orders_status"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
