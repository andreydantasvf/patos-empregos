"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { openAuthModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    openAuthModal('register');
    router.replace('/');
  }, []);

  return null;
}
