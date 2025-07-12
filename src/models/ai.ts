'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const model = openai('gpt-4o')

interface AnalyzeImageParams {
  imageUrl: string
  prompt: string
}

const analysisSchema = z.object({
  tomDePele: z
    .enum(['Muito claro', 'Claro', 'Médio', 'Moreno', 'Escuro', 'Muito escuro'])
    .describe(
      'Cor geral da pele da pessoa, usada para definir paletas, skincare e maquiagem.'
    ),

  subtomDePele: z
    .enum(['Quente', 'Frio', 'Neutro'])
    .describe(
      'Tonalidade subjacente da pele que influencia paletas e maquiagem (quente, frio ou neutro).'
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
    .describe(
      'Formato predominante do rosto, usado para sugerir cortes de cabelo, acessórios e óculos.'
    ),

  texturaDoCabelo: z
    .enum(['Liso', 'Ondulado', 'Cacheado', 'Crespo'])
    .describe(
      'Textura visível do cabelo, útil para sugerir cuidados e produtos capilares.'
    ),

  corDoCabelo: z
    .enum(['Preto', 'Castanho', 'Loiro', 'Ruivo', 'Grisalho', 'Colorido'])
    .describe(
      'Cor predominante do cabelo, usada para harmonização com paletas e recomendações.'
    ),

  sinaisFaciais: z
    .array(z.enum(['Acne', 'Manchas', 'Olheiras', 'Linhas finas', 'Rugas']))
    .optional()
    .describe(
      'Presença de sinais faciais que podem orientar recomendações de skincare.'
    ),

  idadeAparente: z
    .enum(['18–24', '25–34', '35–44', '45–54', '55+'])
    .describe(
      'Faixa etária estimada da pessoa, usada para calibrar linguagem e sugestões.'
    ),

  expressaoFacial: z
    .enum(['Neutra', 'Feliz', 'Cansada', 'Estressada', 'Triste'])
    .optional()
    .describe(
      'Expressão emocional aparente no rosto, usada com sensibilidade para conteúdo motivacional.'
    ),

  usoDeMaquiagem: z
    .enum(['Sim', 'Não'])
    .describe(
      'Indica se a pessoa está usando maquiagem no momento da análise.'
    ),

  acessoriosVisiveis: z
    .array(z.enum(['Óculos', 'Brincos', 'Colares', 'Maquiagem', 'Nenhum']))
    .optional()
    .describe(
      'Acessórios detectáveis na imagem, que ajudam a identificar estilo ou preferências.'
    ),

  simetriaFacial: z
    .enum(['Alta', 'Média', 'Baixa'])
    .optional()
    .describe(
      'Nível de simetria facial percebida, usada para recomendações sutis de ângulos de fotos.'
    ),

  iluminacaoDaFoto: z
    .enum(['Boa', 'Ruim', 'Sombra intensa', 'Luz artificial', 'Luz natural'])
    .describe(
      'Condições de iluminação da imagem, usada para avaliar qualidade e orientar nova captura.'
    ),

  planoDeFundo: z
    .enum(['Neutro', 'Ambiente interno', 'Ambiente externo'])
    .describe(
      'Tipo de fundo na imagem, usado para entender o contexto (ex: estilo vs ocasião).'
    ),

  qualidadeDaImagem: z
    .enum(['Alta', 'Média', 'Baixa'])
    .describe(
      'Qualidade geral da imagem fornecida, influencia a precisão da análise.'
    ),
  corNeutra: z
    .string()
    .describe(
      'Cor neutra usada como base ou fundo, geralmente cinza ou branca'
    ),

  corPrimaria: z
    .string()
    .describe(
      'Cor principal da identidade visual, usada em elementos predominantes'
    ),

  corSecundaria_1: z
    .string()
    .describe('Primeira cor secundária usada para complementar a cor primária'),

  corSecundaria_2: z
    .string()
    .describe('Segunda cor secundária usada para variação ou contraste leve'),

  corDeAcento: z
    .string()
    .describe(
      'Cor de destaque usada para chamar atenção em elementos específicos (ex: botões ou links)'
    )
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

export { analyzeImage }
