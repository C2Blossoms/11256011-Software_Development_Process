"use client";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";

export default function WheyProtienPage() {
  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen bg-[1d1d20]">
      <div className="relative gap-1 self-center justify-self-center top-0 w-[90%] bg-neutral-600/30 backdrop-blur-s m rounded-[40px] backdrop-opacity-10 border-2">
        <div className="w-[100%] flex justify-evenly justify-self-center h-full">
          <div className="sticky flex flex-col top-0 order-1 ml-10 mt-15 h-80 w-[16%] font-[sans-serif]">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
              Selection Filter
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
          <div className="flex justify-center order-2 mt-15 h-full w-[62%] font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
            Product
          </div>
          <div className="sticky top-0 mr-6 flex flex-col order-3 mt-15 h-[20%] w-[22%] font-[sans-serif]">
            <div className="pb-5 font-[sans-serif] text-xl font-[600] text-nowrap drop-shadow-2xl">
              Shopping Cart
            </div>
            <div className="w-48 active:text-[#0067D1] hover:underline underline-offset-2 font-[sans-serif] text-lg font-[400] text-nowrap drop-shadow-2xl">
              <a href="/" rel="noopener noreferrer">
                continue to checkout ≫
              </a>
            </div>
            <button className="hover:text-[#ec0000] active:text-[#0067D1] cursor-pointer text-neutral-400 grid place-self-end w-15 font-[sans-serif] text-md font-thin text-nowrap drop-shadow-xl">
              clear all
            </button>
          </div>
        </div>
        
      </div>
    </main>
  );
}
