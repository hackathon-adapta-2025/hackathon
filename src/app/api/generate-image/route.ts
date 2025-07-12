import { NextResponse } from 'next/server'
import fs from 'fs'
import OpenAI, { toFile } from 'openai'

const client = new OpenAI()

export async function GET() {
  try {
    const prompt = `
    Generate a photorealistic image of the same guy,
    change the hair to blonde.
    `

    const responseImage = await fetch(
      'https://disparador-storage.szefezuk.com.br/disparador-prod/281477f01604170d6323d88ccf5abe1927447205f3758f73518a2e455bbeafc7.jpeg'
    )
    const arrayBuffer = await responseImage.arrayBuffer()

    const file = await toFile(Buffer.from(arrayBuffer), 'image.png', {
      type: 'image/png'
    })

    const response = await client.images.edit({
      model: 'gpt-image-1',
      image: file,
      prompt
    })

    const image_base64 = response.data[0].b64_json
    const image_bytes = Buffer.from(image_base64, 'base64')

    fs.writeFileSync('basket.png', image_bytes)

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${image_base64}`
    })
  } catch (error) {
    console.error('Image generation error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate image'
      },
      { status: 500 }
    )
  }
}
