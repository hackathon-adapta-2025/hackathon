// src/hooks/useUserProfile.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { OnboardingFormData } from "@/lib/validations/onboarding";
import { updateProfile } from "@/actions/onboarding";

const updateUserProfile = async (data: OnboardingFormData) => {
  const result = await updateProfile({
    birthDate: data.birthDate,
    weight: data.weight,
    height: data.height,
    profilePicture: data.profilePicture,
    email: data.email,
  });

  if (!result.success) {
    throw new Error(result.error || "Falha ao salvar o perfil.");
  }

  return result.data;
};

export const useUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
  });
};
