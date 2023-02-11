-- AlterTable
ALTER TABLE "initiatives" ALTER COLUMN "file" DROP NOT NULL,
ALTER COLUMN "comments" DROP NOT NULL;

-- AlterTable
ALTER TABLE "plannings" ALTER COLUMN "sector" DROP NOT NULL;
