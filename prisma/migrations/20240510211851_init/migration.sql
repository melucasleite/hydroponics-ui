-- CreateTable
CREATE TABLE "Pump" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "flowRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pump_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pump_name_key" ON "Pump"("name");
