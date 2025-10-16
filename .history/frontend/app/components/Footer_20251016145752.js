export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} Your Website</p>
        <p className="text-sm">Email: example@gmail.com</p>
        <p className="text-sm">จัดทำโดย: สมาชิก 5 คน</p>
        <p className="text-sm">ที่อยู่ร้าน: 123/45 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10110</p>
        <p className="text-sm">ติดต่อ Admin: 09:00 - 18:00 น.</p>
      </div>
    </footer>
  );
}