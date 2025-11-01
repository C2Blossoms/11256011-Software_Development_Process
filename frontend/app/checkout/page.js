"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [productCache, setProductCache] = useState({});
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/product");
        return;
      }
      
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
        
        // ดึง product data
        if (cartData.items && cartData.items.length > 0) {
          const productIds = cartData.items.map(item => item.product_id);
          const uniqueIds = [...new Set(productIds)];
          
          const productPromises = uniqueIds.map(id =>
            fetch(`${API_URL}/products/${id}`).then(r => r.ok ? r.json() : null)
          );
          const products = await Promise.all(productPromises);
          const newCache = {};
          products.forEach((product, index) => {
            if (product) {
              newCache[uniqueIds[index]] = product;
            }
          });
          setProductCache(newCache);
        }
      } else if (response.status === 401) {
        router.push("/product");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("ไม่สามารถโหลดข้อมูลตะกร้าได้");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (e) => {
    e?.preventDefault();
    
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า");
      return;
    }

    try {
      setPlacingOrder(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/checkout/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: note || null,
        }),
      });

      if (response.ok) {
        const orderData = await response.json();
        router.push(`/payment?order_id=${orderData.order_id}`);
      } else {
        const errorText = await response.text().catch(() => "เกิดข้อผิดพลาด");
        setError(errorText || "ไม่สามารถสั่งซื้อได้");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setPlacingOrder(false);
    }
  };

  const clearCart = async () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    
    if (!confirm("ต้องการล้างตะกร้าทั้งหมดหรือไม่?")) return;
    
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
      } else {
        const errorText = await response.text().catch(() => "เกิดข้อผิดพลาด");
        throw new Error(errorText);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("ไม่สามารถล้างตะกร้าได้: " + err.message);
      // ถ้าเกิด error ให้ refresh cart เพื่อให้แน่ใจว่า state ตรงกับ backend
      await fetchCart();
    }
  };

  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20] pb-20">
      <div className="mt-16 w-full max-w-7xl px-6">
        <Link
          className="inline-block mb-6 font-[sans-serif] text-lg font-[600] hover:text-[#9c9c9c] active:text-[#0067D1] text-white transition-colors"
          href="/product"
        >
          ↩ back to shopping
        </Link>
        
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-[sans-serif] font-[700] text-nowrap drop-shadow-2xl cursor-default text-white mb-2">
            Checkout
          </h1>
          <div className="h-1 w-24 bg-[#0067D1] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-600/30 backdrop-blur-sm rounded-3xl backdrop-opacity-10 border-2 border-gray-700/50 shadow-xl p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700/50">
                <h2 className="text-2xl font-[sans-serif] font-[700] text-white">
                  รายการสินค้า
                </h2>
                {cart && cart.items && cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-neutral-400 hover:text-red-400 transition-colors font-medium"
                  >
                    ล้างทั้งหมด
                  </button>
                )}
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-white text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <p className="mt-4">กำลังโหลด...</p>
                  </div>
                ) : !cart || !cart.items || cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-2">ตะกร้าว่าง</div>
                    <Link 
                      href="/product"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      ไปเลือกสินค้า
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => {
                      const product = productCache[item.product_id];
                      const price = (item.unit_price / 100).toFixed(2);
                      const total = ((item.unit_price * item.qty) / 100).toFixed(2);
                      return (
                        <div 
                          key={item.id} 
                          className="bg-gray-800/60 rounded-xl p-5 flex gap-4 hover:bg-gray-800/80 transition-all shadow-md border border-gray-700/30"
                        >
                          {product?.images && product.images.length > 0 && (
                            <div className="flex-shrink-0">
                              <img
                                src={product.images[0]?.image_url?.startsWith('/') 
                                  ? `${API_URL}${product.images[0].image_url}` 
                                  : product.images[0].image_url}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                                onError={(e) => {
                                  e.target.src = "/placeholder-product.png";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-lg mb-1 truncate">
                              {product?.name || `สินค้า #${item.product_id}`}
                            </div>
                            <div className="text-gray-400 text-sm mb-2">
                              ราคาต่อชิ้น: ฿{price}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-gray-300 text-sm">
                                จำนวน: <span className="font-semibold text-white">{item.qty}</span> ชิ้น
                              </div>
                              <div className="text-yellow-400 font-bold text-lg">
                                ฿{total}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart && cart.items && cart.items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xl font-semibold">รวมทั้งหมด:</span>
                    <span className="text-yellow-400 font-bold text-2xl">
                      ฿{(cart.items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address & Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-600/30 backdrop-blur-sm rounded-3xl backdrop-opacity-10 border-2 border-gray-700/50 shadow-xl p-6 sticky top-6">
              <h2 className="text-2xl font-[sans-serif] font-[700] text-white mb-6 pb-4 border-b border-gray-700/50">
                ข้อมูลการจัดส่ง
              </h2>
              
              <form onSubmit={placeOrder} className="space-y-5">
                <div>
                  <label htmlFor="address" className="block text-white font-medium mb-2 text-sm">
                    ที่อยู่จัดส่ง <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="กรุณากรอกที่อยู่จัดส่ง..."
                    required
                    className="w-full text-base caret-blue-500 border-2 border-gray-700 rounded-xl p-3 text-white bg-gray-800/60 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="note" className="block text-white font-medium mb-2 text-sm">
                    หมายเหตุ (ถ้ามี)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="หมายเหตุเพิ่มเติม..."
                    className="w-full text-base caret-blue-500 border-2 border-gray-700 rounded-xl p-3 text-white bg-gray-800/60 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                    <strong>เกิดข้อผิดพลาด:</strong> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={placingOrder || !cart || !cart.items || cart.items.length === 0}
                  className="w-full h-14 bg-gradient-to-r from-[#0067D1] to-[#0040a1] rounded-xl text-lg font-[600] cursor-pointer hover:from-[#0040a1] hover:to-[#0067D1] active:scale-95 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:active:scale-100 text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {placingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>กำลังสั่งซื้อ...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to payment</span>
                      <span>≫</span>
                    </>
                  )}
                </button>

                {cart && cart.items && cart.items.length > 0 && (
                  <div className="pt-4 border-t border-gray-700/50">
                    <div className="flex justify-between text-gray-300 text-sm mb-2">
                      <span>จำนวนสินค้า:</span>
                      <span className="text-white font-semibold">{cart.items.length} รายการ</span>
                    </div>
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>ยอดรวม:</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        ฿{(cart.items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
