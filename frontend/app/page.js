"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";

export default function Home() {
  return (
    <main className="h-screen bg-linear-to-t from-[#1F1F1F] to-black">
      <div className="w-screen h-screen items-center justify-center">
        <Swiper
          modules={[Mousewheel, Pagination]}
          direction="vertical"
          spaceBetween={6}
          slidesPerView={1}
          mousewheel={true}
          effect="fade"
          pagination={{ clickable: true }}
          loop={true}
          speed={800}
          className="h-full"
        >
          <SwiperSlide>
            <a className="w-screen h-screen" href="/dumbell">
              <img
                className="w-screen h-screen items-center justify-center z-1"
                src="/home-dumbbells.jpg"
              />
              <div className="absolute bottom-40 left-30 text-white drop-shadow-lg">
                <h2 className="text-5xl font-bold mb-2 text-shadow-lg/30">
                  Just Arrived!
                </h2>
                <p className="mt-4 text-4xl font-semibold text-shadow-lg/30">
                  DUMBELLS
                </p>
                <p className="mt-2 text-2xl text-shadow-lg/30 font-[KanitCustom]">
                  คอลเลคชันใหม่ที่จะช่วยยกระดับการยกน้ำหนักของคุณ
                </p>
              </div>
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a href="/treadmill">
              <img
                className="w-screen h-screen items-center justify-center z-1"
                src="/home-treadmills.jpg"
              />
              <div className="absolute bottom-40 left-30 text-white drop-shadow-lg">
                <h2 className="text-5xl font-bold mb-2 text-shadow-lg/30">
                  Just Arrived!
                </h2>
                <p className="mt-4 text-4xl font-semibold text-shadow-lg/30">
                  TREADMILLS
                </p>
                <p className="mt-2 text-2xl text-shadow-lg/30 font-[KanitCustom]">
                  อุปกรณ์การวิ่งที่จะทำให้คุณมีสุขภาพที่ดี
                </p>
              </div>
            </a>
          </SwiperSlide>
          <SwiperSlide>
            <a href="/whey_protein">
              <img
                className="w-screen h-screen items-center justify-center z-1"
                src="/home-whey.jpg"
              />
              <div className="absolute bottom-40 left-30 text-white drop-shadow-lg">
                <h2 className="text-5xl font-bold mb-2 text-shadow-lg/30">
                  Just Arrived!
                </h2>
                <p className="mt-4 text-4xl font-semibold text-shadow-lg/30">
                  WHEY PROTEIN
                </p>
                <p className="mt-2 text-2xl text-shadow-lg/30 font-[KanitCustom]">
                  อาหารเสริมสุขภาพเพื่อยกระดับร่างกายของคุณ
                </p>
              </div>
            </a>
          </SwiperSlide>
        </Swiper>
      </div>
    </main>
  );
}
