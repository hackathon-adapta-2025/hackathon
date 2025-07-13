'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject, generateText, tool } from 'ai'
import { z } from 'zod'

const model = openai('gpt-4o')

interface AnalyzeImageParams {
  imageUrl: string
  prompt: string
}

const analysisSchema = z.object({
  tomDePele: z
    .enum(['Muito claro', 'Claro', 'Médio', 'Moreno', 'Escuro', 'Muito escuro'])
    .describe('Definir paleta de cores, base para skincare e maquiagem.'),

  subtomDePele: z
    .enum(['Quente', 'Frio', 'Neutro'])
    .describe(
      'Paleta de cores personalizada, escolha de tons de maquiagem e roupas.'
    ),

  formatoDoRosto: z
    .enum([
      'Oval',
      'Redondo',
      'Quadrado',
      'Coração',
      'Triangular',
      'Retangular'
    ])
    .describe('Visagismo, sugestão de cortes de cabelo, óculos e acessórios.'),

  texturaDoCabelo: z
    .enum(['Liso', 'Ondulado', 'Cacheado', 'Crespo'])
    .describe('Rotinas de cuidado capilar, indicação de produtos.'),

  corDoCabelo: z
    .enum(['Preto', 'Castanho', 'Loiro', 'Ruivo', 'Grisalho', 'Colorido'])
    .describe('Harmonização com paleta e produtos.'),

  sinaisFaciais: z
    .array(z.enum(['Acne', 'Manchas', 'Olheiras', 'Linhas finas', 'Rugas']))
    .optional()
    .describe('Sugestões leves de skincare, rotina personalizada.'),

  idadeAparente: z
    .enum(['18–24', '25–34', '35–44', '45–54', '55+'])
    .describe('Ajustar linguagem e abordagem das recomendações.'),

  expressaoFacial: z
    .enum(['Neutra', 'Feliz', 'Cansada', 'Estressada', 'Triste'])
    .optional()
    .describe(
      'Conteúdo motivacional, frases diárias, rotinas de autocuidado emocional.'
    ),

  usoDeMaquiagem: z
    .enum(['Sim', 'Não'])
    .describe('Calibrar sugestões de estilo e conteúdo.'),

  acessoriosVisiveis: z
    .array(z.enum(['Óculos', 'Brincos', 'Colares', 'Nenhum']))
    .optional()
    .describe('Estilo atual, afinidade com itens que podem ser sugeridos.'),

  simetriaFacial: z
    .enum(['Alta', 'Média', 'Baixa'])
    .optional()
    .describe(
      'Sugestão de ângulos de foto, valorização estética (sem julgamento).'
    ),

  iluminacaoDaFoto: z
    .enum(['Boa', 'Ruim', 'Sombra intensa', 'Luz artificial', 'Luz natural'])
    .describe('Sugestão para nova foto, ou calibração de análise.'),

  planoDeFundo: z
    .enum(['Neutro', 'Ambiente interno', 'Ambiente externo'])
    .describe('Contextualização da imagem (ex: roupa vs ocasião).'),

  qualidadeDaImagem: z
    .enum(['Alta', 'Média', 'Baixa'])
    .describe('Orientar nova captura de imagem.'),

  estadoDaPele: z
    .enum(['Oleosa', 'Seca', 'Mista', 'Normal'])
    .describe('Rotina de skincare, escolha de produtos.'),

  pelosFaciais: z
    .enum(['Nenhuma', 'Rala', 'Média', 'Cheia'])
    .describe('Sugestões de estilo ou cuidados de barba.'),

  densidadeCapilar: z
    .enum(['Alta', 'Média', 'Baixa', 'Recuo frontal', 'Entradas visíveis'])
    .describe('Planejamento de corte, estilo e cuidados capilares.'),

  proporcoesFaciais: z
    .enum(['Harmoniosas', 'Levemente desbalanceadas', 'Desbalanceadas'])
    .optional()
    .describe('Sugestões de ângulos, cortes, e acessórios.'),

  posturaFacial: z
    .enum(['Correta', 'Levemente curvada', 'Curvada'])
    .optional()
    .describe('Inclusão de rotinas de alongamento e correção postural.'),

  estadoDosLábios: z
    .enum(['Ressecado', 'Normal', 'Hidratado'])
    .optional()
    .describe('Sugestões de hidratação, hábitos e autocuidado leve.'),

  dentesVisiveis: z
    .enum(['Alinhados', 'Amarelados', 'Ausentes'])
    .optional()
    .describe('Sugestões de autocuidado oral.'),

  paletaDeCores: z.object({
    corNeutra: z.string().describe('Cor neutra usada como base ou fundo.'),
    corPrimaria: z.string().describe('Cor principal da identidade visual.'),
    corSecundaria_1: z.string().describe('Primeira cor secundária.'),
    corSecundaria_2: z.string().describe('Segunda cor secundária.'),
    corDeAcento: z
      .string()
      .describe('Cor de destaque para elementos específicos.')
  })
})

const analyzeImage = async ({ imageUrl, prompt }: AnalyzeImageParams) => {
  const result = await generateObject({
    model,
    schema: analysisSchema,
    messages: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: imageUrl
          }
        ]
      }
    ]
  })

  return result.object
}

// const weeklyMission = z.object({
//   missionTitle: z
//     .string()
//     .describe('Título da missão semanal'),
//   missionDescription: z
//     .string()
//     .describe('Descrição da missão semanal'),
//   dailyTasks: z.object({
//     monday: z.object({
//       title: z.string().describe("Título da tarefa de segunda-feira"),
//       description: z.string().describe("Descrição da tarefa de segunda-feira")
//     }),
//     tuesday: z.object({
//       title: z.string().describe("Título da tarefa de terça-feira"),
//       description: z.string().describe("Descrição da tarefa de terça-feira")
//     }),
//     wednesday: z.object({
//       title: z.string().describe("Título da tarefa de quarta-feira"),
//       description: z.string().describe("Descrição da tarefa de quarta-feira")
//     }),
//     thursday: z.object({
//       title: z.string().describe("Título da tarefa de quinta-feira"),
//       description: z.string().describe("Descrição da tarefa de quinta-feira")
//     }),
//     friday: z.object({
//       title: z.string().describe("Título da tarefa de sexta-feira"),
//       description: z.string().describe("Descrição da tarefa de sexta-feira")
//     }),
//     saturday: z.object({
//       title: z.string().describe("Título da tarefa de sábado"),
//       description: z.string().describe("Descrição da tarefa de sábado")
//     }),
//     sunday: z.object({
//       title: z.string().describe("Título da tarefa de domingo"),
//       description: z.string().describe("Descrição da tarefa de domingo")
//     }),
//   }).describe('Tarefas diárias para a semana')
// });

const dailyTaskSchema = z.object({
  title: z.string().describe("Título da tarefa diária"),
  description: z.string().describe("Descrição da tarefa diária"),
  // Você pode adicionar mais campos aqui se precisar, por exemplo, 'dayOfWeek: z.string()'
});

const weeklyMissionSchema = z.object({
  missionTitle: z
    .string()
    .describe('Título da missão semanal'),
  missionDescription: z
    .string()
    .describe('Descrição da missão semanal'),
  // Agora dailyTasks é um array de objetos dailyTaskSchema
  dailyTasks: z.array(dailyTaskSchema)
    .describe('Lista de tarefas diárias para a semana. Cada tarefa deve ter um título e uma descrição.'),
});

const weeklyMissionsArray = z.array(weeklyMissionSchema)
  .describe('Uma lista de missões semanais, cada uma com seu título, descrição e tarefas diárias.');

const weeklyMissionContainerSchema = z.object({
  // This property name (e.g., 'missions') will be the key under which your array appears
  missions: weeklyMissionsArray.describe('Uma lista de missões semanais geradas pelo modelo.'),
}).describe('Container para uma lista de missões semanais.');


const executeTextPrompt = async (prompt: string) => {
  const model = openai('gpt-4o');

  console.log("chegou aqui")
  const { object } = await generateObject({
    model,
    prompt,
    schema: weeklyMissionContainerSchema,
    toolCall: 'required',
  });


  return object?.missions;
}

export { analyzeImage, executeTextPrompt }
const planSchema = z.object({
  // TODO: define the schema for the plan
})

const generatePlan = async ({ prompt }: AnalyzeImageParams) => {
  const result = await generateObject({
    model,
    schema: planSchema,
    messages: [
      {
        role: 'system',
        content: prompt
      }
    ]
  })

  return result.object
}

export { analyzeImage, generatePlan }
