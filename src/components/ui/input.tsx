import { cn } from "@/utils/cn";
import * as React from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends React.ComponentProps<"input"> {
  inputSize?: InputSize;
}

const inputSizeVariants = {
  sm: "h-8 px-2 py-0.5 text-sm file:h-6",
  md: "h-10 px-3 py-1 text-base file:h-7 md:text-sm",
  lg: "h-12 px-4 py-2 text-lg file:h-8",
};

function Input({ className, type, inputSize = "md", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputSizeVariants[inputSize],
        className
      )}
      {...props}
    />
  );
}

export { Input };
