/*
  Warnings:

  - You are about to drop the `Info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Info";

-- CreateTable
CREATE TABLE "CurrentState" (
    "id" SERIAL NOT NULL,
    "temperature" DECIMAL(5,2) NOT NULL,
    "ph" DECIMAL(5,2) NOT NULL,
    "ec" DECIMAL(5,2) NOT NULL,
    "waterLevel" "WaterLevel" NOT NULL,

    CONSTRAINT "CurrentState_pkey" PRIMARY KEY ("id")
);
