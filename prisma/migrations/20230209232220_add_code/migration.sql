/*
  Warnings:

  - Added the required column `code` to the `initiatives` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "initiatives" ADD COLUMN     "code" TEXT NOT NULL;
