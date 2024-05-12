-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPart" (
    "id" SERIAL NOT NULL,
    "week" INTEGER NOT NULL,
    "partA" DECIMAL(5,2) NOT NULL,
    "partB" DECIMAL(5,2) NOT NULL,
    "partC" DECIMAL(5,2) NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "WeeklyPart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeeklyPart" ADD CONSTRAINT "WeeklyPart_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
