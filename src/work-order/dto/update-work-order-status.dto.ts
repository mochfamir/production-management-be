import { IsEnum } from 'class-validator';
import { Status } from './create-work-order.dto';

export class UpdateWorkOrderStatusDto {
  @IsEnum(Status)
  status: Status;
}
