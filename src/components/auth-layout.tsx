"use client";
import { ArrowLeft, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/components/ui/link";
import type { ReactNode } from "react";
import { LoginButton } from "./ui/login-button";

interface AuthLayoutProps {
  title: string;
  description: string;
  footerText?: string;
  children: ReactNode;
  leftPanelContent?: ReactNode;
}

export function AuthLayout({
  title,
  description,
  footerText,
  children,
  leftPanelContent = <span>Hello</span>,
}: AuthLayoutProps) {
  const router = useRouter();

  const handleReturn = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="bg-background relative min-h-svh overflow-hidden">
      {/* Desktop version */}
      <div className="hidden lg:grid lg:min-h-svh lg:grid-cols-3">
        <div className="col-span-2 flex items-center justify-center">
          {leftPanelContent}
        </div>
        <div className="border-border bg-card relative flex flex-col justify-center rounded-l-[2rem] border-l-2 px-4 py-12 shadow-[0px_0px_4px_0px] shadow-slate-900/20">
          <div className="mx-auto w-full max-w-md">
            <Button
              onClick={handleReturn}
              variant="primary"
              className="absolute top-5 left-5"
            >
              <ArrowLeft size={24} /> Voltar
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="bg-secondary/10 rounded-full p-4"
                >
                  <Fingerprint className="text-secondary h-8 w-8" />
                </motion.div>
                <div className="text-center">
                  <h2 className="text-foreground mb-2 text-3xl font-bold">
                    {title}
                  </h2>
                  <p className="text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <LoginButton color="default" />
                <div className="flex items-center gap-3">
                  <Separator className="bg-border flex-1" />
                  <span className="text-muted-foreground px-2 text-xs font-medium">
                    OU
                  </span>
                  <Separator className="bg-border flex-1" />
                </div>
                {children}
              </div>
              {footerText && (
                <p className="text-tiny text-muted-foreground text-center leading-relaxed">
                  {footerText}{" "}
                  <Link href="/terms" variant="secondary">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" variant="secondary">
                    Política de Privacidade
                  </Link>
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="relative flex min-h-svh flex-col lg:hidden">
        <div className="relative flex-1 overflow-hidden">
          <Button
            onClick={handleReturn}
            className="absolute top-4 left-4 z-10 h-9 w-9 min-w-9"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="bg-primary/5 absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              delay: 0.2,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                delay: 0.4,
              }}
              className="bg-secondary/10 z-10 mb-4 inline-flex rounded-lg p-4 backdrop-blur-sm"
            >
              <Fingerprint size={32} className="text-secondary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-foreground mb-1 text-3xl font-bold tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text text-muted-foreground font-medium"
            >
              {description}
            </motion.p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.3,
          }}
          className="border-border bg-content2 scrollbar-hide lg:scrollbar-default max-h-[70svh] overflow-y-scroll rounded-t-3xl border-t-2 px-3 py-6 shadow-[0px_0px_4px_0px] shadow-slate-900/20"
        >
          <div className="mb-5 flex justify-center">
            <div className="bg-muted h-1.5 w-12 rounded-full" />
          </div>
          <div className="flex flex-col gap-4">
            <LoginButton color="default" />
            <div className="flex items-center gap-3">
              <Separator className="bg-border flex-1" />
              <span className="text-muted-foreground px-3 text-xs font-medium">
                OU
              </span>
              <Separator className="bg-border flex-1" />
            </div>
            {children}
            {footerText && (
              <p className="text-muted-foreground px-4 text-center text-xs leading-relaxed">
                {footerText}{" "}
                <Link href="/terms" variant="secondary">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacy" variant="secondary">
                  Política de Privacidade
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
