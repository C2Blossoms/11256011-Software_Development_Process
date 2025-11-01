"use client";

import { useEffect } from "react";
import { setupTokenRefresh } from "@/utils/auth";

export default function TokenRefreshProvider({ children }) {
  useEffect(() => {
    setupTokenRefresh();
  }, []);

  return children;
}
