/*
  Warnings:

  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Setting";

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "flowRateA" INTEGER NOT NULL,
    "flowRateB" INTEGER NOT NULL,
    "flowRateC" INTEGER NOT NULL,
    "flowRateD" INTEGER NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
