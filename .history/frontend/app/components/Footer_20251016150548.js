export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* ข้อมูลเกี่ยวกับบริษัท */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">เกี่ยวกับเรา</h2>
          <p className="text-sm">
            FitNest เป็นร้านค้าออนไลน์ที่มุ่งมั่นในการจัดหาอุปกรณ์ออกกำลังกายคุณภาพสูงเพื่อช่วยให้คุณมีสุขภาพที่ดีและชีวิตที่แข็งแรง
          </p>
        </div>

        {/* ลิงก์สำคัญ */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">ลิงก์สำคัญ</h2>
          <ul className="text-sm space-y-2">
            <li><a href="/products" className="hover:underline">สินค้า</a></li>
            <li><a href="/promotions" className="hover:underline">โปรโมชั่น</a></li>
            <li><a href="/faq" className="hover:underline">คำถามที่พบบ่อย</a></li>
            <li><a href="/privacy-policy" className="hover:underline">นโยบายความเป็นส่วนตัว</a></li>
          </ul>
        </div>

        {/* ข้อมูลติดต่อ */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">ติดต่อเรา</h2>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> support@example.com
          </p>
          <p className="text-sm">
            <span className="font-semibold">เบอร์โทร:</span> 02-123-4567
          </p>
          <p className="text-sm">
            <span className="font-semibold">ที่อยู่:</span> 123/45 ถนนตัวอย่าง กรุงเทพฯ 10110
          </p>
        </div>
      </div>

      {/* โซเชียลมีเดีย */}
      <div className="bg-gray-800 text-center py-4 mt-8">
        <p className="text-sm">ติดตามเรา: 
          <a href="#" className="ml-2 hover:underline">Facebook</a> | 
          <a href="#" className="ml-2 hover:underline">Instagram</a> | 
          <a href="#" className="ml-2 hover:underline">YouTube</a>
        </p>
      </div>
    </footer>
  );
}