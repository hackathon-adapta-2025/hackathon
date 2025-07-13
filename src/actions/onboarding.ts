// src/actions/onboarding.ts
"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/utils/parseDate";

interface UpdateProfileData {
  email: string;
  name: string; // Adicionar nome
  birthDate: string;
  weight: number;
  height: number;
  profilePicture: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const { email, name, birthDate, weight, height, profilePicture } = data;

  try {
    const parsedBirthDate = parseDate(birthDate);

    // Primeiro, criar ou buscar o usuário
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        id: crypto.randomUUID(),
        email,
        name,
      },
      update: {
        name, // Atualizar nome se necessário
      },
    });

    // Depois, criar ou atualizar o perfil
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        birthDate: parsedBirthDate,
        weight,
        height,
        profilePicture,
      },
      update: {
        birthDate: parsedBirthDate,
        weight,
        height,
        profilePicture,
      },
    });

    return {
      success: true,
      data: {
        user,
        profile,
      },
    };
  } catch (err) {
    console.error("Erro ao salvar usuário e perfil:", err);
    return {
      success: false,
      error: "Erro ao salvar perfil",
    };
  }
}
