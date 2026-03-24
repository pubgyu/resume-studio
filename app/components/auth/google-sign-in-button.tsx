"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ButtonSize, ButtonVariant } from "@/app/components/ui/button";

type GoogleSignInButtonProps = {
  children?: ReactNode;
  className?: string;
  nextPath?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function GoogleSignInButton({
  children,
  className,
  nextPath = "/",
  size = "default",
  variant = "primary"
}: GoogleSignInButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!hasSupabaseEnv()) {
      window.alert("Supabase 환경 변수가 설정되지 않았습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = new URL("/auth/callback", window.location.origin);

      redirectTo.searchParams.set("next", nextPath);

      const { error } = await supabase.auth.signInWithOAuth({
        options: {
          redirectTo: redirectTo.toString()
        },
        provider: "google"
      });

      if (error) {
        throw error;
      }
    } catch {
      window.alert("Google 로그인을 시작하지 못했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className={className}
      type="button"
      variant={variant}
      size={size}
      onClick={handleSignIn}
      disabled={isSubmitting}
    >
      {isSubmitting ? "이동 중..." : (children ?? "Google로 로그인")}
    </Button>
  );
}
