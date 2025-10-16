import CategoryLayout from "../components/CategoryLayout";
import Footer from "../components/Footer"; // Import Footer Component
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FitNest | Footer",
  description: "Build up your Fit",
};

export default function Layout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <CategoryLayout title="Footer">{children}</CategoryLayout>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}
