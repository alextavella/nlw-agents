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
        text: 'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em paragráfos quando for apropriado.'
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
    contents: [text],
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
  Com base no contexto abaixo, responda a pergunta de forma clara e objetiva em português do Brasil.

  Contexto:
  ${context}

  Pergunta:
  ${question}

  Instruções:
  - Seja preciso e natural na resposta.
  - Mantenha a pontuação adequada.
  - Caso não seja possível responder a pergunta, responda que não há informações suficientes.
  - Cite trechos relevantes do contexto para justificar a resposta.
  - Seja claro e conciso.
  - Seja humano e natural.
  - Seja objetivo e direto.
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
