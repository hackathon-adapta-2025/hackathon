// src/hooks/useUserProfile.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { OnboardingFormData } from "@/lib/validations/onboarding";

const updateUserProfile = async (data: OnboardingFormData) => {
  const response = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Falha ao salvar o perfil.");
  }

  return response.json();
};

export const useUserProfile = () => {
  return useMutation({
    mutationFn: updateUserProfile,
  });
};
