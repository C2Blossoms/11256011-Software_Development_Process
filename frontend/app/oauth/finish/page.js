"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function OAuthFinishPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          method: "GET",
          credentials: "include", // ส่งคุกกี้ไปด้วย
          headers: { "Accept": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data?.data ?? data);
          setStatus("success");
          // ไปหน้า product หลังแสดงผลสักครู่
          setTimeout(() => router.replace("/product"), 1200);
        } else {
          setStatus("error");
        }
      } catch (e) {
        setStatus("error");
      }
    })();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 p-8 text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-2">กำลังยืนยันการเข้าสู่ระบบ…</h1>
            <p className="text-neutral-400">โปรดรอสักครู่</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-2">เข้าสู่ระบบสำเร็จ ✅</h1>
            <p className="text-neutral-300">
              {user?.name ? `ยินดีต้อนรับ, ${user.name}` : "ยินดีต้อนรับ!"}
            </p>
            <p className="text-neutral-400 mt-2">กำลังพาไปหน้าสินค้า…</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-2">เข้าสู่ระบบไม่สำเร็จ ❌</h1>
            <p className="text-neutral-400">
              ไม่พบ session จาก Google OAuth ลองใหม่อีกครั้ง
            </p>
            <a
              href="/login"
              className="inline-block mt-6 rounded-xl bg-white px-5 py-2 text-black font-semibold"
            >
              กลับไปหน้า Login
            </a>
          </>
        )}
      </div>
    </main>
  );
}
