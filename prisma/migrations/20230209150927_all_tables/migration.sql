-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_institution_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- CreateTable
CREATE TABLE "plannings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "institution_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plannings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perspectives" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perspectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fonts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "other_value" INTEGER NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fonts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiatives" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "perspective_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "font_id" INTEGER NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "responsible_id" INTEGER NOT NULL,
    "budget_code" INTEGER NOT NULL,
    "mapp_id" INTEGER NOT NULL,
    "file" BYTEA NOT NULL,
    "comments" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initiative_id" INTEGER NOT NULL,
    "responsible_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(4,2) NOT NULL,
    "file" BYTEA NOT NULL,
    "comments" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_initiatives" (
    "id" SERIAL NOT NULL,
    "initiative_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "perspective_id" INTEGER NOT NULL,
    "stage_id" INTEGER NOT NULL,
    "font_id" INTEGER NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "responsible_id" INTEGER NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "budget_code" INTEGER NOT NULL,
    "mapp_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "file" BYTEA NOT NULL,
    "comments" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_activities" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "initiative_id" INTEGER NOT NULL,
    "responsible_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "date_start" TIMESTAMP(3) NOT NULL,
    "date_end" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(4,2) NOT NULL,
    "file" BYTEA NOT NULL,
    "comments" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mapps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mapps_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perspectives" ADD CONSTRAINT "perspectives_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fonts" ADD CONSTRAINT "fonts_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_perspective_id_fkey" FOREIGN KEY ("perspective_id") REFERENCES "perspectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_font_id_fkey" FOREIGN KEY ("font_id") REFERENCES "fonts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_mapp_id_fkey" FOREIGN KEY ("mapp_id") REFERENCES "mapps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_perspective_id_fkey" FOREIGN KEY ("perspective_id") REFERENCES "perspectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_font_id_fkey" FOREIGN KEY ("font_id") REFERENCES "fonts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_initiatives" ADD CONSTRAINT "pending_initiatives_mapp_id_fkey" FOREIGN KEY ("mapp_id") REFERENCES "mapps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_responsible_id_fkey" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_activities" ADD CONSTRAINT "pending_activities_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mapps" ADD CONSTRAINT "mapps_planning_id_fkey" FOREIGN KEY ("planning_id") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
