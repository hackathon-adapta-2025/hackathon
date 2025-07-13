-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "missions" JSONB,
ADD COLUMN     "weekStep" INTEGER NOT NULL DEFAULT 0;
