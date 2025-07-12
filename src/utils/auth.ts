import { createClient } from "@/lib/supabaseServer";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { AppUser } from "@/models/User";
import { redirect } from "next/navigation";

// --- 1. Fetching Current User ---

/**
 * @description [CACHEADO] Obtém o usuário autenticado via Supabase Auth e busca seu perfil
 *              completo (incluindo role e schoolId) no banco de dados Prisma.
 *              Essencial para obter dados do usuário no servidor para lógica de UI e autorização.
 *              Utiliza o `cache` do React para otimizar chamadas repetidas na mesma requisição.
 * @returns {Promise<AppUser | null>} Uma Promise que resolve para o objeto AppUser contendo
 *                                    dados do Prisma se o usuário estiver autenticado e encontrado
 *                                    no banco, ou null caso contrário (não autenticado, erro, ou
 *                                    usuário Supabase sem correspondência no Prisma).
 * @throws Não lança erros diretamente, mas loga erros internos no console caso ocorram
 *         durante a comunicação com Supabase ou Prisma.
 */
export const getCurrentUserWithRole = cache(
  async (): Promise<AppUser | null> => {
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        // Não loga erro aqui, pois pode ser apenas um usuário não logado
        return null;
      }

      const prismaUser = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          creditBalance: true,
          createdAt: true,
          profile: {
            select: {
              age: true,
              gender: true,
              height: true,
              weight: true,
              isPregnant: true,
            },
          },
        },
      });

      if (!prismaUser) {
        // Log importante: usuário existe no Supabase Auth mas não no Prisma DB.
        console.error(
          `getCurrentUserWithRole: Prisma user not found for Supabase user ID: ${authUser.id}. Potential data inconsistency.`
        );
        // Retornar null é mais seguro para não quebrar a aplicação para o usuário.
        return null;
      }
      // Fazendo type assertion aqui, assumindo que o select corresponde a AppUser
      return prismaUser as AppUser;
    } catch (error) {
      console.error("Error fetching current user with role:", error);
      // Em caso de erro de banco ou outro, retorna null para tratamento graceful
      return null;
    }
  }
);

/**
 * @description [GUARDA] Garante que um usuário esteja autenticado (qualquer role).
 *              Se o usuário não estiver autenticado, redireciona para a página de login ('/login').
 *              Ideal para proteger páginas/layouts que requerem apenas um usuário logado.
 *              Utiliza `getCurrentUserWithRole` internamente.
 * @returns {Promise<AppUser>} Uma Promise que resolve para o objeto AppUser se o usuário
 *                             estiver autenticado. A função *nunca* retorna null em caso de
 *                             sucesso; ela redireciona se o usuário não for encontrado.
 * @throws {never} Não lança exceções JS diretamente, mas dispara uma interrupção de renderização
 *                 via `redirect('/login')` do Next.js se o usuário não estiver autenticado.
 */
export async function requireAuth(): Promise<AppUser> {
  const user = await getCurrentUserWithRole();
  if (!user) {
    console.log("requireAuth: User not authenticated. Redirecting to /login.");
    redirect("/login");
    // O redirect() lança um erro específico que o Next.js trata,
    // então o código abaixo dele não é executado.
  }
  return user; // Se chegou aqui, user não é null
}
