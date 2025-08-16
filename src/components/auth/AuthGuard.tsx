"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("authToken");
    if (!authData) {
      router.push("/signin");
      return;
    }

    const { expiry } = JSON.parse(authData);
    if (Date.now() > expiry) {
      localStorage.removeItem("authToken");
      router.push("/signin");
    }
  }, [router]);

  return <>{children}</>;
}
