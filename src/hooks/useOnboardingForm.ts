// src/hooks/useOnboardingForm.ts
"use client";

import { useState } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OnboardingFormData,
  onboardingSchema,
  stepSchemas,
} from "@/lib/validations/onboarding";
import { useRouter } from "next/navigation";
import { useUserProfile } from "./useUserProfile";
import { generateImagePreview } from "@/actions/generateImagePreview";

export function useOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const { mutate, isPending } = useUserProfile();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const nextStep = async () => {
    const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
    const fieldsToValidate = Object.keys(
      currentSchema.shape
    ) as FieldPath<OnboardingFormData>[];

    const isValid = await form.trigger(fieldsToValidate, {
      shouldFocus: true,
    });

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const currentSchema =
        stepSchemas[currentStep as keyof typeof stepSchemas];
      const fieldsToClear = Object.keys(
        currentSchema.shape
      ) as FieldPath<OnboardingFormData>[];
      fieldsToClear.forEach((field) => form.clearErrors(field));

      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    mutate(data, {
      onSuccess: async (profile) => {
        const { url } = await generateImagePreview(data.email);
        console.log(url);
        window.location.href = url || "";

        router.push(`/profile/${profile?.id}`);
      },
      onError: (error: any) => {
        console.error("Erro no onboarding:", error);
      },
    });
  };

  const handleFinish = async () => {
    const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
    const fieldsToValidate = Object.keys(
      currentSchema.shape
    ) as FieldPath<OnboardingFormData>[];

    const isValid = await form.trigger(fieldsToValidate, {
      shouldFocus: true,
    });

    if (isValid) {
      const formData = form.getValues();
      onSubmit(formData);
    }
  };

  return {
    form,
    currentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    onSubmit,
    totalSteps,
    isPending,
    handleFinish,
  };
}
