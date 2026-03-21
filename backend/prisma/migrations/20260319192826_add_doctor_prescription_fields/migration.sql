-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "dietChart" JSONB,
ADD COLUMN     "doctorNotes" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medications" JSONB,
ADD COLUMN     "routinePlan" JSONB;
