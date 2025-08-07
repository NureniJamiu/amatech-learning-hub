/*
  Warnings:

  - Added the required column `semester` to the `timetable_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "timetable_entries" ADD COLUMN     "semester" INTEGER NOT NULL;
