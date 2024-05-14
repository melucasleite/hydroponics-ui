/*
  Warnings:

  - You are about to drop the column `date` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `minute` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `second` on the `Reading` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reading" DROP COLUMN "date",
DROP COLUMN "hour",
DROP COLUMN "minute",
DROP COLUMN "second";
