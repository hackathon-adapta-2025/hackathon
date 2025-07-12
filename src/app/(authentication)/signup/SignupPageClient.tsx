"use client";
import { useState } from "react";
import { Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "./SignupForm";
import { AuthLayout } from "@/components/auth-layout";

export const SignupPageClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <main className="bg-background relative min-h-svh overflow-hidden">
        <div className="flex min-h-svh items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-card border-border w-full max-w-md rounded-3xl border-2 p-6 text-center shadow-[0px_0px_4px_0px] shadow-slate-900/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="bg-secondary/10 mx-auto mb-6 w-fit rounded-full p-4"
            >
              <Fingerprint className="text-secondary h-8 w-8" />
            </motion.div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Verifique seu email
            </h2>
            <p className="text-muted-foreground mb-6">
              Enviamos um link de confirmação para seu email. Por favor,
              verifique sua caixa de entrada e spam para ativar sua conta.
            </p>
            <Button
              className="w-full"
              variant="primary"
              onClick={() => router.push("/login")}
            >
              Voltar para Login
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <AuthLayout
      title="Criar sua conta"
      description="Registre-se para acessar o EsteticAI"
      footerText="Ao se registrar, você concorda com nossos"
    >
      <SignupForm
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onSuccess={() => setIsSuccess(true)}
      />
    </AuthLayout>
  );
};
