export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
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
            <li><a href="/products" className="hover:text-gray-400">Products</a></li>
            <li><a href="/promotions" className="hover:text-gray-400">Promotions</a></li>
            <li><a href="/faq" className="hover:text-gray-400">FAQ</a></li>
            <li><a href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</a></li>
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
      <div className="bg-gray-800 text-center py-4 mt-8">
        <p className="text-sm">
          Follow Us: 
          <a href="#" className="ml-2 hover:text-gray-400">Facebook</a> | 
          <a href="#" className="ml-2 hover:text-gray-400">Instagram</a> | 
          <a href="#" className="ml-2 hover:text-gray-400">YouTube</a>
        </p>
      </div>
    </footer>
  );
}