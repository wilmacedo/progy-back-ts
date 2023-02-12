-- AlterTable
ALTER TABLE "users" ADD COLUMN     "unit_id" INTEGER,
ALTER COLUMN "institution_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
