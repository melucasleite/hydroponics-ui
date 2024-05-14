/*
  Warnings:

  - Added the required column `hour` to the `Reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minute` to the `Reading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second` to the `Reading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "second" INTEGER NOT NULL DEFAULT -1;
