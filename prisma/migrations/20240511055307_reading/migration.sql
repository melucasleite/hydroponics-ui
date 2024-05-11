-- CreateTable
CREATE TABLE "Reading" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperature" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);
