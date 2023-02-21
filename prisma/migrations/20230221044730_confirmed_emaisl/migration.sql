-- CreateTable
CREATE TABLE "confirmed_emails" (
    "id" SERIAL NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "confirmed_emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "confirmed_emails" ADD CONSTRAINT "confirmed_emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
