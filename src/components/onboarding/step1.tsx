// src/components/onboarding/step1.tsx
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Step1Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step1({ form }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Qual é o seu nome?</h2>
        <p className="text-muted-foreground">
          Como você gostaria de ser chamado(a)?
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
      </div>
    </div>
  );
}
