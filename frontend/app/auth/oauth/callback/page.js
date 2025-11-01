"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams?.get("access_token");
    const refreshToken = searchParams?.get("refresh_token");
    const userId = searchParams?.get("user_id");
    const userEmail = searchParams?.get("user_email");
    const userName = searchParams?.get("user_name");
    const userRole = searchParams?.get("user_role");

    if (!accessToken || !refreshToken) {
      console.error("Missing tokens in OAuth callback");
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
      router.push("/login");
      return;
    }

    try {
      // เก็บ tokens ใน localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      
      // เก็บข้อมูล session (24 ชั่วโมง)
      const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
      const expiry = Date.now() + SESSION_TTL_MS;
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInExpires", String(expiry));
      
      // เก็บข้อมูล user
      if (userId && userEmail && userName && userRole) {
        localStorage.setItem("user", JSON.stringify({
          id: parseInt(userId),
          email: userEmail,
          name: userName,
          role: userRole,
        }));
      }

      // Redirect ไปหน้า product
      router.push("/product");
      router.refresh();
    } catch (err) {
      console.error("Error processing OAuth callback:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลการเข้าสู่ระบบ");
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-[#1F1F1F]">
      <div className="text-center text-white">
        <div className="text-xl mb-4">กำลังเข้าสู่ระบบ...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black to-[#1F1F1F]">
          <div className="text-center text-white">
            <div className="text-xl mb-4">กำลังโหลด...</div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}

