import { GoogleGenAI } from '@google/genai'

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const model_25_flash = 'gemini-2.5-flash'
const model_text_embeddings_004 = 'text-embeddings-004'

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
    model: model_text_embeddings_004,
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
