'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject, generateText, tool } from 'ai'
import { z } from 'zod'

const model = openai('gpt-4.1')

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

const dailyTaskSchema = z.object({
  title: z.string().describe("Título da tarefa diária"),
  description: z.string().describe("Descrição da tarefa diária"),
  week_day: z.enum(["Segunda Feira", "Terça Feira", "Quarta Feira", "Quinta Feira", "Sexta Feira", "Sabado", "Domingo"]).describe("Dia da semana"),
  duration: z.string().describe("Tempo que demora para exeuctar a tarefa"),
  // frequency:  z.string().describe("Quantas vezes na semana a tarefa se repete"),
  // tips:  z.string().describe("Dicas importantes sobre a tarefa diaria em formato de tópicos"),
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


const userData = {
  name: "Leonardo",
  idade: "22 anos",
  altura: "1,88",
  peso: "73",
  objetivo_principal: "Criar uma imagem de autoridade",
  tempo_disponivel_por_dia: "2 horas",
  estilo_de_vida: "passivo",
  estilo_preferido: "",
  formato_rosto: "trinagular"
}

const imageAnalysisData = {
  formato_rosto: "triangular",
  tom_pele: "pardo",
  subtom_pele: "pardo",
  textura_cabelo: "ondulado",
  postura: "reta",
  sinais_faciais: "nenhum"
}

const messages: any = [
  {
    role: 'system',
    content: "Você é um assistente especializado em planos personalizados de autocuidado e valorização pessoal. Seu papel é gerar planos semanais com base em dados do usuário e análise de imagem.",
  },
  {
    role: 'user',
    content: `
Data atual: ${new Date().toISOString()}

Com base nas informações coletadas no onboarding:
- Nome: ${userData.name}
- Idade: ${userData.idade}
- Altura: ${userData.altura}
- Peso: ${userData.peso}
- Objetivo Principal: ${userData.objetivo_principal}
- Tempo Disponível por Dia: ${userData.tempo_disponivel_por_dia}
- Estilo de Vida: ${userData.estilo_de_vida}
- Estilo Preferido: ${userData.estilo_preferido}

E na análise da imagem do usuário:
- Formato de Rosto: ${imageAnalysisData.formato_rosto}
- Tom e Subtom de Pele: ${imageAnalysisData.tom_pele} (${imageAnalysisData.subtom_pele})
- Textura do Cabelo: ${imageAnalysisData.textura_cabelo}
- Postura: ${imageAnalysisData.postura}
- Sinais Faciais: ${imageAnalysisData.sinais_faciais}

Seu objetivo é montar um plano de 12 meses, mas gerar como saída apenas as 4 primeiras semanas.

O plano deve ser dividido em dias da semana, com entre 3 e 5 tarefas por dia, e cada tarefa deve ser classificada dentro de uma das seguintes categorias:
- Cuidados Diários
- Estilo e Aparência
- Postura e Corpo
- Saúde e Energia
- Identidade e Expressão
- Autoestima e Motivação
- Organização e Consistência
- Acompanhamento Visual

Instruções específicas:
- Priorize as categorias mais alinhadas com o objetivo principal do usuário.
- Adapte a complexidade e duração das tarefas ao tempo disponível diário informado.
- Use um tom acolhedor e motivador, sem soar clínico.
- Evite repetir exatamente a mesma tarefa mais de duas vezes por semana.
- Comece com tarefas mais leves e vá aumentando a intensidade nas semanas seguintes.
- É obrigatório gerar tarefas todos os dias da semana.
- Comece com as tarefas diárias a partir do domingo


Inclua 4 semanas completas, cada uma com 7 dias, e de 3 a 5 tarefas por dia, A resposta deve conter apenas o JSON.
    `,
  },
];

const generateMissions = async () => {
  const model = openai('gpt-4o');

  const { object } = await generateObject({
    model,
    // prompt,
    schema: weeklyMissionContainerSchema,
    messages,
    // toolCall: 'required',
  });


  return object?.missions;
}


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

export { analyzeImage, generateMissions }
