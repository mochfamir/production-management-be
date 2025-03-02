-- CreateEnum
CREATE TYPE "ProductionStage" AS ENUM ('MATERIAL_PREPARATION', 'CUTTING', 'ASSEMBLY', 'PAINTING', 'QUALITY_CONTROL', 'PACKAGING');

-- AlterTable
ALTER TABLE "WorkOrderLog" ADD COLUMN     "productionStage" "ProductionStage";
