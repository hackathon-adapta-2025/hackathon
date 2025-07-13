"use server";

import prisma from "@/lib/prisma";

interface UpdateProfileData {
  email: string;
  birthDate: string;
  weight: number;
  height: number;
  profilePicture: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const { email, birthDate, weight, height, profilePicture } = data;

  try {
    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found with the provided email.",
      };
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        birthDate,
        weight,
        height,
        profilePicture,
      },
      update: {
        birthDate,
        weight,
        height,
        profilePicture,
      },
    });

    return {
      success: true,
      data: profile,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: "Erro ao salvar perfil",
    };
  }
}
