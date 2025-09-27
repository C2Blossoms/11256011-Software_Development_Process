import CategoryLayout from "../components/CategoryLayout";
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
  title: "FitNest | Whey Protein",
  description: "Build up your Fit",
};
export default function Layout({ children }) {
  return <CategoryLayout title="Whey Protein Section">{children}</CategoryLayout>;
}
