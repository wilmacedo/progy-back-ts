-- AlterTable
ALTER TABLE "pending_activities" ALTER COLUMN "activity_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pending_initiatives" ALTER COLUMN "initiative_id" DROP NOT NULL,
ALTER COLUMN "file" DROP NOT NULL,
ALTER COLUMN "comments" DROP NOT NULL;
