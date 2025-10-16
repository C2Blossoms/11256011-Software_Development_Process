import { useState } from "react";

export default function Footer() {
  const [theme, setTheme] = useState("light"); // สถานะธีมเริ่มต้น

  // ฟังก์ชันเปลี่ยนธีม
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <footer
      className={`${
        theme === "light" ? "bg-primary text-secondary" : "bg-gray-800 text-gray-200"
      } py-10`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* About Us */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">About Us</h2>
          <p className="text-sm leading-relaxed">
            FitNest is an online store dedicated to providing high-quality fitness equipment to help you achieve a healthy and strong lifestyle.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Quick Links</h2>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/products" className="hover:text-accent">
                Products
              </a>
            </li>
            <li>
              <a href="/promotions" className="hover:text-accent">
                Promotions
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-accent">
                FAQ
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> support@example.com
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span> 02-123-4567
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span> 123/45 Example Road, Bangkok 10110
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div
        className={`${
          theme === "light" ? "bg-secondary text-primary" : "bg-gray-700 text-gray-300"
        } text-center py-4 mt-8`}
      >
        <p className="text-sm">
          Follow Us:
          <a href="#" className="ml-2 hover:text-accent">
            Facebook
          </a>{" "}
          |{" "}
          <a href="#" className="ml-2 hover:text-accent">
            Instagram
          </a>{" "}
          |{" "}
          <a href="#" className="ml-2 hover:text-accent">
            YouTube
          </a>
        </p>
      </div>

      {/* ปุ่มเปลี่ยนสี */}
      <div className="text-center mt-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-dark"
        >
          Toggle Theme
        </button>
      </div>
    </footer>
  );
}