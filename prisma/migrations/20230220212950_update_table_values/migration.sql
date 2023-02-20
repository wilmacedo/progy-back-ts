-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "responsible_id" INTEGER;

-- AlterTable
ALTER TABLE "initiatives" ADD COLUMN     "responsible_id" INTEGER;

-- AlterTable
ALTER TABLE "pending_activities" ADD COLUMN     "responsible_id" INTEGER,
ALTER COLUMN "value" SET DATA TYPE DECIMAL;

-- AlterTable
ALTER TABLE "pending_initiatives" ADD COLUMN     "budget_code" TEXT,
ADD COLUMN     "mapp_id" INTEGER,
ADD COLUMN     "responsible_id" INTEGER,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "responsible" SET DATA TYPE TEXT,
ALTER COLUMN "code" SET DATA TYPE TEXT,
ALTER COLUMN "comments" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "sent_emails" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "already_delayed" BOOLEAN NOT NULL DEFAULT false,
    "to_delayed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sent_emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_font_id_fkey" FOREIGN KEY ("font_id") REFERENCES "fonts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_mapp_id_fkey" FOREIGN KEY ("mapp_id") REFERENCES "mapps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
