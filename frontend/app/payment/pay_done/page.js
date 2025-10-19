"use client";

import { useState } from "react";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";
import Link from "next/link";

export default function PaymentPage() {
  const [slip, setSlip] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlip(URL.createObjectURL(file));
    }
  };
  function cancelButton() {
    window.open("http://localhost:3000/checkout");
  }

  return (
    <main className="flex justify-center bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="flex justify-center w-[100%]">
        <p className="self-center font-[sans-serif] text-nowrap drop-shadow-2xl">
          <p1 className="flex justify-self-center text-4xl font-[600] mb-10">
            Your order has been received
          </p1>
          <br />
          <p2 className="text-xl">
            Thank you for your order. We will begin processing it very shortly. You
            can return to the home page by clicking{" "}
          </p2>
          <Link href="/">
            <label className="text-xl text-blue-500 font-[600] hover:text-blue-700 hover:underline">
              here.
            </label>
          </Link>
        </p>
      </div>
    </main>
  );
}
