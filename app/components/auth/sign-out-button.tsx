"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  className?: string;
  variant?: "ghost" | "link" | "primary" | "soft";
};

export function SignOutButton({
  className,
  variant = "ghost"
}: SignOutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      window.alert("로그아웃하지 못했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className={className}
      type="button"
      variant={variant}
      onClick={handleSignOut}
      disabled={isSubmitting}
    >
      {isSubmitting ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
