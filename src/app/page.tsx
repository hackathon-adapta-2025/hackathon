"use client";

<<<<<<< HEAD
import { Button } from "@/components/ui/button";

import { useState } from "react";

=======
>>>>>>> e16b87b (refactor: remove unused components and hooks)
export default function Home() {

  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Button
        onClick={async () => {
//           const callResult = await analyzeImage({
//             imageUrl:
//               "https://disparador-storage.szefezuk.com.br/disparador-prod/281477f01604170d6323d88ccf5abe1927447205f3758f73518a2e455bbeafc7.jpeg",
//             prompt: `
//             Você é um agente de IA especialista em colorimetria e teoria das cores. Sua função é atuar como um consultor de estilo digital, analisando as características de um usuário para criar uma paleta de cores personalizada e harmoniosa que realce sua beleza natural.

// ## Objetivo Principal

// Com base nos atributos de tom de pele, subtom de pele e cor do cabelo e dos olhos do usuário, sua tarefa é determinar a estação de cor correspondente (ex: Outono Quente, Inverno Frio) e, a partir dela, gerar uma paleta de até 5 cores funcionais e complementares. A saída deve ser exclusivamente um objeto JSON.

// ## Regras de Geração da Paleta:

// 1. Análise Sazonal (Base Teórica):
// * Primeiro, determine internamente a estação de cor do usuário com base na combinação de subtom de pele, cor de cabelo e olhos.
// * O nome da paleta deve refletir essa estação.
// 2. Seleção e Estrutura da Paleta
// * Com base na estação definida, gere uma paleta de exatamente 5 cores que sejam harmoniosas entre si.
// * As cores devem ser distribuídas nos seguintes papéis para garantir usabilidade:
// * cor_neutra: A base do guarda-roupa. Uma cor versátil e sofisticada (ex: off-white, bege, cinza-claro, marinho).
// * cor_primaria: A cor principal da paleta. Deve ser muito favorável ao subtom do usuário.
// * cor_secundaria_1: Uma cor que complementa diretamente a cor primária.
// * cor_secundaria_2: Uma segunda cor complementar que oferece variedade e possibilidade de combinações.
// * cor_de_acento: Uma cor mais vibrante ou profunda para ser usada em detalhes, acessórios ou para criar um ponto de destaque. Frequentemente, pode ser inspirada pela cor dos olhos.
// 3. Formato das Cores:
// * Todas as cores devem ser representadas em formato de string hexadecimal (ex: '#A9C4B5').`,
//           });
//           setResult(JSON.stringify(callResult, null, 2));
        }}
      >
        aa
      </Button>

      {result && <pre className="mt-4 p-4 rounded">{result}</pre>}
    </div>
=======
    <></>
>>>>>>> e16b87b (refactor: remove unused components and hooks)
  );
}
