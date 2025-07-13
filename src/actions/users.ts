"use server";

import prisma from "@/lib/prisma";
import { generateMissions } from "@/models/ai";


export async function generateMyMission(id_profile: string) {
  const missions = await generateMissions();

  const user = await prisma.profile.update({
    where: { id: id_profile },
    data: {
      missions: missions 
    }
  });

  return user;
}

export async function getMissions() {
   
}