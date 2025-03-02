import { IsEnum, IsNumber } from 'class-validator';
import { Status } from './create-work-order.dto';

export enum ProductionStage {
  MATERIAL_PREPARATION = 'Persiapan Material',
  CUTTING = 'Pemotongan',
  ASSEMBLY = 'Perakitan',
  PAINTING = 'Pengecatan',
  QUALITY_CONTROL = 'Kontrol Kualitas',
  PACKAGING = 'Pengemasan',
}

export class UpdateWorkOrderStatusDto {
  @IsEnum(Status)
  status: Status;

  @IsNumber()
  quantity;

  @IsEnum(ProductionStage)
  productionStage?: ProductionStage;

  note?: string;
}
