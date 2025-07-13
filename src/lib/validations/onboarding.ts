// src/lib/validations/onboarding.ts
import { z } from "zod";

// Define individual schemas for each step
export const nameSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

export const genderSchema = z.object({
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"], {
    required_error: "Selecione seu gênero",
  }),
});

export const birthDateSchema = z.object({
  birthDate: z.string().refine(
    (date) => {
      // Basic date format validation (DD-MM-YYYY)
      return /^\d{2}-\d{2}-\d{4}$/.test(date);
    },
    {
      message: "Data de nascimento inválida. Use o formato DD-MM-YYYY",
    }
  ),
});

export const locationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  profilePicture: z.string().url(),
});

export const weightHeightSchema = z.object({
  weight: z
    .number()
    .min(30, "O peso mínimo é de 20kg")
    .max(300, "O peso máximo é de 300kg")
    .optional(),

  height: z
    .number()
    .min(100, "A altura mínima é de 100cm")
    .max(300, "A altura máxima é de 300cm")
    .optional(),
});

// Combine all individual schemas into the main onboardingSchema
export const onboardingSchema = z
  .object({})
  .merge(nameSchema)
  .merge(birthDateSchema)
  .merge(genderSchema)
  .merge(weightHeightSchema)
  .merge(locationSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Export an object with each step schema
export const stepSchemas = {
  1: nameSchema,
  2: genderSchema,
  3: birthDateSchema,
  4: weightHeightSchema,
  5: locationSchema,
} as const;
