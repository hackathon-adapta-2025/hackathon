"use server";

// lib/user.ts (versão atualizada)
import prisma from "@/lib/prisma";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Role } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  googleId?: string;
  creditBalance?: number;
}

export interface AppUser {
  id: string;
  email?: string;
  name?: string | null;
  avatarUrl?: string | null;
  role: Role;
  creditBalance?: number;
  createdAt: Date;
  profile: {
    age: number;
    weight: number | null;
    height: number | null;
    isPregnant: boolean | null;
  } | null;
}


export async function upsertUser(supabaseUser: SupabaseUser) {
  if (!supabaseUser?.email || !supabaseUser?.id) {
    throw new Error("Missing required user data");
  }

  // Obter o nome do usuário do Supabase (se disponível)
  const userName =
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.user_metadata?.name ||
    null;

  // Obter o avatar URL (se disponível)
  const avatarUrl = supabaseUser.user_metadata?.avatar_url || null;

  const user = await prisma.user.upsert({
    where: { email: supabaseUser.email },
    update: {
      name: userName || undefined,
      avatarUrl: avatarUrl || undefined,
      updatedAt: new Date(),
    },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: userName,
      avatarUrl,
      role: "USER",
      creditBalance: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: {
      profile: true,
    },
  });

  const hasCompletedOnboarding = !!user.profile;

  return { user, hasCompletedOnboarding };
}
