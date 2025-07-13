import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${
            MAX_FILE_SIZE_BYTES / 1024 / 1024
          }MB`,
        },
        { status: 413 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `File type '${file.type}' is not an image.` },
        { status: 415 }
      );
    }

    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `attachments/anonymous/${uniqueFileName}`;

    let attachmentRecord;
    try {
      attachmentRecord = await prisma.attachment.create({
        data: {
          fileUrl: "",
          fileKey: filePath,
          fileName: file.name,
          mimeType: file.type,
        },
      });
    } catch (dbError) {
      console.error("Error creating attachment record in DB:", dbError);
      return NextResponse.json(
        { error: "Failed to prepare attachment record." },
        { status: 500 }
      );
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`Supabase Storage upload error for:`, uploadError);

      return NextResponse.json(
        {
          error: "Failed to upload file to storage.",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error(`Could not get public URL for uploaded file: ${filePath}`);

      return NextResponse.json(
        { error: "File uploaded but failed to retrieve URL. Upload reverted." },
        { status: 500 }
      );
    }

    try {
      const updatedAttachment = await prisma.attachment.update({
        where: { id: attachmentRecord.id },
        data: {
          fileUrl: publicUrlData.publicUrl,
        },
      });
      return NextResponse.json(updatedAttachment);
    } catch (finalDbError) {
      console.error(
        `Error updating attachment record to COMPLETED:`,
        finalDbError
      );

      return NextResponse.json(
        { error: "Upload complete but failed to finalize record." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(`Unhandled error in attachment upload:`, error);
    return NextResponse.json(
      { error: "An unexpected server error occurred during upload." },
      { status: 500 }
    );
  }
}
