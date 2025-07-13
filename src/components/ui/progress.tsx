"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "@/utils/cn";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default" | "success" | "warning" | "error";
  animationSpeed?: "slow" | "normal" | "fast";
  showPercentage?: boolean;
  glowEffect?: boolean;
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variantClasses = {
  default: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

const backgroundVariantClasses = {
  default: "bg-muted-foreground/20",
  primary: "bg-primary/20",
  success: "bg-green-500/20",
  warning: "bg-yellow-500/20",
  error: "bg-red-500/20",
};

const springConfigs = {
  slow: { stiffness: 50, damping: 20 },
  normal: { stiffness: 100, damping: 25 },
  fast: { stiffness: 200, damping: 30 },
};

function Progress({
  className,
  value = 0,
  size = "md",
  variant = "primary",
  animationSpeed = "normal",
  showPercentage = false,
  glowEffect = false,
  ...props
}: ProgressProps) {
  const springValue = useSpring(0, springConfigs[animationSpeed]);
  const width = useTransform(springValue, [0, 100], ["0%", "100%"]);

  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "relative w-full overflow-hidden rounded-full transition-colors duration-300",
          sizeClasses[size],
          backgroundVariantClasses[variant],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            "relative h-full overflow-hidden rounded-full",
            variantClasses[variant],
            glowEffect && "shadow-lg",
            glowEffect && variant === "primary" && "shadow-primary/50",
            glowEffect && variant === "default" && "shadow-muted-foreground/50",
            glowEffect && variant === "success" && "shadow-green-500/50",
            glowEffect && variant === "warning" && "shadow-yellow-500/50",
            glowEffect && variant === "error" && "shadow-red-500/50"
          )}
          style={{ width }}
          initial={{ width: "0%" }}
          transition={{ type: "spring", ...springConfigs[animationSpeed] }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "linear",
            }}
          />
        </motion.div>
      </ProgressPrimitive.Root>

      {showPercentage && (
        <motion.div
          className="text-muted-foreground mt-1 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(value)}%
        </motion.div>
      )}
    </div>
  );
}

export { Progress };
