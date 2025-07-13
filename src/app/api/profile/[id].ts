import { getMyProfile } from '@/models/Profile';
import { Profile } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';


/**
 * GET /api/users
 * Retorna todos os usuários (opcionalmente filtrados por nome).
 */
export async function GET(req: NextApiRequest, request: Request): Promise<NextResponse<Profile | undefined | null>> {
      const { id } = req.query;

    const { searchParams } = new URL(request.url);

    // const my_missions2 = await generateMyMission("e31d407c-7386-42e3-89fd-fc39d314340f");
    const my_missions = await getMyProfile(id?.toString() ?? "");
    
    // O tipo de retorno para NextResponse.json é inferido, mas podemos ser explícitos
    return NextResponse.json(my_missions, { status: 200 });
}

/**
 * POST /api/users
 * Cria um novo usuário.
 */
// --- Definindo um tipo para o payload de entrada (o que o cliente envia) ---
// interface CreateUserPayload {
//     name: string;
//     email: string;
// }

// export async function POST(request: Request): Promise<NextResponse<User | { message: string }>> {
//     try {
//         // Usamos 'as CreateUserPayload' para afirmar que o JSON terá essa forma
//         const newUserPayload: CreateUserPayload = await request.json();

//         // Validação básica (opcional, mas recomendado)
//         if (!newUserPayload.name || !newUserPayload.email) {
//             return NextResponse.json({ message: 'Nome e email são obrigatórios.' }, { status: 400 });
//         }

//         const newUser: User = {
//             id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
//             name: newUserPayload.name,
//             email: newUserPayload.email,
//         };
//         users.push(newUser);

//         return NextResponse.json(newUser, { status: 201 }); // 201 Created
//     } catch (error) {
//         console.error('Erro ao processar POST /api/users:', error);
//         return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
//     }
// }