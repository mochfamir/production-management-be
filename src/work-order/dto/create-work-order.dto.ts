import { IsString, IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class CreateWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  dueDate: Date;

  @IsEnum(Status)
  status?: Status;

  operatorId?: number;
}
