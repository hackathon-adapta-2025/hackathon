// src/components/onboarding/step3.tsx
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";

interface Step3Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step3({ form }: Step3Props) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">
          Qual a sua data de nascimento?
        </h2>
        <p className="text-muted-foreground">
          Isso nos ajuda a calcular suas necessidades com mais precisão.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="DD-MM-AAAA"
                      inputSize="lg"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                      )}
                      aria-label="Abrir calendário"
                    >
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                </div>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? parse(field.value, "dd-MM-yyyy", new Date())
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(format(date, "dd-MM-yyyy"));
                      }
                      setIsCalendarOpen(false);
                    }}
                    // Prevent users from selecting future dates
                    disabled={(date) =>
                      date > new Date() || date < new Date("01-01-1990")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
