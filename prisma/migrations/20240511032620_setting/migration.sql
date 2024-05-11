-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "flowRateA" INTEGER NOT NULL,
    "flowRateB" INTEGER NOT NULL,
    "flowRateC" INTEGER NOT NULL,
    "flowRateD" INTEGER NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
