import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const attachmentId = body.attachmentId;

    if (!attachmentId || typeof attachmentId !== "string") {
      return NextResponse.json(
        { error: "Valid Attachment ID is required" },
        { status: 400 }
      );
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      select: { fileKey: true },
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    const { error: storageError } = await supabase.storage
      .from("attachments")
      .remove([attachment.fileKey]);

    if (storageError && storageError.message !== "The resource was not found") {
      console.error(
        `Error deleting file ${attachment.fileKey} from storage:`,
        storageError
      );
    }

    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json({
      success: true,
      message: "Attachment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred during deletion." },
      { status: 500 }
    );
  }
}
