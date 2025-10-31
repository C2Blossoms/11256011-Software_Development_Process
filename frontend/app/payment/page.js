"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const [slip, setSlip] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlip(URL.createObjectURL(file));
    }
  };
  function cancelButton() {
    router.push("/checkout");
  }
  function confrimButton() {
    router.push("/payment/pay_done");
  }
  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="flex justify-center w-[100%]">
        <ul className="font-[sans-serif] text-nowrap drop-shadow-2xl">
          <li>
            <button
              onClick={cancelButton}
              className="mt-30 mb-7 text-lg cursor-pointer hover:text-red-700 hover:underline"
            >
              ✕ cancel
            </button>
            <img className=" mb-8 w-100" src="myqr.png" />
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

            {slip && (
              <div className="flex flex-col items-center gap-2 mb-10">
                <p className="text-white text-lg font-medium">Preview:</p>
                <img
                  src={slip}
                  alt="Uploaded slip"
                  className="rounded-lg max-h-80 border border-gray-500 shadow-md"
                />
              </div>
            )}
            <button
              onClick={confrimButton}
              className="mb-30 flex justify-self-center justify-center items-center w-70 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
            >
              Confrim the payment ✓
            </button>
          </li>
        </ul>
      </div>
    </main>
  );
}
