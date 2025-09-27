import PageNav from "./PageNav";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

export default function CategoryLayout({ children }) {
  return (
      <div>
        <PageNav />
        {children}
      </div>
  );
}
