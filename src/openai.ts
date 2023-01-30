import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(configuration)

export const createCompletion = async (
  prompt: string
): Promise<string | null> => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.9,
      max_tokens: 2048
    })

    if (!response?.data?.choices?.length) return 'Error: No response'

    return response.data.choices[0].text
  } catch (error) {
    return 'Error: ' + error.message ? error.message : 'Unknown error'
  }
}

export const createImage = async (prompt: string): Promise<Buffer | string> => {
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024'
    })

    const image_url = response?.data?.data[0].url

    if (!image_url) return 'Error: No response'

    const image = await fetch(image_url)

    if (!image.ok) return 'Error: No response'

    const blob = await image.blob()

    return Buffer.from(await blob.arrayBuffer())
  } catch (error) {
    return 'Error: ' + error.message ? error.message : 'Unknown error'
  }
}
