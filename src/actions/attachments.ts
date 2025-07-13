"use server";

import { createClient } from "@/lib/supabaseServer";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadAttachment(formData: FormData) {
  const supabase = await createClient();

  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return {
        success: false,
        error: "File is required",
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: `File size exceeds the limit of ${
          MAX_FILE_SIZE_BYTES / 1024 / 1024
        }MB`,
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: `File type '${file.type}' is not an image.`,
      };
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
      return {
        success: false,
        error: "Failed to prepare attachment record.",
      };
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`Supabase Storage upload error for:`, uploadError);
      return {
        success: false,
        error: "Failed to upload file to storage.",
        details: uploadError.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error(`Could not get public URL for uploaded file: ${filePath}`);
      return {
        success: false,
        error: "File uploaded but failed to retrieve URL. Upload reverted.",
      };
    }

    try {
      const updatedAttachment = await prisma.attachment.update({
        where: { id: attachmentRecord.id },
        data: {
          fileUrl: publicUrlData.publicUrl,
        },
      });

      return {
        success: true,
        data: updatedAttachment,
      };
    } catch (finalDbError) {
      console.error(
        `Error updating attachment record to COMPLETED:`,
        finalDbError
      );
      return {
        success: false,
        error: "Upload complete but failed to finalize record.",
      };
    }
  } catch (error: any) {
    console.error(`Unhandled error in attachment upload:`, error);
    return {
      success: false,
      error: "An unexpected server error occurred during upload.",
    };
  }
}

export async function deleteAttachment(attachmentId: string) {
  const supabase = await createClient();

  try {
    if (!attachmentId || typeof attachmentId !== "string") {
      return {
        success: false,
        error: "Valid Attachment ID is required",
      };
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      select: { fileKey: true },
    });

    if (!attachment) {
      return {
        success: false,
        error: "Attachment not found",
      };
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

    return {
      success: true,
      message: "Attachment deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting attachment:", error);
    return {
      success: false,
      error: "An unexpected server error occurred during deletion.",
    };
  }
}
