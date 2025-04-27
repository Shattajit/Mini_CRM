/*
  Warnings:

  - The primary key for the `InteractionLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `InteractionLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InteractionLog" DROP CONSTRAINT "InteractionLog_projectId_fkey";

-- AlterTable
ALTER TABLE "InteractionLog" DROP CONSTRAINT "InteractionLog_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL,
ADD CONSTRAINT "InteractionLog_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "InteractionLog_id_seq";

-- AddForeignKey
ALTER TABLE "InteractionLog" ADD CONSTRAINT "InteractionLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
