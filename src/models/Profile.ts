import prisma from '@/lib/prisma'
import { Profile } from '@prisma/client'

const getMyProfile = async (id: string) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: id },
    })
    return profile
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

export { getMyProfile }
