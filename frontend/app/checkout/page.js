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
      if (!token) return;

      const deletePromises = cart.items.map(item =>
        fetch(`${API_URL}/cart/items?id=${item.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      await Promise.all(deletePromises);
      await fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("ไม่สามารถล้างตะกร้าได้");
    }
  };

  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="mt-20 w-[65%]">
        <Link
          className="flex justify-self-start font-[sans-serif] text-xl font-[600] hover:text-[#9c9c9c] active:text-[#0067D1] mb-4"
          href="/product"
        >
          ↩ back to shopping
        </Link>
        
        <div className="flex justify-self-center pb-15 text-6xl font-[sans-serif] font-[700] text-nowrap drop-shadow-2xl cursor-default text-white">
          Checkout
        </div>

        <div className="mb-11 relative gap-1 self-center justify-self-center top-0 w-[90%] bg-neutral-600/30 backdrop-blur-sm rounded-[40px] backdrop-opacity-10 border-2">
          <div className="pb-15 w-full flex justify-between">
            <span className="flex mt-6 ml-7 text-lg font-[sans-serif] font-[600] text-nowrap drop-shadow-2xl cursor-default text-white">
              item list
            </span>
            <button
              onClick={clearCart}
              className="flex mr-10 hover:text-[#ec0000] active:text-[#a30000] cursor-pointer text-neutral-400 grid place-self-end w-15 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-xl"
            >
              clear list
            </button>
          </div>

          <div className="pb-10 w-full px-7">
            {loading ? (
              <div className="text-white text-center py-4">กำลังโหลด...</div>
            ) : !cart || !cart.items || cart.items.length === 0 ? (
              <span className="flex self-center justify-self-center cursor-default text-gray-400">
                No item in the cart
              </span>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const product = productCache[item.product_id];
                  const price = (item.unit_price / 100).toFixed(2);
                  return (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="text-white font-semibold">
                          {product?.name || `สินค้า #${item.product_id}`}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          ฿{price} x {item.qty} = ฿{((item.unit_price * item.qty) / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-gray-600 pt-3 mt-4">
                  <div className="flex justify-between text-white text-lg">
                    <span>รวมทั้งหมด:</span>
                    <span className="text-yellow-400 font-bold text-xl">
                      ฿{(cart.items.reduce((sum, item) => sum + (item.unit_price * item.qty), 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between font-[sans-serif] text-nowrap drop-shadow-2xl justify-self-center w-[90%]">
          <div className="justify-self-start flex flex-col">
            <span className="pb-4 text-xl font-[500] cursor-default text-white">
              Address
            </span>
            <form onSubmit={placeOrder}>
              <textarea
                id="address"
                name="address"
                rows="4"
                cols="50"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address here."
                className="w-85 text-lg caret-blue-500 border-2 border-solid resize-y rounded-md p-2 text-white bg-gray-800"
              />
              <br />
              <textarea
                id="note"
                name="note"
                rows="2"
                cols="50"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="หมายเหตุ (ถ้ามี)"
                className="w-85 text-lg caret-blue-500 border-2 border-solid resize-y rounded-md p-2 text-white bg-gray-800 mt-2"
              />
              <br />
              <button
                type="submit"
                disabled={placingOrder || !cart || !cart.items || cart.items.length === 0}
                className="mt-4 flex justify-center items-center w-70 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3] disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
              >
                {placingOrder ? "กำลังสั่งซื้อ..." : "Continue to payment ≫"}
              </button>
            </form>
            {error && (
              <div className="mt-2 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
