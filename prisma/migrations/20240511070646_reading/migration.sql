/*
  Warnings:

  - Added the required column `ph` to the `Reading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "ph" DECIMAL(5,2) NOT NULL;
