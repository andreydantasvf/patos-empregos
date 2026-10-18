"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    openAuthModal('login');
    router.replace('/');
  }, []);

  return null;
}
