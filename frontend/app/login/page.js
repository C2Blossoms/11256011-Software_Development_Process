"use client";

import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/pagination";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/" className="logo">
          <img className="mt-15 w-70" src="/Vector.png" alt="Logo" />
        </Link>
      </div>

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
        <h2 className="text-center text-4xl font-bold">Login</h2>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-lg font-bold">Username</label>
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

        {/* Button */}
        <button
          onClick={() => {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "/dumbell";
          }}
          className="mb-8 flex justify-self-center justify-center items-center w-50 h-13 bg-[#0067D1] rounded-xl text-xl font-[600] hover:bg-blue-800 active:bg-blue-900 hover:cursor-pointer transition"
        >
          login ≫
        </button>

        {/* Register Link */}
        <p className="text-center text-md">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-md text-[#0067D1] hover:underline"
          >
            register
          </Link>
        </p>

        {/* === ADDED SECTION START === */}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px w-full bg-neutral-500"></div>
          <span className="text-sm text-neutral-400">OR</span>
          <div className="h-px w-full bg-neutral-500"></div>
        </div>

        {/* Google Login Button */}
        <button className="mx-auto flex w-[80%] items-center justify-center gap-3 rounded-[50px] bg-white py-3 font-semibold text-black transition hover:bg-gray-200">
          {/* Google Logo SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          <span>login with Google</span>
        </button>

        {/* === ADDED SECTION END === */}
      </div>
    </main>
  );
}
