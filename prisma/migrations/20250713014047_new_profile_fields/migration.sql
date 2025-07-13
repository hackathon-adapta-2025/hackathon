/*
  Warnings:

  - You are about to drop the column `age` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `isPregnant` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FaceShape" AS ENUM ('OVAL', 'SQUARE', 'RECTANGULAR', 'TRIANGLE', 'INVERTED_TRIANGLE', 'DIAMOND', 'CIRCULAR', 'TRIANGULAR');

-- CreateEnum
CREATE TYPE "SkinTone" AS ENUM ('VERY_FAIR', 'FAIR', 'LIGHT', 'LIGHT_MEDIUM', 'MEDIUM', 'MEDIUM_TAN', 'TAN', 'DEEP_TAN', 'DEEP', 'VERY_DEEP', 'EBONY');

-- CreateEnum
CREATE TYPE "HairTexture" AS ENUM ('STRAIGHT_1A', 'STRAIGHT_1B', 'STRAIGHT_1C', 'WAVY_2A', 'WAVY_2B', 'WAVY_2C', 'CURLY_3A', 'CURLY_3B', 'CURLY_3C', 'COILY_4A', 'COILY_4B', 'COILY_4C');

-- CreateEnum
CREATE TYPE "HairColor" AS ENUM ('BLACK', 'DARK_BROWN', 'MEDIUM_BROWN', 'LIGHT_BROWN', 'BLONDE', 'DARK_BLONDE', 'PLATINUM_BLONDE', 'ASH_BLONDE', 'GOLDEN_BLONDE', 'RED', 'AUBURN', 'GINGER', 'COPPER', 'BURGUNDY', 'MAHOGANY', 'GREY', 'WHITE', 'BLUE', 'GREEN', 'PURPLE', 'PINK', 'SILVER', 'MULTICOLOR', 'OTHER');

-- CreateEnum
CREATE TYPE "SignalPresence" AS ENUM ('ACNE', 'MANCHAS', 'OLHEIRAS', 'LINHAS_FINAS', 'RUGAS');

-- CreateEnum
CREATE TYPE "FacialExpression" AS ENUM ('NEUTRAL', 'HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'DISGUSTED', 'FEARFUL', 'CONFUSED', 'SMIRK', 'TIRED', 'FOCUSED', 'RELAXED', 'ANXIOUS', 'OTHER');

-- CreateEnum
CREATE TYPE "FacialSymmetry" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PhotoLighting" AS ENUM ('GOOD', 'POOR', 'HARSH_SHADOW', 'ARTIFICIAL_LIGHT', 'NATURAL_LIGHT');

-- CreateEnum
CREATE TYPE "BackgroundType" AS ENUM ('NEUTRAL', 'INDOOR', 'OUTDOOR');

-- CreateEnum
CREATE TYPE "ImageQuality" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "age",
DROP COLUMN "gender",
DROP COLUMN "isPregnant",
DROP COLUMN "preferences",
ADD COLUMN     "BackgroundType" "BackgroundType",
ADD COLUMN     "FacialExpression" "FacialExpression",
ADD COLUMN     "FacialSymmetry" "FacialSymmetry",
ADD COLUMN     "HairColor" "HairColor",
ADD COLUMN     "HairTexture" "HairTexture",
ADD COLUMN     "ImageQuality" "ImageQuality",
ADD COLUMN     "PhotoLighting" "PhotoLighting",
ADD COLUMN     "SignalPresence" "SignalPresence",
ADD COLUMN     "VisibleAccessories" TEXT[],
ADD COLUMN     "apparentAge" INTEGER,
ADD COLUMN     "birthDate" DATE NOT NULL,
ADD COLUMN     "characteristics" JSONB,
ADD COLUMN     "colorPalatte" JSONB,
ADD COLUMN     "faceShape" "FaceShape",
ADD COLUMN     "imagePreview" TEXT,
ADD COLUMN     "profilePicture" TEXT NOT NULL,
ADD COLUMN     "skinTone" "SkinTone",
ADD COLUMN     "useOfMakeup" BOOLEAN;

-- DropEnum
DROP TYPE "Gender";
