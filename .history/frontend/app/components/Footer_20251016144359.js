export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} FitNest. All rights reserved.</p>
        <p>Powered by Next.js and Tailwind CSS</p>
      </div>
    </footer>
  );
}