"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmailLoginForm } from "./EmailLoginForm";
import { AuthLayout } from "@/components/auth-layout";

export const LoginPageClient = () => {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLayout
      title="Bem-vindo(a) de volta!"
      description="Acesse sua conta para continuar"
      footerText="Ao continuar, você concorda com nossos"
    >
      <EmailLoginForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        nextUrl={nextUrl}
      />
    </AuthLayout>
  );
};
