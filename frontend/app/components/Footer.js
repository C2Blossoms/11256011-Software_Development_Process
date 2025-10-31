"use client";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/", pathname === '/payment') return null;

  return (
    <footer className="bg-black text-gray-400 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-center md:text-left">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Links</h2>
          <ul className="text-sm grid grid-cols-2 gap-x-1 gap-y-2">
            <li><a href="/" className="hover:text-gray-200">Home</a></li>
            <li><a href="/product" className="hover:text-gray-200">Dumbbell</a></li>
            <li><a href="/login" className="hover:text-gray-200">Login</a></li>
            <li><a href="/product" className="hover:text-gray-200">Whey Protein</a></li>
            <li><a href="/privacy_policy" className="hover:text-gray-200">Privacy Policy</a></li>
            <li><a href="/product" className="hover:text-gray-200">Treadmill</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Contact Us</h2>
          <p className="text-sm">
            <span className="font-semibold">Admin Nice:</span> Phakawat Pichainarong
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> Nice@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span> 555-123-4567
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span> KMITL Prince of Chumphon 
          </p>
        </div>

        {/* About Us */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">About Us</h2>
          <p className="text-sm leading-relaxed">
            One-stop center for fitness equipment and nutritional supplements.
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span> 123/45 ถนนสุขภาพดี ตำบลฟิตเนส อำเภอเมือง จังหวัดชุมพร 86120
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span> 555-123-4567 | <span className="font-semibold">Email:</span> Fitnest@gmail.com
          </p>
          <p className="text-sm">
            <span className="font-semibold">Business Hours:</span>  Every day, 9:00 AM – 6:00 PM
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-black text-center py-4 mt-8 border-t border-gray-700">
        <p className="text-sm">
          Follow Us: 
          <a href="https://www.facebook.com/keiyrtiys.canthr.pheng/posts/pfbid02Woa748Pn4xTDoojPB5qa1sQQkFnjD63DaY4QiUTdJmWZBDfDw1b4vBaqokKqSVvYl" target="_blank" className="ml-2 text-gray-400 hover:text-white transition-colors">Facebook</a> | 
          <a href="https://www.instagram.com/therealjoeishungry/reels/" className="ml-2 text-gray-400 hover:text-white transition-colors">Instagram</a> | 
          <a href="https://www.youtube.com/@Khanomkheng" className="ml-2 text-gray-400 hover:text-white transition-colors">YouTube</a>
        </p>
      </div>
    </footer>
  );
}