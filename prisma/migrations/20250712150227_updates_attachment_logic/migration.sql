-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_analysisId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "analysisId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
