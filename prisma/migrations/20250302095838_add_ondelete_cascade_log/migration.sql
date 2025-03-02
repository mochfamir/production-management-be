-- DropForeignKey
ALTER TABLE "WorkOrderLog" DROP CONSTRAINT "WorkOrderLog_workOrderId_fkey";

-- AddForeignKey
ALTER TABLE "WorkOrderLog" ADD CONSTRAINT "WorkOrderLog_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
