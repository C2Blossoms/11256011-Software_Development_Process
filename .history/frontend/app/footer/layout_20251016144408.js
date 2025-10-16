import Footer from "../components/Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen"> {/* ใช้ Flexbox */}
      <header className="bg-gray-800 text-white p-4">Header Content</header>
      <main className="flex-grow">{children}</main> {/* เนื้อหาหลัก */}
      <Footer /> {/* Footer จะอยู่ล่างสุด */}
    </div>
  );
}
