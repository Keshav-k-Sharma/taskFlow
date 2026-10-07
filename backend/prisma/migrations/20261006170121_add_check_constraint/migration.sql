-- AlterTable
ALTER TABLE "projects" ADD CONSTRAINT "end_date_check" CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);