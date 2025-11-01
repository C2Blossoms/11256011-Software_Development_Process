"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

export default function PageNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const hiddenPaths = [
    "/",
    "/register",
    "/login",
    "/payment",
    "/payment/pay_done",
    "/edit_acc",
  ];

  //logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // เรียก API logout เพื่อ revoke refresh token (optional)
      if (refreshToken) {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
        } catch (err) {
          console.error("Logout API call failed:", err);
          // Continue with local logout even if API fails
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // ล้างข้อมูลใน localStorage
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loggedInExpires");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("authToken"); // remove old token key
      localStorage.removeItem("user");
      
      setLoggedIn(false);
      setOpenMenu(false);
      
      // รีเฟรชหน้าและ redirect
      router.push("/");
      router.refresh();
    }
  }, [router]);

  const handleLogout = logout;

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("loggedIn");
      const accessToken = localStorage.getItem("access_token");
      const expires = parseInt(
        localStorage.getItem("loggedInExpires") || "0",
        10
      );
      
      // เช็คว่า logged in และยังไม่หมดอายุ และมี access_token
      if (token === "true" && accessToken && expires && Date.now() < expires) {
        setLoggedIn(true);
      } else {
        // expired or not logged
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedInExpires");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLoggedIn(false);
      }
    };

    // เช็คตอนแรก
    checkLogin();
    
    // also listen storage event (tabs)
    const onStorage = (e) => {
      if (e.key === "loggedIn" || e.key === "loggedInExpires" || e.key === "access_token") {
        checkLogin();
      }
    };
    window.addEventListener("storage", onStorage);
    
    // เช็ค auto-logout เมื่อหมดอายุ
    const token = localStorage.getItem("loggedIn");
    const expires = parseInt(localStorage.getItem("loggedInExpires") || "0", 10);
    let timeoutId = null;
    if (token === "true" && expires && Date.now() < expires) {
      const remaining = expires - Date.now();
      if (remaining > 0 && remaining < 60 * 60 * 1000) { // ถ้าเหลือเวลาน้อยกว่า 1 ชั่วโมง
        timeoutId = setTimeout(() => {
          logout();
        }, remaining);
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname, logout]); // Added logout to dependencies

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (hiddenPaths.includes(pathname)) return null;

  const goToLogin = () => {
    // pass current page for redirect after login
    router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
  };
  
  return (
    // <div className="bg-black h-110">
    //   <ul className="nav-list flex justify-center items-center gap-[5%] text-xl font-bold text-white pt-10">

    //     <li><Link href="/">HOME</Link></li>
    //     <li><Link href="/dumbell">DUMBBELLS</Link></li>
    //     <li><Link href="/treadmill">TREADMILLS</Link></li>
    //     <li><Link href="/whey_protein">WHEY PROTEIN</Link></li>

    //     <li className="text-3xl font-light">|</li>
    <div className="bg-black h-110 z-3">
      <ul className="nav-list relative top-10 justify-center flex items-center gap-[5%] font-[sans-serif] text-xl font-[700] text-nowrap drop-shadow-2xl z-4">
        <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
          <a href="/" rel="noopener noreferrer">
            HOME
          </a>
        </li>
        <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
          <a href="/product" rel="noopener noreferrer">
            DUMBBELLS
          </a>
        </li>
        <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
          <a href="/product" rel="noopener noreferrer">
            TREADMILLS
          </a>
        </li>
        <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl ">
          <a href="/product" rel="noopener noreferrer">
            WHEY PROTEIN
          </a>
        </li>
        <li className="nav-item relative -top-[0.8] text-3xl font-[100] underline-offset-2 text-shadow-lg/30 drop-shadow-2xl cursor-default">
          |
        </li>
        {!loggedIn && (
          <li>
            <button
              onClick={goToLogin}
              className="bg-gray-600 hover:bg-blue-600 active:bg-blue-800 px-4 py-2 rounded-xl"
            >
              Login
            </button>
          </li>
        )}

        {loggedIn && (
          <li className="relative " ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="bg-gray-700 px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Profile ▼
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-40 z-20">
                <button
                  onClick={() => router.push("/edit_acc")}
                  className="block p-2 hover:bg-gray-200 w-full text-left"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block p-2 hover:bg-gray-200 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>

      {/* <div className="flex justify-center pt-10">
        <Link href="/">
          <img src="/Vector.png" className="w-72" />
        </Link>
      </div>
    </div>
  );
} */}

      <div className="relative justify-self-center justify-center flex w-140 items-center top-20 z-10">
        <Link href="/" className="logo ">
          <img className="w-130 " src="/Vector.png" />
        </Link>
      </div>
    </div>
  );
}
