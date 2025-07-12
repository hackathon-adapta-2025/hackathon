"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { forgotPassword, ForgotPasswordState } from "@/actions/auth";
import {
  Mail,
  AlertCircle,
  ArrowLeft,
  CircleCheck,
  Fingerprint,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion, Variants } from "motion/react";
import { AuthLayout } from "@/components/auth-layout";
import { Link } from "@/components/ui/link";

const initialState: ForgotPasswordState = {
  message: null,
  error: null,
  success: false,
};

export const ForgotPasswordPageClient = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");

  const [state, formAction, isActionPending] = useActionState(
    forgotPassword,
    initialState
  );

  const handleReturn = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (state.success) {
      setEmail("");
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state.success]);

  const messageVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3, ease: [0.64, 0, 0.78, 0] },
    },
  };

  return (
    <AuthLayout
      title="Esqueceu a senha?"
      description="Digite seu email para enviarmos um link de redefinição"
    >
      <form
        action={formAction}
        ref={formRef}
        className="flex w-full flex-col gap-4"
      >
        <AnimatePresence mode="wait">
          {state.success && state.message && (
            <motion.div
              key="success-message"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2 rounded-lg border-2 border-green-200 bg-green-50 px-3 py-3 text-green-700"
              role="alert"
            >
              <CircleCheck size={24} className="flex-shrink-0" />
              <span>{state.message}</span>
            </motion.div>
          )}

          {state.error && (
            <motion.div
              key="error-message"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 px-3 py-3 text-red-700"
              role="alert"
            >
              <AlertCircle size={24} className="flex-shrink-0" />
              <span>{state.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!state.success && (
          <>
            <div className="relative">
              <Mail
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              />
              <Input
                type="email"
                name="email"
                placeholder="Seu email cadastrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isActionPending}
                className="pl-10"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isActionPending}
            >
              {isActionPending ? "Enviando..." : "Enviar Link"}
            </Button>

            <div className="flex justify-center">
              <span>
                Lembrou da senha?{" "}
                <Link href="/login" variant="secondary">
                  Voltar para Login
                </Link>
              </span>
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  );
};
