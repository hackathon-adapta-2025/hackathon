"use server";

import OpenAI, { toFile } from "openai";
import { createClient } from "@/lib/supabaseServer";
import prisma from "@/lib/prisma";

const client = new OpenAI();

export async function generateImagePreview(email: string) {
  const supabase = await createClient();

  try {
    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found with the provided email.",
      };
    }

    if (!user.profile) {
      return {
        success: false,
        error: "User profile not found.",
      };
    }

    const prompt = `
    Generate a photorealistic image of the same guy,
    change the hair to blonde.
    `;

    const responseImage = await fetch(
      "https://disparador-storage.szefezuk.com.br/disparador-prod/281477f01604170d6323d88ccf5abe1927447205f3758f73518a2e455bbeafc7.jpeg"
    );
    const arrayBuffer = await responseImage.arrayBuffer();

    const file = await toFile(Buffer.from(arrayBuffer), "image.png", {
      type: "image/png",
    });

    const response = await client.images.edit({
      model: "gpt-image-1",
      image: file,
      prompt,
    });

    const image_base64 = response.data[0].b64_json;
    const image_bytes = Buffer.from(image_base64, "base64");

    // Generate unique filename and path
    const uniqueFileName = `${crypto.randomUUID()}.png`;
    const filePath = `generated-images/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, image_bytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      return {
        success: false,
        error: "Failed to upload file to storage.",
        details: uploadError.message,
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("attachments")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error(`Could not get public URL for uploaded file: ${filePath}`);
      return {
        success: false,
        error: "File uploaded but failed to retrieve URL.",
      };
    }

    // Atualizar o profile do usuário com a imagePreview
    try {
      const updatedProfile = await prisma.profile.update({
        where: { userId: user.id },
        data: {
          imagePreview: publicUrlData.publicUrl,
        },
      });

      return {
        success: true,
        url: publicUrlData.publicUrl,
        profile: updatedProfile,
      };
    } catch (dbError) {
      console.error("Error updating profile with imagePreview:", dbError);
      return {
        success: false,
        error: "Image generated but failed to update profile.",
      };
    }
  } catch (error) {
    console.error("Image generation error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
