"use client";

import { useState } from "react";
import Link from "next/link";

export default function PageNav() {
  const [isOpen, setIsOpen] = useState(false);
  function rockinButton() {
    window.open("http://localhost:3000/Register", "_blank");
  }
  return (
    <>
      <div className="w-screen h-0 z-2">
        <ul className="nav-list relative top-10 justify-center flex items-center gap-[5%] font-[sans-serif] text-xl font-[700] text-nowrap drop-shadow-2xl z-4">
          <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
            <a href="/" rel="noopener noreferrer">
              HOME
            </a>
          </li>
          <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
            <a href="/dumbell" rel="noopener noreferrer">
              DUMBBELLS
            </a>
          </li>
          <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl">
            <a href="/treadmill" rel="noopener noreferrer">
              TREADMILLS
            </a>
          </li>
          <li className="nav-item active:text-[#0067D1] hover:underline underline-offset-2 text-shadow-lg/30 drop-shadow-2xl ">
            <a href="/whey_protein" rel="noopener noreferrer">
              WHEY PROTEIN
            </a>
          </li>
          <li className="nav-item relative -top-[0.8] text-3xl font-[100] underline-offset-2 text-shadow-lg/30 drop-shadow-2xl cursor-default">
            |
          </li>
          <li>
            <button
            // onClick={rockinButton}
            className="rock relative float-right right-[6%] w-30 h-10 font-[700] bg-[#606060] hover:bg-[#0067D1] active:bg-[#003770] rounded-xl focus:outline-2 focus:outline-[#0067D1] z-5">
            Login 
          </button>
          </li>
        </ul>

        <div className="relative justify-center flex items-center top-20">
          <Link href="/" className="logo">
            <img className="w-300" src="/Vector.png"/>
          </Link>
        </div>
    </div>
    </>
  );
}
