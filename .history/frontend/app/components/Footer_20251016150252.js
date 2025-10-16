export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 px-4">
        {/* ฝั่งซ้าย */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold">&copy; {new Date().getFullYear()} FitNest</h1>
          <p className="text-sm">จัดทำโดย: สมาชิก 5 คน</p>
        </div>

        {/* ฝั่งขวา */}
        <div className="space-y-2 text-sm">
          
          <p>
            <span className="font-semibold">Email:</span> example@gmail.com
          </p>
          <p>
            <span className="font-semibold">ที่อยู่ร้าน:</span> 123/45 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10110
          </p>
          <p>
            <span className="font-semibold">ติดต่อ Admin:</span> 09:00 - 18:00 น.
          </p>
        </div>
      </div>
    </footer>
  );
}