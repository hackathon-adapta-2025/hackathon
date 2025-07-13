"use server";

import prisma from "@/lib/prisma";
import { executeTextPrompt } from "@/models/ai";


export async function generateMyMission(id_user: string) {
  const prompt = "Gere uma planejamento de 5 semanas com tarefas diarias para um homem de 21 anos para saúde e estética visando 5 topicos com cada topico um passo a passo";

//   const missions = await executeTextPrompt(prompt);

  const result = await prisma.profile.findMany();
  console.log(result, "result");

//   const user = await prisma.profile.update({
//     where: { userId: id_user },
//     data: {
//       missions: missions 
//     }
//   });

//   return user;
}