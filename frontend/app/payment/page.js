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
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20] pb-20">
      <div className="w-full max-w-2xl px-6 mt-12">
        <button
          onClick={cancelButton}
          className="mb-6 text-lg cursor-pointer hover:text-red-400 hover:underline text-white transition-colors inline-flex items-center gap-2"
        >
          ✕ ยกเลิก
        </button>

        <div className="bg-neutral-600/30 backdrop-blur-sm rounded-3xl backdrop-opacity-10 border-2 border-gray-700/50 shadow-xl p-8">
          {order && (
            <div className="mb-6 text-center pb-6 border-b border-gray-700/50">
              <div className="text-sm text-gray-400 mb-2">ยอดที่ต้องชำระ</div>
              <div className="text-4xl text-yellow-400 font-bold">
                ฿{order.total.toFixed(2)}
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">ชำระเงินผ่านพร้อมเพย์</h2>
              <p className="text-gray-400 text-sm">สแกน QR Code เพื่อโอนเงิน</p>
            </div>
            
            <div className="flex justify-center">
              <img 
                className="w-full max-w-sm" 
                src="/myqr.png" 
                alt="พร้อมเพย์ QR Code"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>

            <div className="mt-4 text-center text-gray-400 text-xs">
              <p>ชื่อ: นาย พงศ์พณิช อินทร์เทพ</p>
              <p>บัญชี: xxx-x-x0953-x</p>
              <p>รับเงินได้จากทุกธนาคาร</p>
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="upload-slip"
              className="cursor-pointer flex justify-center items-center gap-2 w-full h-14 bg-gradient-to-r from-[#0067D1] to-[#0040a1] rounded-xl text-lg font-[600] text-white hover:from-[#0040a1] hover:to-[#0067D1] transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              อัปโหลดสลิปการโอนเงิน
            </label>
            <input
              id="upload-slip"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />

            {slip?.preview && (
              <div className="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <p className="text-white text-sm font-medium">ตัวอย่างสลิปที่อัปโหลด:</p>
                <img
                  src={slip.preview}
                  alt="Uploaded slip"
                  className="rounded-lg max-h-64 border-2 border-gray-500 shadow-md"
                />
              </div>
            )}

            <button
              onClick={confrimButton}
              disabled={!slip || processing}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-lg font-[600] cursor-pointer hover:from-green-700 hover:to-green-600 active:scale-95 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:active:scale-100 text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังประมวลผล...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ยืนยันการชำระเงิน</span>
                </>
              )}
            </button>
          </div>
        </div>
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
