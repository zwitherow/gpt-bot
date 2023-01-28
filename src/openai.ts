import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
})

export const openai = new OpenAIApi(configuration)

export const createCompletion = async (
  prompt: string
): Promise<string | null> => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.9,
    max_tokens: 2048
  })

  if (!response?.data?.choices?.length) return null

  return response.data.choices[0].text
}
