"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order_id");
  const intentId = searchParams?.get("intent_id");

  const [slip, setSlip] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlip(URL.createObjectURL(file));
      // Store the file for upload
      setSlip({
        preview: URL.createObjectURL(file),
        file: file,
      });
    }
  };

  const handleConfirm = async () => {
    if (!slip?.file) {
      setError("Please upload payment slip first");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // First upload the slip
      const formData = new FormData();
      formData.append("slip", slip.file);
      formData.append("order_id", orderId);
      formData.append("intent_id", intentId);

      const uploadRes = await fetch(
        "http://localhost:8000/payments/upload-slip",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload slip");
      }

      // Then mark the payment as paid
      const markPaidRes = await fetch(
        "http://localhost:8000/payments/mock/mark-paid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            intent_id: intentId,
          }),
        }
      );

      if (!markPaidRes.ok) {
        throw new Error("Failed to confirm payment");
      }

      // If both successful, redirect to success page
      router.push("/payment/pay_done");
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setError(err.message || "Failed to process payment");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="flex justify-center w-[100%]">
        <ul className="font-[sans-serif] text-nowrap drop-shadow-2xl">
          <li>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
                {error}
              </div>
            )}

            <button
              onClick={() => router.push("/checkout")}
              className="mt-30 mb-7 text-lg cursor-pointer hover:text-red-700 hover:underline"
            >
              ✕ cancel
            </button>

            <img className="mb-8 w-100" src="/myqr.png" alt="QR Code" />

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
              onClick={handleConfirm}
              disabled={uploading || !slip}
              className={`mb-30 flex justify-self-center justify-center items-center w-70 h-13 rounded-xl text-xl font-[600] ${
                uploading || !slip
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#0067D1] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
              }`}
            >
              {uploading ? "Processing..." : "Confirm the payment ✓"}
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
}
export default function PaymentPage() {
  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <Suspense
        fallback={
          <div className="flex justify-center w-[100%]">
            <div className="text-white">Loading payment details...</div>
          </div>
        }
      >
        <PaymentForm />
      </Suspense>
    </main>
  );
}
