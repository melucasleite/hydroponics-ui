-- DropForeignKey
ALTER TABLE "WeeklyPart" DROP CONSTRAINT "WeeklyPart_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "WeeklyPart" ADD CONSTRAINT "WeeklyPart_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
