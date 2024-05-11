-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "temperature" DECIMAL(3,2) NOT NULL,
    "lowWaterA" BOOLEAN NOT NULL,
    "lowWaterB" BOOLEAN NOT NULL,
    "lowWaterC" BOOLEAN NOT NULL,
    "lowWaterD" BOOLEAN NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);
