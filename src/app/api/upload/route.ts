import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/lib/supabaseClient'
import { withCors } from '@/lib/cors'

const prisma = new PrismaClient()

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return withCors(
        NextResponse.json(
          { success: false, error: 'File is required' },
          { status: 400 }
        )
      )
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            error: `File size exceeds the limit of ${
              MAX_FILE_SIZE_BYTES / 1024 / 1024
            }MB`
          },
          { status: 400 }
        )
      )
    }

    if (!file.type.startsWith('image/')) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            error: `File type '${file.type}' is not an image.`
          },
          { status: 400 }
        )
      )
    }

    const fileExtension = file.name.split('.').pop() || ''
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`
    const filePath = `attachments/anonymous/${uniqueFileName}`

    // Criar registro no banco primeiro
    let attachmentRecord
    try {
      attachmentRecord = await prisma.attachment.create({
        data: {
          fileUrl: '',
          fileKey: filePath,
          fileName: file.name,
          mimeType: file.type
        }
      })
    } catch (dbError) {
      console.error('Error creating attachment record in DB:', dbError)
      return withCors(
        NextResponse.json(
          { success: false, error: 'Failed to prepare attachment record.' },
          { status: 500 }
        )
      )
    }

    // Converter File para ArrayBuffer para o Supabase
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError)

      // Limpar registro do banco se o upload falhou
      await prisma.attachment.delete({
        where: { id: attachmentRecord.id }
      })

      return withCors(
        NextResponse.json(
          {
            success: false,
            error: 'Failed to upload file to storage.',
            details: uploadError.message
          },
          { status: 500 }
        )
      )
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      console.error(`Could not get public URL for uploaded file: ${filePath}`)

      // Limpar arquivo e registro se não conseguir obter URL
      await supabase.storage.from('attachments').remove([filePath])
      await prisma.attachment.delete({
        where: { id: attachmentRecord.id }
      })

      return withCors(
        NextResponse.json(
          {
            success: false,
            error: 'File uploaded but failed to retrieve URL.'
          },
          { status: 500 }
        )
      )
    }

    // Atualizar registro com a URL pública
    try {
      const updatedAttachment = await prisma.attachment.update({
        where: { id: attachmentRecord.id },
        data: {
          fileUrl: publicUrlData.publicUrl
        }
      })

      return withCors(
        NextResponse.json({
          success: true,
          data: updatedAttachment
        })
      )
    } catch (finalDbError) {
      console.error('Error updating attachment record:', finalDbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Upload complete but failed to finalize record.'
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Unhandled error in attachment upload:', error)
    return withCors(
      NextResponse.json(
        {
          success: false,
          error: 'An unexpected server error occurred during upload.'
        },
        { status: 500 }
      )
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // ou especifique o domínio exato
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
