import { NextResponse } from "next/server";
import { getCurrentUserWithRole } from "@/utils/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const requestingUser = await getCurrentUserWithRole();
  if (!requestingUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { birthDate, gender, weight, height, profilePicture } = body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: requestingUser.id },
      create: {
        userId: requestingUser.id,
        birthDate,
        gender,
        weight,
        height,
        profilePicture,
      },
      update: {
        birthDate,
        gender,
        weight,
        height,
        profilePicture,
      },
    });
    return NextResponse.json({ profile, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao salvar perfil" },
      { status: 500 }
    );
  }
}
