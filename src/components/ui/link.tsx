import { cn } from "@/utils/cn";
import { default as NextLink } from "next/link";
import type { ReactNode } from "react";

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted" | "primary" | "secondary" | "accent";
}

export function Link({
  href,
  children,
  className,
  variant = "default",
  ...props
}: LinkProps) {
  const variants = {
    default: "text-foreground hover:text-primary",
    muted: "text-muted-foreground hover:text-foreground",
    primary: "text-primary hover:text-primary/80",
    secondary: "text-secondary hover:text-secondary/80",
    accent: "text-accent hover:text-accent/80",
  };

  return (
    <NextLink
      href={href}
      className={cn(
        "font-medium no-underline transition-colors duration-300 ease-in-out",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
