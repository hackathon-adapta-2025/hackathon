import { z } from "zod";

// Define individual schemas for each step
export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),

  email: z
    .string()
    .email("Por favor, insira um email válido")
    .min(1, "O email é obrigatório"),

  birthDate: z.string().refine(
    (date) => {
      return /^\d{2}-\d{2}-\d{4}$/.test(date);
    },
    {
      message: "Data de nascimento inválida. Use o formato DD-MM-YYYY",
    }
  ),
});

export const profilePictureSchema = z.object({
  profilePicture: z.string().url(),
});

export const locationSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const weightHeightSchema = z.object({
  weight: z
    .number()
    .min(30, "O peso mínimo é de 20kg")
    .max(300, "O peso máximo é de 300kg"),

  height: z
    .number()
    .min(100, "A altura mínima é de 100cm")
    .max(300, "A altura máxima é de 300cm"),
});

// Combine all individual schemas into the main onboardingSchema
export const onboardingSchema = z
  .object({})
  .merge(personalInfoSchema)
  .merge(profilePictureSchema)
  .merge(weightHeightSchema)
  .merge(locationSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Export an object with each step schema
export const stepSchemas = {
  1: personalInfoSchema,
  2: profilePictureSchema,
  3: weightHeightSchema,
  4: locationSchema,
} as const;
