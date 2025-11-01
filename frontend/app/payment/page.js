"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id");
  
  const [slip, setSlip] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    if (orderId) {
      createPaymentIntent();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/checkout");
        return;
      }

      const response = await fetch(`${API_URL}/payments/intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: parseInt(orderId),
        }),
      });

      if (response.ok) {
        const intentData = await response.json();
        setPaymentIntent(intentData);
        setOrder({ total: intentData.amount / 100 });
      } else {
        alert("ไม่สามารถสร้าง payment intent ได้");
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Error creating payment intent:", err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlip({
        preview: URL.createObjectURL(file),
        file: file,
      });
    }
  };
  
  const cancelButton = () => {
    router.push("/checkout");
  };
  
  const confrimButton = async () => {
    if (!paymentIntent || !slip) {
      alert("กรุณาอัปโหลดสลิปการโอนเงิน");
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        return;
      }

      const response = await fetch(`${API_URL}/payments/mock/mark-paid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent_id: paymentIntent.intent_id,
        }),
      });

      if (response.ok) {
        router.push("/payment/pay_done");
      } else {
        const errorData = await response.json().catch(() => ({ error: "เกิดข้อผิดพลาด" }));
        alert(errorData.error || "ไม่สามารถยืนยันการชำระเงินได้");
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center mt-40">
          <div className="text-xl">กำลังโหลดข้อมูลการชำระเงิน...</div>
        </div>
      </main>
    );
  }
  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="flex justify-center w-[100%]">
        <ul className="font-[sans-serif] text-nowrap drop-shadow-2xl">
          <li>
            <button
              onClick={cancelButton}
              className="mt-30 mb-7 text-lg cursor-pointer hover:text-red-700 hover:underline text-white"
            >
              ✕ cancel
            </button>
            {order && (
              <div className="mb-4 text-white text-center">
                <div className="text-xl font-semibold mb-2">ยอดที่ต้องชำระ</div>
                <div className="text-3xl text-yellow-400 font-bold">
                  ฿{order.total.toFixed(2)}
                </div>
              </div>
            )}
            <img className=" mb-8 w-100" src="myqr.png" alt="QR Code" />
            <label
              htmlFor="upload-slip"
              className="mb-5 cursor-pointer flex justify-self-center justify-center flex-col items-center justify-center w-70 h-13 bg-[#0067D1] rounded-xl text-lg font-[600] text-white hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
            >
              Upload Payment Slip
            </label>
            <input
              id="upload-slip"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            {slip?.preview && (
              <div className="flex flex-col items-center gap-2 mb-10">
                <p className="text-white text-lg font-medium">Preview:</p>
                <img
                  src={slip.preview}
                  alt="Uploaded slip"
                  className="rounded-lg max-h-80 border border-gray-500 shadow-md"
                />
              </div>
            )}

            <button
              onClick={confrimButton}
              disabled={!slip || processing}
              className="mb-30 flex justify-self-center justify-center items-center w-70 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3] disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
            >
              {processing ? "กำลังประมวลผล..." : "Confrim the payment ✓"}
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
        <div className="text-white text-center mt-40">
          <div className="text-xl">กำลังโหลด...</div>
        </div>
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}
