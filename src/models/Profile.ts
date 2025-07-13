import prisma from '@/lib/prisma'
import { Profile } from '@prisma/client'

const updateProfile = async ({
  id,
  faceShape,
  skinTone,
  HairTexture,
  HairColor,
  SignalPresence,
  FacialExpression,
  FacialSymmetry,
  PhotoLighting,
  useOfMakeup,
  VisibleAccessories,
  BackgroundType,
  ImageQuality,
  colorPalatte
}: Profile) => {
  try {
    const profile = await prisma.profile.update({
      where: { userId: id },
      data: {
        faceShape,
        skinTone,
        HairTexture,
        HairColor,
        SignalPresence,
        FacialExpression,
        FacialSymmetry,
        PhotoLighting,
        useOfMakeup,
        VisibleAccessories,
        BackgroundType,
        ImageQuality,
        colorPalatte
      }
    })
    return profile
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

export async function getMyProfile(id: string) {
  return await prisma.profile.findUnique({
    where: { id: id },

  });
}

export { updateProfile }
