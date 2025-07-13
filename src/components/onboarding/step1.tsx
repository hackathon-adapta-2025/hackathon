import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { format, parse } from "date-fns";
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
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/utils/cn";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface Step1Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step1({ form }: Step1Props) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Vamos nos conhecer!</h2>
        <p className="text-muted-foreground">
          Conte-nos um pouco sobre você para personalizarmos sua experiência.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome"
                  inputSize="lg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  inputSize="lg"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
