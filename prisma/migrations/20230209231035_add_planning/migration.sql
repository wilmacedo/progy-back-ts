/*
  Warnings:

  - Added the required column `planning_id` to the `initiatives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "initiatives" ADD COLUMN     "planning_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
