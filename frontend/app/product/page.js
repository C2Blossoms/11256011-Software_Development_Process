"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function ProductPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State สำหรับเก็บข้อมูลสินค้า
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // เก็บข้อมูลทั้งหมด
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State สำหรับ filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  
  // State สำหรับ cart
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [productCache, setProductCache] = useState({});
  // State สำหรับ tracking การเพิ่มสินค้าลงตะกร้า (ป้องกัน double-click)
  const [addingToCart, setAddingToCart] = useState(new Set());
  // State สำหรับ tracking การลบสินค้าออกจากตะกร้า (ป้องกัน double-click)
  const [removingFromCart, setRemovingFromCart] = useState(new Set());

  // อ่าน category จาก URL query parameter
  useEffect(() => {
    const categoryParam = searchParams?.get("category");
    if (categoryParam) {
      const validCategories = ["DUMBBELLS", "TREADMILLS", "WHEY PROTEIN"];
      if (validCategories.includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    }
  }, [searchParams]);

  // ดึงข้อมูลจาก backend ตอนหน้าโหลด
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCart(null);
        return;
      }
      
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const cartData = await response.json();
        console.log("Cart data received:", cartData);
        console.log("Cart items:", cartData.items);
        if (cartData.items && cartData.items.length > 0) {
          console.log("First cart item:", cartData.items[0]);
          console.log("First cart item keys:", Object.keys(cartData.items[0]));
        }
        setCart(cartData);
        
        // ดึง product data สำหรับ cart items
        if (cartData.items && cartData.items.length > 0) {
          const productIds = cartData.items.map(item => item.product_id);
          const uniqueIds = [...new Set(productIds)];
          const missingIds = uniqueIds.filter(id => !productCache[id]);
          
          if (missingIds.length > 0) {
            const productPromises = missingIds.map(id =>
              fetch(`${API_URL}/products/${id}`).then(r => r.ok ? r.json() : null)
            );
            const products = await Promise.all(productPromises);
            const newCache = { ...productCache };
            products.forEach((product, index) => {
              if (product) {
                newCache[missingIds[index]] = product;
              }
            });
            setProductCache(newCache);
          }
        }
      } else if (response.status === 401) {
        setCart(null);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, qty = 1) => {
    // ป้องกัน double-click - ถ้ากำลังเพิ่มสินค้านี้อยู่แล้ว ไม่ทำอะไร
    if (addingToCart.has(productId)) {
      return;
    }

    try {
      // เพิ่ม productId เข้า Set เพื่อป้องกันการกดซ้ำ
      setAddingToCart(prev => new Set(prev).add(productId));

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        setAddingToCart(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        return;
      }
      
      const response = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          qty: 1, // บังคับให้ส่ง 1 เสมอ (backend จะเพิ่มทีละ 1)
        }),
      });
      
      if (response.ok || response.status === 201) {
        await fetchCart();
        alert("เพิ่มสินค้าลงตะกร้าเรียบร้อย");
      } else {
        // ลองอ่าน error message จาก response
        let errorMessage = "ไม่สามารถเพิ่มสินค้าได้";
        try {
          const errorText = await response.text();
          if (errorText) {
            // ลอง parse เป็น JSON ก่อน
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.error || errorJson.message || errorText;
            } catch {
              // ถ้าไม่ใช่ JSON ใช้เป็น plain text
              errorMessage = errorText;
            }
          }
          
          // แปล error message เป็นภาษาไทย
          if (errorMessage.includes("unauthorized")) {
            errorMessage = "กรุณาเข้าสู่ระบบก่อน";
          } else if (errorMessage.includes("product not found")) {
            errorMessage = "ไม่พบสินค้านี้";
          } else if (errorMessage.includes("product inactive")) {
            errorMessage = "สินค้านี้ไม่พร้อมขาย";
          } else if (errorMessage.includes("insufficient stock")) {
            errorMessage = "สินค้าในสต็อกไม่พอ";
          } else if (errorMessage.includes("invalid body")) {
            errorMessage = "ข้อมูลไม่ถูกต้อง";
          }
        } catch (e) {
          console.error("Error reading error response:", e);
        }
        
        console.error("Error adding to cart:", response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า: " + (err.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"));
    } finally {
      // ลบ productId ออกจาก Set เพื่อให้สามารถกดได้อีกครั้ง
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeFromCart = async (itemId) => {
    // ตรวจสอบว่า itemId ถูกต้องหรือไม่
    if (!itemId || itemId === undefined || itemId === null) {
      console.error("Invalid itemId:", itemId);
      alert("ไม่สามารถลบสินค้าได้: ไม่พบรหัสสินค้า");
      return;
    }

    // แปลงเป็น number ถ้ายังไม่ใช่
    const id = typeof itemId === 'string' ? parseInt(itemId, 10) : Number(itemId);
    if (isNaN(id) || id <= 0) {
      console.error("Invalid itemId format:", itemId, "parsed as:", id);
      alert("ไม่สามารถลบสินค้าได้: รหัสสินค้าไม่ถูกต้อง");
      return;
    }

    // ป้องกัน double-click - ถ้ากำลังลบสินค้านี้อยู่แล้ว ไม่ทำอะไร
    if (removingFromCart.has(id)) {
      console.log("Already removing item:", id);
      return;
    }

    try {
      // เพิ่ม itemId เข้า Set เพื่อป้องกันการกดซ้ำ
      setRemovingFromCart(prev => new Set(prev).add(id));

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        setRemovingFromCart(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        return;
      }
      
      const url = `${API_URL}/cart/items?id=${id}`;
      console.log("Removing cart item:", url, "itemId:", itemId, "parsed id:", id);
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Remove response status:", response.status);
      
      if (response.ok || response.status === 204) {
        console.log("Item removed successfully, refreshing cart...");
        await fetchCart();
      } else {
        const errorText = await response.text().catch(() => "เกิดข้อผิดพลาด");
        console.error("Error removing from cart:", response.status, errorText);
        alert(`ไม่สามารถลบสินค้าได้: ${errorText}`);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      alert("เกิดข้อผิดพลาดในการลบสินค้า: " + (err.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"));
    } finally {
      // ลบ itemId ออกจาก Set เพื่อให้สามารถกดได้อีกครั้ง
      setRemovingFromCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    
    if (confirm("ต้องการล้างตะกร้าทั้งหมดหรือไม่?")) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("กรุณาเข้าสู่ระบบ");
          return;
        }
        
        // เรียก API เพื่อลบรายการทั้งหมดในตะกร้า
        const response = await fetch(`${API_URL}/cart`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok || response.status === 204) {
          // รีเซ็ต state ทันที
          setCart(prev => prev ? { ...prev, items: [] } : null);
          setProductCache({});
          
          // รีเฟรช cart อีกครั้งเพื่อให้แน่ใจว่าข้อมูลตรงกัน
          await fetchCart();
          alert("ล้างตะกร้าเรียบร้อยแล้ว");
        } else {
          const errorText = await response.text().catch(() => "เกิดข้อผิดพลาด");
          throw new Error(errorText);
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
        alert("เกิดข้อผิดพลาดในการล้างตะกร้า: " + err.message);
        // ถ้าเกิด error ให้ refresh cart เพื่อให้แน่ใจว่า state ตรงกับ backend
        await fetchCart();
      }
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error(`ไม่สามารถดึงข้อมูลสินค้าได้ (${response.status})`);
      }

      const data = await response.json();
      setAllProducts(data || []);
      applyFilters(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับกรองสินค้า
  const applyFilters = (productList, category, price) => {
    let filtered = [...productList];

    // Filter ตาม Category (ค้นหาจากชื่อสินค้า)
    if (category && category !== "All" && category !== "") {
      // แปลง category เป็น pattern ที่สามารถ match กับชื่อสินค้าได้
      let searchPattern = "";
      if (category === "DUMBBELLS") {
        searchPattern = "dumbbell";
      } else if (category === "TREADMILLS") {
        searchPattern = "treadmill";
      } else if (category === "WHEY PROTEIN") {
        searchPattern = "whey";
      }
      
      if (searchPattern) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchPattern.toLowerCase())
        );
      }
    }

    // Filter ตาม Price
    if (price && price !== "All" && price !== "") {
      filtered = filtered.filter(product => {
        if (price === "under 500฿") {
          return product.price < 500;
        } else if (price === "500 - 1000฿") {
          return product.price >= 500 && product.price <= 1000;
        } else if (price === "over 1000฿") {
          return product.price > 1000;
        }
        return true;
      });
    }

    setProducts(filtered);
  };

  // เมื่อ filter เปลี่ยนให้กรองสินค้าใหม่
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters(allProducts, selectedCategory, selectedPrice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPrice]);

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.is_primary);
      if (primaryImage) {
        const imageUrl = primaryImage.image_url;
        if (imageUrl.startsWith("/")) {
          return `${API_URL}${imageUrl}`;
        }
        return imageUrl;
      }
      const firstImage = product.images[0];
      const imageUrl = firstImage.image_url;
      if (imageUrl.startsWith("/")) {
        return `${API_URL}${imageUrl}`;
      }
      return imageUrl;
    }
    return "/placeholder-product.png";
  };

  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="relative gap-1 self-center justify-self-center top-0 w-[90%] mx-auto bg-neutral-600/30 backdrop-blur-sm rounded-[40px] backdrop-opacity-10 border-2 p-6">
        <div className="w-[100%] flex justify-between gap-8 justify-self-center h-full select-text">
          {/* ========== ด้านซ้าย: Selection Filter ========== */}
          <div className="sticky flex flex-col top-0 order-1 ml-10 mt-15 h-fit w-[16%] font-[sans-serif]">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
              Selection Filter
            </div>
            <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl cursor-default text-white">
              Category
            </span>
            <div className="pb-4 grid w-40">
               <select 
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10 text-white cursor-pointer"
               >
                 <option value="">All</option>
                 <option value="DUMBBELLS">DUMBBELLS</option>
                 <option value="TREADMILLS">TREADMILLS</option>
                 <option value="WHEY PROTEIN">WHEY PROTEIN</option>
              </select>
              <img
                src="selec-1.png"
                className="mr-1.5 pointer-events-none flex self-center justify-self-end w-5 col-start-1 row-start-1 z-20"
              />
            </div>
            <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl cursor-default text-white">
              Price
            </span>
            <div className="grid w-40">
              <select 
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10 text-white cursor-pointer"
              >
                <option value="">All</option>
                <option value="under 500฿">under 500฿</option>
                <option value="500 - 1000฿">500 - 1000฿</option>
                <option value="over 1000฿">over 1000฿</option>
              </select>
              <img
                src="selec-1.png"
                className="mr-1.5 pointer-events-none flex self-center justify-self-end w-5 col-start-1 row-start-1 z-20"
              />
            </div>
          </div>

          {/* ========== ตรงกลาง: Product List ========== */}
          <div className="flex flex-col order-2 mt-15 w-[62%] font-[sans-serif] ml-4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
            Product
          </div>
            </div>

            {loading ? (
              <div className="text-white text-center py-20">
                <div className="text-xl mb-2">กำลังโหลดข้อมูลสินค้า...</div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-20">
                <div className="text-xl mb-2">⚠️ เกิดข้อผิดพลาด</div>
                <div className="text-sm mb-4">{error}</div>
                <button
                  onClick={fetchProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-white text-center py-20">
                <div className="text-xl mb-2">ไม่มีสินค้าในระบบ</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block hover:scale-105 transition-transform"
                    >
                      <div className="relative w-full h-48 bg-gray-700">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.png";
                          }}
                        />
                        {product.images && product.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {product.images.length} รูป
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-gray-400 mb-1">SKU: {product.sku}</div>
                        <h3 className="text-white text-lg font-semibold mb-2 truncate">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {product.description || "ไม่มีคำอธิบาย"}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-yellow-400 text-xl font-bold">
                            ฿{product.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm">
                            คงเหลือ: {product.stock}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {product.status === "active" && product.stock > 0 && (
                      <div className="px-4 pb-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product.id, 1);
                          }}
                          disabled={addingToCart.has(product.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition text-sm disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {addingToCart.has(product.id) ? "กำลังเพิ่ม..." : "เพิ่มลงตะกร้า"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========== ด้านขวา: Shopping Cart ========== */}
          <div className="sticky top-0 mr-6 flex flex-col order-3 mt-15 h-fit w-[22%] font-[sans-serif] max-h-[80vh] overflow-y-auto ml-8">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl cursor-default text-white mb-4">
              Shopping Cart
            </div>
            
            {cartLoading ? (
              <div className="text-white text-center py-4">กำลังโหลด...</div>
            ) : !cart || !cart.items || cart.items.length === 0 ? (
              <div className="text-gray-400 text-sm py-4">ตะกร้าว่าง</div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => {
                    const product = productCache[item.product_id];
                    const price = (item.unit_price / 100).toFixed(2);
                    return (
                      <div key={item.id || item.ID} className="bg-gray-700 rounded-lg p-3 shadow-md">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-semibold truncate">
                              {product?.name || `สินค้า #${item.product_id}`}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              ฿{price} x {item.qty}
                            </div>
                            <div className="text-yellow-400 text-sm mt-1 font-semibold">
                              ฿{((item.unit_price * item.qty) / 100).toFixed(2)}
                            </div>
            </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Remove button clicked, item:", item);
                              // รองรับทั้ง item.id และ item.ID (uppercase)
                              const itemId = item?.id || item?.ID;
                              if (!item || !itemId) {
                                console.error("Item or item.id is missing:", item);
                                alert("ไม่สามารถลบสินค้าได้: ไม่พบข้อมูลสินค้า");
                                return;
                              }
                              removeFromCart(itemId);
                            }}
                            disabled={!item || (!item.id && !item.ID) || removingFromCart.has(Number(item.id || item.ID))}
                            className="text-red-400 hover:text-red-600 text-xl ml-2 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title={(!item || (!item.id && !item.ID) || removingFromCart.has(Number(item.id || item.ID))) ? "กำลังลบ..." : "ลบ"}
                          >
                            {(!item || (!item.id && !item.ID) || removingFromCart.has(Number(item.id || item.ID))) ? "..." : "×"}
            </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-gray-600 pt-4 mb-4">
                  <div className="flex justify-between items-center text-white mb-2">
                    <span className="text-lg font-semibold">รวมทั้งหมด:</span>
                    <span className="text-yellow-400 font-bold text-lg">
                      ฿{(cart.items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="w-full mb-3">
                  <Link
                    href="/checkout"
                    className="block active:text-[#0067D1] hover:underline underline-offset-2 font-[sans-serif] text-base font-[500] text-nowrap drop-shadow-2xl text-white text-center bg-blue-600 hover:bg-blue-700 py-2.5 px-4 rounded-lg transition"
                  >
                    ไปชำระเงิน ≫
                  </Link>
                </div>
                <button
                  onClick={clearCart}
                  className="hover:text-[#ec0000] active:text-[#0067D1] cursor-pointer text-neutral-400 grid place-self-end w-15 font-[sans-serif] text-md font-thin text-nowrap drop-shadow-xl"
                >
                  clear all
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center py-20">
          <div className="text-xl mb-2">กำลังโหลด...</div>
        </div>
      </main>
    }>
      <ProductPageContent />
    </Suspense>
  );
}
