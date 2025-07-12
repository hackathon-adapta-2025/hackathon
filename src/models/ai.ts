'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const generateColorPalette = async () => {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: 'Gere uma palteta de cores.'
  })

  return text
}

export { generateColorPalette }
