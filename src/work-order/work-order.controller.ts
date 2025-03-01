import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { WorkOrderService } from './work-order.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderStatusDto } from './dto/update-work-order-status.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('work-orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  // Production Manager: Create Work Order
  @Post()
  @Roles('MANAGER')
  create(@Body() createWorkOrderDto: CreateWorkOrderDto, @GetUser() user: any) {
    console.log('User:', user);
    return this.workOrderService.create(createWorkOrderDto, user.userId);
  }

  // Production Manager & Operator: Get All Work Orders
  @Get()
  @Roles('MANAGER', 'OPERATOR')
  findAll() {
    return this.workOrderService.findAll();
  }

  // Production Manager & Operator: Get Work Order by ID
  @Get(':id')
  @Roles('MANAGER', 'OPERATOR')
  findOne(@Param('id') id: string) {
    return this.workOrderService.findOne(id);
  }

  // Production Manager: Update Work Order
  @Patch(':id')
  @Roles('MANAGER')
  update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: Partial<CreateWorkOrderDto>,
  ) {
    return this.workOrderService.update(id, updateWorkOrderDto);
  }

  // Production Manager: Delete Work Order
  @Delete(':id')
  @Roles('MANAGER')
  remove(@Param('id') id: string) {
    return this.workOrderService.remove(id);
  }

  // Operator: Update Work Order Status
  @Patch(':id/status')
  @Roles('OPERATOR')
  updateStatus(
    @Param('id') id: string,
    @Body() updateWorkOrderStatusDto: UpdateWorkOrderStatusDto,
    @GetUser() user: any,
  ) {
    return this.workOrderService.updateStatus(
      id,
      updateWorkOrderStatusDto,
      user.id,
    );
  }
}
