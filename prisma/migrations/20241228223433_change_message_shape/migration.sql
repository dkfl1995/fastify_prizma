/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_message_id_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mimetype" TEXT;

-- DropTable
DROP TABLE "Attachment";
