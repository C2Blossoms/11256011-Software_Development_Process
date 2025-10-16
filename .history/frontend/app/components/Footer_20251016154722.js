export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Links</h2>
          <ul className="text-sm space-y-2">
            <li><a href="/dumbell" className="hover:text-gray-200">Bumbell</a></li>
            <li><a href="/PrivacyPolicy" className="hover:text-gray-200">PrivacyPolicy</a></li>
            <li><a href="/treadmill" className="hover:text-gray-200">Treadmill</a></li>
            <li><a href="/whey" className="hover:text-gray-200">Privacy Policy</a></li>
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
            <span className="font-semibold">Phone:</span> 02-123-4567
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span> 123 Fitnest ,Chumphon,Thailand 86120
          </p>
        </div>

        {/* About Us */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">About Us</h2>
          <p className="text-sm leading-relaxed">
            ศูนย์รวมอาหารเสริมและอุปกรณ์ฟิตเนส ครบ จบในที่เดียว
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-black text-center py-4 mt-8 border-t border-gray-700">
        <p className="text-sm">
          Follow Us: 
          <a href="#" className="ml-2 text-gray-400 hover:text-white transition-colors">Facebook</a> | 
          <a href="#" className="ml-2 text-gray-400 hover:text-white transition-colors">Instagram</a> | 
          <a href="#" className="ml-2 text-gray-400 hover:text-white transition-colors">YouTube</a>
        </p>
      </div>
    </footer>
  );
}