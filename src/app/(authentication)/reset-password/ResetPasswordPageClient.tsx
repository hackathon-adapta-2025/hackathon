"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { resetPassword, ResetPasswordState } from "@/actions/auth";
import {
  Mail,
  AlertCircle,
  ArrowLeft,
  CircleCheck,
  Fingerprint,
  LockKeyhole,
  EyeOff,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion, Variants } from "motion/react";
import { AuthLayout } from "@/components/auth-layout";
import { supabase } from "@/lib/supabaseClient";

const initialState: ResetPasswordState = {
  message: null,
  error: null,
  success: false,
};

export const ResetPasswordPageClient = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isActionPending] = useActionState(
    resetPassword,
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
      setPassword("");
      setConfirmPassword("");
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state.success, router]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(
          "ResetPasswordPage - Supabase Auth Event:",
          event,
          "Session:",
          session
        );
        if (event === "PASSWORD_RECOVERY") {
          console.log(
            "PASSWORD_RECOVERY event detected. User can now reset password."
          );
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <AuthLayout
      title="Redefinir Senha"
      description="Crie uma nova senha segura para sua conta"
    >
      <form
        action={formAction}
        ref={formRef}
        className="flex w-full flex-col gap-4"
      >
        <AnimatePresence mode="wait">
          {state.message && state.success && (
            <motion.div
              key="success-message"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary/20 border-secondary text-secondary-foreground flex items-center gap-2 rounded-lg border-2 px-3 py-3"
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
              className="bg-destructive/20 border-destructive text-destructive-foreground relative flex items-center gap-2 rounded-lg border-2 px-3 py-3"
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
              <LockKeyhole
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="password"
                disabled={isActionPending}
                className="pl-10"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground absolute top-3 right-3 h-4 w-4 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="relative">
              <LockKeyhole
                size={16}
                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              />
              <Input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar Nova Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="confirmPassword"
                disabled={isActionPending}
                className="pl-10"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground absolute top-3 right-3 h-4 w-4 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isActionPending || !password || !confirmPassword}
            >
              Redefinir Senha
            </Button>
          </>
        )}

        {state.success && (
          <Button
            variant="primary"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Fazer Login
          </Button>
        )}
      </form>

      {!state.success && (
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          Sua senha deve ter pelo menos 8 caracteres e incluir letras e números
          para maior segurança.
        </p>
      )}
    </AuthLayout>
  );
};
