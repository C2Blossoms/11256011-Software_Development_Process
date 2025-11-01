"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) {
      setError("Please enter your email");
      return false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError("Not a valid email format");
      return false;
    }

    if (!password) {
      setError("Please enter your password");
      return false;
    }

    setError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const url = `${API_URL}/auth/login`;
      console.log("POST", url, { email, password: "***" });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
      });

      const text = await res.text().catch(() => "");
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }

      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          text ||
          `Login failed (status ${res.status})`;
        setError(message);
        return;
      }

      // ตรวจสอบว่าเป็น admin หรือไม่ - ถ้าไม่ใช่ admin ให้ redirect ไปหน้า user login
      if (data?.user?.role !== "admin") {
        setError("This account is not an Admin account. Please login at User Login page");
        // ไม่เก็บ token หรือข้อมูล user
        setTimeout(() => {
          router.push(`/login?next=${encodeURIComponent(next || "/product")}`);
        }, 2000);
        return;
      }

      // เก็บ tokens จาก backend
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }
      if (data?.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // เก็บข้อมูล session (24 ชั่วโมง)
      const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
      const expiry = Date.now() + SESSION_TTL_MS;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInExpires", String(expiry));
      
      // เก็บข้อมูล user (ถ้ามี)
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // รีเฟรชหน้าเพื่อให้ PageNav อัพเดทสถานะ
      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 500);
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <Link href="/" className="logo">
          <img className="mt-15 w-70" src="/Vector.png" alt="Logo" />
        </Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-[50%] max-w-md mb-30 bg-neutral-600/30 backdrop-blur-sm rounded-[30px] border-2 p-8 space-y-6 text-white"
      >
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Navigation */}
        <ul className="flex justify-center gap-6 text-md font-bold">
          <li>
            <a
              href="/"
              rel="noopener noreferrer"
              className="text-[#0067D1] hover:underline underline-offset-2"
            >
              BACK TO HOME
            </a>
          </li>
          <li>
            <Link
              href="/login"
              className="text-[#0067D1] hover:underline underline-offset-2"
            >
              USER LOGIN
            </Link>
          </li>
        </ul>

        {/* Title */}
        <h2 className="text-center text-4xl font-bold">Admin Login</h2>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-lg font-bold">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-lg font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-[20px] px-4 bg-white text-black placeholder:text-gray-800 placeholder:font-semibold"
            placeholder="Enter here"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className={`mb-8 flex justify-self-center justify-center items-center w-50 h-13 rounded-xl text-xl font-[600] hover:bg-blue-800 active:bg-blue-900 hover:cursor-pointer transition ${
            loading
              ? "bg-neutral-700 text-neutral-400 opacity-60 hover:cursor-not-allowed hover:select-none"
              : "bg-[#0067D1] hover:bg-[#0040a1] active:border-3 border-[#0079e3] text-white"
          }`}
        >
          {loading ? "processing..." : "login ≫"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-gradient-to-b from-black to-[#1F1F1F] min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-[50%] max-w-md mb-30 bg-neutral-600/30 backdrop-blur-sm rounded-[30px] border-2 p-8 space-y-6 text-white">
            <p className="text-center">Loading...</p>
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

