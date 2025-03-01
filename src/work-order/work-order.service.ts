import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderStatusDto } from './dto/update-work-order-status.dto';
import { Status } from './dto/create-work-order.dto';

@Injectable()
export class WorkOrderService {
  constructor(private prisma: PrismaService) {}

  // Production Manager: Create Work Order
  async create(createWorkOrderDto: CreateWorkOrderDto, createdById: string) {
    const number = `WO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, '0')}`;
    return this.prisma.workOrder.create({
      data: {
        ...createWorkOrderDto,
        number,
        createdById,
      },
    });
  }

  // Production Manager & Operator: Get All Work Orders
  async findAll() {
    return this.prisma.workOrder.findMany();
  }

  // Production Manager & Operator: Get Work Order by ID
  async findOne(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('Work Order not found');
    return workOrder;
  }

  // Production Manager: Update Work Order
  async update(id: string, updateWorkOrderDto: Partial<CreateWorkOrderDto>) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    return this.prisma.workOrder.update({
      where: { id },
      data: updateWorkOrderDto,
    });
  }

  // Production Manager: Delete Work Order
  async remove(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    return this.prisma.workOrder.delete({ where: { id } });
  }

  // Operator: Update Work Order Status
  async updateStatus(
    id: string,
    updateWorkOrderStatusDto: UpdateWorkOrderStatusDto,
    userId: string,
  ) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    if (workOrder.assignedToId !== userId) {
      throw new NotFoundException('You are not assigned to this Work Order');
    }

    if (
      (workOrder.status === Status.PENDING &&
        updateWorkOrderStatusDto.status !== Status.IN_PROGRESS) ||
      (workOrder.status === Status.IN_PROGRESS &&
        updateWorkOrderStatusDto.status !== Status.COMPLETED)
    ) {
      throw new NotFoundException('Invalid status transition');
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: { status: updateWorkOrderStatusDto.status },
    });
  }
}
