/*
  Warnings:

  - You are about to drop the column `lowWaterA` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `lowWaterB` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `lowWaterC` on the `Info` table. All the data in the column will be lost.
  - You are about to drop the column `lowWaterD` on the `Info` table. All the data in the column will be lost.
  - Added the required column `waterLevel` to the `Info` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WaterLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- AlterTable
ALTER TABLE "Info" DROP COLUMN "lowWaterA",
DROP COLUMN "lowWaterB",
DROP COLUMN "lowWaterC",
DROP COLUMN "lowWaterD",
ADD COLUMN     "waterLevel" "WaterLevel" NOT NULL;
