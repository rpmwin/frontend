"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGlobalState } from "./globalcontext";


const ProtectedRoute = ({ children }) => {
  const { isConnected } = useGlobalState();
  const router = useRouter();

  useEffect(() => {
    console.log("is connected: ", isConnected);
    if (!isConnected) {
      router.push("/connect");
    }
  }, [isConnected, router]);

  return isConnected ? children : null; // Render the children only if connected
};

export default ProtectedRoute;
