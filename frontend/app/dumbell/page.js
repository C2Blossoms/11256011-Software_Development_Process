"use client";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";

export default function DumbellPage() {
  return (
    <main className="w-screen h-full bg-linear-to-t from-[#1F1F1F] to-black overscroll-contain">
      <div className="absolute flex justify-evenly justify-self-center gap-50 top-120 w-[85%] h-full bg-neutral-600/30 backdrop-blur-s m rounded-[40px] backdrop-opacity-10 border-2">
        <div className="sticky top-0 order-1 ml-10 mt-15 h-80 w-40">
          <div className="pb-8 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
            Select Fillter
          </div>
          <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl">
            Brand
          </span>
          <div className="pb-4 grid w-40">
            <select className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-50 bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10">
              <option>All</option>
              <option>brand1</option>
              <option>brand2</option>
            </select>
            <img
              src="selec-1.png"
              className="mr-1.5 pointer-events-none flex self-center justify-self-end-safe w-5 col-start-1 row-start-1 z-20"
            />
          </div>
          <span className="font-[sans-serif] text-xl font-[400] text-nowrap drop-shadow-2xl">
            Price
          </span>
          <div className="grid w-40">
            <select className="pl-1 col-start-1 row-start-1 appearance-none bg-gray-50 bg-gray-800 border-2 rounded w-40 font-[sans-serif] text-lg font-[500] text-nowrap drop-shadow-2xl z-10">
              <option>All</option>
              <option>under 500$</option>
              <option>500 - 1000$ </option>
              <option>over 1000$ </option>
            </select>
            <img
              src="selec-1.png"
              className="mr-1.5 pointer-events-none flex self-center justify-self-end-safe w-5 col-start-1 row-start-1 z-20"
            />
          </div>
        </div>
        <div className="flex justify-center order-2 mt-15 h-full w-[60%] font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
          Product
        </div>
        <div className="sticky top-0 mr-10 flex justify-start justify-self-end-safe order-3 mt-15 h-full w-70 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
          Shopping Cart
        </div>
      </div>
    </main>
  );
}
