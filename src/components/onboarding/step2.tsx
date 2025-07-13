// src/components/onboarding/step2.tsx
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormData } from "@/lib/validations/onboarding";
import { Gender } from "@prisma/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Step2Props {
  form: UseFormReturn<OnboardingFormData>;
}

export function Step2({ form }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold">Qual é o seu gênero?</h2>
        <p className="text-muted-foreground">
          Isso nos ajuda a personalizar sua experiência.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={Gender.MALE} id="male" />
                    <label htmlFor="male">Masculino</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={Gender.FEMALE} id="female" />
                    <label htmlFor="female">Feminino</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={Gender.UNKNOWN} id="unknown" />
                    <label htmlFor="unknown">Prefiro não informar</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
