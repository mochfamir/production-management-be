import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { WorkOrderService } from './work-order.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderStatusDto } from './dto/update-work-order-status.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { parseQueryStringToFilters } from 'src/utils/query-to-filter';

@Controller('work-orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  // Production Manager: Create Work Order
  @Post()
  @Roles('MANAGER')
  create(@Body() createWorkOrderDto: CreateWorkOrderDto, @GetUser() user: any) {
    return this.workOrderService.create(createWorkOrderDto, user.userId);
  }

  // Production Manager & Operator: Get All Work Orders
  @Get()
  @Roles('MANAGER', 'OPERATOR')
  findAll(
    @Query('filters') filters?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Request() req?,
  ) {
    const _limit = Number(limit || 10);
    const _page = Number(page || 1);
    const filterParams = filters
      ? parseQueryStringToFilters(filters as string)
      : null;
    return this.workOrderService.findAll(filterParams, _limit, _page, req.user);
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
      user.userId,
    );
  }
}
