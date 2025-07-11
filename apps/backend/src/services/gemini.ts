import { GoogleGenAI } from '@google/genai'

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const model_25_flash = 'gemini-2.5-flash'
const model_text_embedding_004 = 'text-embedding-004'

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model: model_25_flash,
    contents: [
      {
        text: 'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriado.'
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64
        }
      }
    ]
  })

  if (!response.text) {
    throw new Error('Não foi possível transcrever o áudio')
  }

  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: model_text_embedding_004,
    contents: [
      {
        text
      }
    ],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT'
    }
  })

  if (!response.embeddings?.[0]?.values) {
    throw new Error('Não foi possível gerar embeddings')
  }

  return response.embeddings[0].values
}

export async function generateAnswer(question: string, chunks: string[]) {
  const context = chunks.join('\n\n')

  const prompt = `
  Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português do Brasil.
  
  CONTEXTO:
  ${context}

  PERGUNTA:
  ${question}

  INSTRUÇÕES:
  - Use apenas informações contidas no contexto enviado;
  - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficientes para responder;
  - Seja objetivo;
  - Mantenha um tom educativo e profissional;
  - Cite trechos relevantes do contexto se apropriado;
  - Se for citar o contexto, utilize o temo "conteúdo da aula";
  `.trim()

  const response = await gemini.models.generateContent({
    model: model_25_flash,
    contents: [
      {
        text: prompt
      }
    ]
  })

  if (!response.text) {
    throw new Error('Não foi possível gerar a resposta')
  }

  return response.text
}
