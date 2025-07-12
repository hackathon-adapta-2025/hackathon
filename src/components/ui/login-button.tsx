"use client";
import { useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/actions/auth";
import { Button } from "./button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { cn } from "@/utils/cn";

interface LoginButtonProps {
  className?: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export function LoginButton({
  className,
  color = "default",
}: LoginButtonProps) {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  const handleLogin = async () => {
    try {
      await signInWithGoogle(nextUrl || undefined);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Mapear cores do HeroUI para ShadCN variants
  const getVariantAndColor = (color: string) => {
    switch (color) {
      case "primary":
        return "default";
      case "secondary":
        return "secondary";
      case "success":
        return "default";
      case "warning":
        return "default";
      case "danger":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Button
      onClick={handleLogin}
      variant={getVariantAndColor(color)}
      size="lg"
      className={cn("w-full", className)}
    >
      <GoogleIcon />
      Fazer Login com Google
    </Button>
  );
}
