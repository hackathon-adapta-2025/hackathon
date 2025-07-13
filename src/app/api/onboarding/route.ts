import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import OpenAI, { toFile } from "openai";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { withCors } from "@/lib/cors";

const prisma = new PrismaClient();
const model = openai("gpt-4o");
const openaiClient = new OpenAI();

const analysisSchema = z.object({
  tomDePele: z
    .enum([
      "VERY_FAIR",
      "FAIR",
      "LIGHT",
      "LIGHT_MEDIUM",
      "MEDIUM",
      "MEDIUM_TAN",
      "TAN",
      "DEEP_TAN",
      "DEEP",
      "VERY_DEEP",
      "EBONY",
    ])
    .describe(
      "Cor geral da pele da pessoa, usada para definir paletas, skincare e maquiagem."
    ),

  subtomDePele: z
    .enum(["Quente", "Frio", "Neutro"])
    .describe(
      "Tonalidade subjacente da pele que influencia paletas e maquiagem (quente, frio ou neutro)."
    ),

  formatoDoRosto: z
    .enum([
      "OVAL",
      "SQUARE",
      "RECTANGULAR",
      "TRIANGLE",
      "INVERTED_TRIANGLE",
      "DIAMOND",
      "CIRCULAR",
      "TRIANGULAR",
    ])
    .describe(
      "Formato predominante do rosto, usado para sugerir cortes de cabelo, acessórios e óculos."
    ),

  texturaDoCabelo: z
    .enum([
      "STRAIGHT_1A",
      "STRAIGHT_1B",
      "STRAIGHT_1C",
      "WAVY_2A",
      "WAVY_2B",
      "WAVY_2C",
      "CURLY_3A",
      "CURLY_3B",
      "CURLY_3C",
      "COILY_4A",
      "COILY_4B",
      "COILY_4C",
    ])
    .describe(
      "Textura visível do cabelo, útil para sugerir cuidados e produtos capilares."
    ),

  corDoCabelo: z
    .enum([
      "BLACK",
      "DARK_BROWN",
      "MEDIUM_BROWN",
      "LIGHT_BROWN",
      "BLONDE",
      "DARK_BLONDE",
      "PLATINUM_BLONDE",
      "ASH_BLONDE",
      "GOLDEN_BLONDE",
      "RED",
      "AUBURN",
      "GINGER",
      "COPPER",
      "BURGUNDY",
      "MAHOGANY",
      "GREY",
      "WHITE",
      "BLUE",
      "GREEN",
      "PURPLE",
      "PINK",
      "SILVER",
      "MULTICOLOR",
      "OTHER",
    ])
    .describe(
      "Cor predominante do cabelo, usada para harmonização com paletas e recomendações."
    ),

  sinaisFaciais: z
    .array(z.enum(["ACNE", "MANCHAS", "OLHEIRAS", "LINHAS_FINAS", "RUGAS"]))
    .optional()
    .describe(
      "Presença de sinais faciais que podem orientar recomendações de skincare."
    ),

  // Observação: Não há um enum para idade aparente no seu schema.prisma.
  // O campo `apparentAge` é um Int. Mantendo a definição original.
  idadeAparente: z
    .enum(["18–24", "25–34", "35–44", "45–54", "55+"])
    .describe(
      "Faixa etária estimada da pessoa, usada para calibrar linguagem e sugestões."
    ),

  expressaoFacial: z
    .enum([
      "NEUTRAL",
      "HAPPY",
      "SAD",
      "ANGRY",
      "SURPRISED",
      "DISGUSTED",
      "FEARFUL",
      "CONFUSED",
      "SMIRK",
      "TIRED",
      "FOCUSED",
      "RELAXED",
      "ANXIOUS",
      "OTHER",
    ])
    .optional()
    .describe(
      "Expressão emocional aparente no rosto, usada com sensibilidade para conteúdo motivacional."
    ),

  // Observação: `useOfMakeup` é um Boolean no Prisma. Mantendo o enum de strings.
  usoDeMaquiagem: z
    .enum(["Sim", "Não"])
    .describe(
      "Indica se a pessoa está usando maquiagem no momento da análise."
    ),

  // Observação: `VisibleAccessories` é um String[] no Prisma, não um enum.
  // Mantendo a definição original.
  acessoriosVisiveis: z
    .array(z.enum(["Óculos", "Brincos", "Colares", "Maquiagem", "Nenhum"]))
    .optional()
    .describe(
      "Acessórios detectáveis na imagem, que ajudam a identificar estilo ou preferências."
    ),

  simetriaFacial: z
    .enum(["HIGH", "MEDIUM", "LOW"])
    .optional()
    .describe(
      "Nível de simetria facial percebida, usada para recomendações sutis de ângulos de fotos."
    ),

  iluminacaoDaFoto: z
    .enum(["GOOD", "POOR", "HARSH_SHADOW", "ARTIFICIAL_LIGHT", "NATURAL_LIGHT"])
    .describe(
      "Condições de iluminação da imagem, usada para avaliar qualidade e orientar nova captura."
    ),

  planoDeFundo: z
    .enum(["NEUTRAL", "INDOOR", "OUTDOOR"])
    .describe(
      "Tipo de fundo na imagem, usado para entender o contexto (ex: estilo vs ocasião)."
    ),

  qualidadeDaImagem: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .describe(
      "Qualidade geral da imagem fornecida, influencia a precisão da análise."
    ),

  corNeutra: z
    .string()
    .describe(
      "Cor neutra usada como base ou fundo, geralmente cinza ou branca"
    ),

  corPrimaria: z
    .string()
    .describe(
      "Cor principal da identidade visual, usada em elementos predominantes"
    ),

  corSecundaria_1: z
    .string()
    .describe("Primeira cor secundária usada para complementar a cor primária"),

  corSecundaria_2: z
    .string()
    .describe("Segunda cor secundária usada para variação ou contraste leve"),

  corDeAcento: z
    .string()
    .describe(
      "Cor de destaque usada para chamar atenção em elementos específicos (ex: botões ou links)"
    ),
});

const DEFAULT_ANALYSIS_PROMPT = `
Analise esta imagem de uma pessoa e forneça informações detalhadas sobre suas características físicas e visuais. 
Seja preciso e objetivo nas suas observações, focando em aspectos que podem ser úteis para recomendações de estilo, 
maquiagem e cuidados pessoais.

Para as cores da paleta, sugira cores em formato hexadecimal (#RRGGBB) que complementem as características da pessoa.
Considere o tom de pele, cor do cabelo e características gerais para criar uma paleta harmoniosa.
`;

const generateImagePrompt = (
  analysis: any,
  preferences: string[],
  goal: string,
  lifestyle: string
) => {
  const basePrompt =
    "Imagine que essa pessoa fez um visagismo para, de maneira natural, melhorar sua aparência, mostre como fica.";

  let enhancedPrompt = basePrompt;

  enhancedPrompt +=
    " Mantenha a naturalidade e realce os melhores aspectos da pessoa.";

  return enhancedPrompt;
};

const mapAnalysisToProfile = (analysis: any) => {
  return {
    faceShape: analysis.formatoDoRosto,
    skinTone: analysis.tomDePele,
    HairTexture: analysis.texturaDoCabelo,
    HairColor: analysis.corDoCabelo,
    SignalPresence: analysis.sinaisFaciais?.join(", ") || null,
    FacialExpression: analysis.expressaoFacial || null,
    FacialSymmetry: analysis.simetriaFacial || null,
    PhotoLighting: analysis.iluminacaoDaFoto,
    useOfMakeup: analysis.usoDeMaquiagem === "Sim",
    VisibleAccessories: analysis.acessoriosVisiveis || [],
    BackgroundType: analysis.planoDeFundo,
    ImageQuality: analysis.qualidadeDaImagem,
    apparentAge: getAgeFromRange(analysis.idadeAparente),
    colorPalatte: {
      neutral: analysis.corNeutra,
      primary: analysis.corPrimaria,
      secondary1: analysis.corSecundaria_1,
      secondary2: analysis.corSecundaria_2,
      accent: analysis.corDeAcento,
      skinUndertone: analysis.subtomDePele,
    },
  };
};

const getAgeFromRange = (ageRange: string): number => {
  const ageMap: { [key: string]: number } = {
    "18–24": 21,
    "25–34": 29,
    "35–44": 39,
    "45–54": 49,
    "55+": 60,
  };
  return ageMap[ageRange] || 25;
};

const generateImagePreview = async (
  profilePictureUrl: string,
  analysis: any,
  preferences: string[],
  goal: string,
  lifestyle: string
) => {
  try {
    console.log("Iniciando geração da imagem preview...");

    // Gerar prompt personalizado
    const prompt = generateImagePrompt(analysis, preferences, goal, lifestyle);
    console.log("Prompt gerado:", prompt);

    // Baixar a imagem original
    const responseImage = await fetch(profilePictureUrl);
    if (!responseImage.ok) {
      throw new Error("Falha ao baixar a imagem original");
    }

    const arrayBuffer = await responseImage.arrayBuffer();
    const file = await toFile(Buffer.from(arrayBuffer), "image.png", {
      type: "image/png",
    });

    // Gerar nova imagem com OpenAI
    const response = await openaiClient.images.edit({
      model: "gpt-image-1",
      image: file,
      prompt,
      size: "1024x1024",
    });

    const image_base64 = response?.data?.[0].b64_json;
    if (!image_base64) {
      throw new Error("Nenhuma imagem foi gerada");
    }

    const image_bytes = Buffer.from(image_base64, "base64");

    // Gerar nome único e path
    const uniqueFileName = `${crypto.randomUUID()}.png`;
    const filePath = `generated-images/${uniqueFileName}`;

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, image_bytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro no upload para Supabase:", uploadError);
      throw new Error("Falha ao fazer upload da imagem gerada");
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Falha ao obter URL pública da imagem");
    }

    console.log("Imagem preview gerada com sucesso:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Erro na geração da imagem preview:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      birthDate,
      height,
      weight,
      goal,
      profilePicture,
      lifestyle,
      time,
      preferences,
    } = body;

    // Validação básica
    if (!name || !email || !birthDate) {
      return withCors(
        NextResponse.json(
          { error: "Nome, email e data de nascimento são obrigatórios" },
          { status: 400 }
        )
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return withCors(
        NextResponse.json(
          { error: "Usuário já existe com este email" },
          { status: 409 }
        )
      );
    }

    // Criar usuário e perfil em uma transação
    const result = await prisma.$transaction(
      async (tx) => {
        // Criar usuário
        const user = await tx.user.create({
          data: {
            id: crypto.randomUUID(),
            email,
            name,
          },
        });

        // Preparar dados básicos do perfil
        let profileData: any = {
          userId: user.id,
          birthDate: new Date(birthDate),
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          profilePicture: profilePicture || "",
          characteristics: {
            goal,
            lifestyle,
            time,
            preferences: preferences || [],
          },
        };

        let analysisResult = null;
        let imagePreviewUrl = null;

        // Se há uma imagem, fazer a análise
        if (profilePicture) {
          try {
            console.log("Iniciando análise da imagem...");

            // Realizar análise da imagem
            analysisResult = await generateObject({
              model,
              schema: analysisSchema,
              messages: [
                {
                  role: "system",
                  content: DEFAULT_ANALYSIS_PROMPT,
                },
                {
                  role: "user",
                  content: [
                    {
                      type: "image",
                      image: profilePicture,
                    },
                  ],
                },
              ],
            });

            console.log("Análise concluída:", analysisResult.object);

            // Mapear dados da análise para o perfil
            const analysisData = mapAnalysisToProfile(analysisResult.object);

            // Adicionar dados da análise ao perfil
            profileData = {
              ...profileData,
              ...analysisData,
            };

            // Gerar imagem preview
            try {
              imagePreviewUrl = await generateImagePreview(
                profilePicture,
                analysisResult.object,
                preferences || [],
                goal || "",
                lifestyle || ""
              );

              // Adicionar URL da imagem preview ao perfil
              profileData.imagePreview = imagePreviewUrl;
            } catch (imageError) {
              console.error("Erro na geração da imagem preview:", imageError);
              // Continuar sem a imagem preview se houver erro
            }
          } catch (analysisError) {
            console.error("Erro na análise da imagem:", analysisError);
            console.log("Continuando sem análise da imagem...");
          }
        }

        // Criar perfil (com ou sem análise e preview)
        const profile = await tx.profile.create({
          data: profileData,
        });

        return {
          user,
          profile,
          hasImageAnalysis: !!analysisResult,
          hasImagePreview: !!imagePreviewUrl,
        };
      },
      { timeout: 50000 }
    );

    return withCors(
      NextResponse.json({
        success: true,
        message: "Usuário e perfil criados com sucesso",
        user: result.user,
        profile: result.profile,
        hasImageAnalysis: result.hasImageAnalysis,
        hasImagePreview: result.hasImagePreview,
      })
    );
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);

    // Tratar erros específicos
    if (error.message?.includes("rate limit")) {
      return withCors(
        NextResponse.json(
          {
            error:
              "Limite de requisições atingido. Tente novamente em alguns minutos.",
          },
          { status: 429 }
        )
      );
    }

    if (error.message?.includes("invalid image")) {
      return withCors(
        NextResponse.json(
          {
            error:
              "Imagem inválida. Usuário criado, mas análise não foi possível.",
          },
          { status: 400 }
        )
      );
    }

    return withCors(
      NextResponse.json(
        {
          error: "Erro interno do servidor",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // ou especifique o domínio exato
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
