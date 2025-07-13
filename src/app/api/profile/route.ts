import { generateMyMission } from '@/actions/users';
import { getMyProfile } from '@/models/Profile';
import { NextResponse } from 'next/server';

// --- Definindo um tipo para o Usuário ---
interface User {
    id: number;
    name: string;
    email: string;
}

// --- Dados de exemplo tipados (simulando um banco de dados) ---
let users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];

/**
 * GET /api/users
 * Retorna todos os usuários (opcionalmente filtrados por nome).
 */
export async function GET(request: Request): Promise<NextResponse<User[]>> {
    const { searchParams } = new URL(request.url);

    // const my_missions2 = await generateMyMission("e31d407c-7386-42e3-89fd-fc39d314340f");
    const my_missions = await getMyProfile("e31d407c-7386-42e3-89fd-fc39d314340f");
    //   const nameFilter = searchParams.get('name');

    //   let filteredUsers = users;
    //   if (nameFilter) {
    // filteredUsers = users.filter(user =>
    //   user.name.toLowerCase().includes(nameFilter.toLowerCase())
    // );
// }

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