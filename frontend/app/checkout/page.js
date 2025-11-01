"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault(); // Add this to prevent form submission
    setLoading(true);
    setError("");

    try {
      // Create payment intent
      const createIntent = await fetch(
        "http://localhost:8000/payments/intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            order_id: "YOUR_ORDER_ID", // Get this from your cart/order state
          }),
        }
      );

      if (!createIntent.ok) {
        throw new Error("Failed to create payment");
      }

      const { intent_id, order_id } = await createIntent.json();
      router.push(`/payment?order_id=${order_id}&intent_id=${intent_id}`);
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err.message || "Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`cart fetch failed: ${res.status}`);
        }
        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  function toPayButton() {
    router.push("/payment");
  }

  function computeSubtotal(items) {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, it) => {
      const qty = it.qty ?? it.Qty ?? 0;
      const unit = it.unit_price ?? it.UnitPrice ?? it.unitPrice ?? 0;
      return acc + qty * unit;
    }, 0);
  }

  async function placeOrder(ev) {
    ev?.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/place-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`place order failed: ${res.status} ${txt}`);
      }
      const body = await res.json();
      // go to payment page (attach order id)
      router.push(`/payment?order=${body.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="mt-20 w-[65%]">
        <Link
          className="flex justify-self-start font-[sans-serif] text-xl font-[600] hover:text-[#9c9c9c] active:text-[#0067D1]"
          href="/product"
        >
          ↩ back to shopping
        </Link>
        <div className="flex justify-self-center pb-15 text-6xl font-[sans-serif] font-[700] text-nowrap drop-shadow-2xl cursor-default">
          Checkout
        </div>

        <div className="mb-11 relative gap-1 self-center justify-self-center top-0 w-[90%] bg-neutral-600/30 backdrop-blur-s m rounded-[40px] backdrop-opacity-10 border-2">
          <div className="pb-15 w-full flex justify-between">
            <span className="flex mt-6 ml-7 text-lg font-[sans-serif] font-[600] text-nowrap drop-shadow-2xl cursor-default">
              item list
            </span>
            <button
              onClick={async () => {
                // simple clear UI; ideally call backend to clear cart
                try {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
                    method: "DELETE",
                    credentials: "include",
                  });
                  setCart({ ...cart, items: [] });
                } catch (e) {
                  setError("clear cart failed");
                }
              }}
              className="flex mr-10 hover:text-[#ec0000] active:text-[#a30000] cursor-pointer text-neutral-400 grid place-self-end w-15 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-xl"
            >
              clear list
            </button>
          </div>

          <div className="pb-10 w-full">
            {loading ? (
              <span className="flex self-center justify-self-center cursor-default">
                Loading...
              </span>
            ) : cart && cart.items && cart.items.length > 0 ? (
              <div className="p-4">
                {cart.items.map((it) => (
                  <div
                    key={it.id ?? `${it.product_id}-${it.product?.id ?? ""}`}
                    className="flex justify-between py-2"
                  >
                    <div>
                      <div className="font-[600]">
                        {it.product?.title ??
                          it.product_name ??
                          `Product ${it.product_id}`}
                      </div>
                      <div className="text-sm text-neutral-400">
                        Qty: {it.qty ?? it.Qty}
                      </div>
                    </div>
                    <div className="font-[600]">
                      {((it.unit_price ?? it.UnitPrice) / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-end font-[700]">
                  Subtotal: {(computeSubtotal(cart.items) / 100).toFixed(2)} ฿
                </div>
              </div>
            ) : (
              <span className="flex self-center justify-self-center cursor-default">
                No item in the cart
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between font-[sans-serif] text-nowrap drop-shadow-2xl justify-self-center w-[90%]">
          <div className="justify-self-start flex flex-col ">
            <span className="pb-4 text-xl font-[500] cursor-default">
              Address
            </span>
            <form onSubmit={placeOrder}>
              <textarea
                id="address"
                name="address"
                rows="4"
                cols="50"
                placeholder="Enter your address here."
                className="w-85 text-lg caret-blue-500 border-2 border-solid resize-y rounded-md "
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <br />
              <input
                type="text"
                placeholder="order note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 mb-2 w-full border rounded p-1"
              />
              <input
                type="submit"
                value={placing ? "Placing..." : "Save & Place Order"}
                disabled={placing}
                className="grid place-items-center align-middle bg-[#0067D1] rounded-lg w-40 h-10 font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
              />
            </form>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>

          {/* <button
            onClick={toPayButton}
            className="flex justify-center items-center w-70 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
          >
            Continute to payment ≫
          </button> */}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="r-2" // Add your styling
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          {error && (
            <div className="absolute bottom-4 left-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
