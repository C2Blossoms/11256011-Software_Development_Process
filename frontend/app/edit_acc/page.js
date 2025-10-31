"use client";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";

export default function editPage() {
  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen flex flex-col items-center justify-center px-4">
      {/* Form Container */}
      <div className="w-[50%] max-w-md mb-30 bg-neutral-600/30 backdrop-blur-sm rounded-[30px] border-2 p-8 space-y-6 text-white">
        {/* Navigation */}
        <ul className="flex justify-center gap-6 text-md font-bold">
          <li>
            <a
              href="/dumbell"
              rel="noopener noreferrer"
              className="text-[#0067D1] hover:underline underline-offset-2"
            >
              BACK TO HOME
            </a>
          </li>
        </ul>

        {/* Title */}
        <h2 className="text-center text-4xl font-bold">Edit Profile</h2>
        {/* New Username */}
        <div className="space-y-2">
          <label className="text-lg font-bold">New Username</label>
          <input
            type="text"
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-lg font-bold">Password</label>
          <input
            type="password"
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-lg font-bold">New Password</label>
          <input
            type="password"
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
            />
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label className="text-lg font-bold">Confirm New Password</label>
          <input
            type="password"
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
          />
        </div>

        {/* Button */}
        <button
          //onClick={confrimButton}
          className="mb-8 flex justify-self-center justify-center items-center w-50 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] cursor-pointer hover:bg-[#0040a1] active:border-3 border-[#0079e3]"
        >
          Submit Changes
        </button>

        <a
          rel="noopener noreferrer"
          className="font-bold flex justify-center text-[#0067D1] hover:underline underline-offset-2"
        >
        Cancel Changes
        </a>

        {/* === ADDED SECTION END === */}
      </div>
    </main>
  );
}
