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
        logs: {
          create: {
            quantityUpdated: createWorkOrderDto.quantity,
            status: createWorkOrderDto.status || 'PENDING',
          },
        },
      },
    });
  }

  // Production Manager & Operator: Get All Work Orders
  async findAll(
    filterParams?: any[] | null,
    limit?: number,
    page?: number,
    user?: any,
  ) {
    const filters = {};

    if (filterParams?.length) {
      filterParams.forEach((item) => {
        item.operator === 'eq'
          ? (filters[item.field] = item.value)
          : (filters[item.field] = {
              [item.operator]: item.value,
            });
      });
    }

    if (user.role === 'OPERATOR') {
      filters['assignedToId'] = user.userId;
    }

    const totalWorkOrders = await this.prisma.workOrder.count({
      where: filters,
    });

    const workOrders = await this.prisma.workOrder.findMany({
      where: filters,
      take: limit || undefined,
      skip: ((page || 1) - 1) * (limit || 10),
      include: {
        logs: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    console.log(workOrders);

    return {
      data: workOrders.map((wO) => ({
        ...wO,
        quantity: wO?.logs?.[0]?.quantityUpdated || wO.quantity,
      })),
      total: totalWorkOrders,
    };
  }

  // Production Manager & Operator: Get Work Order by ID
  async findOne(id: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        logs: {
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    const newestLogs = workOrder?.logs?.[0];

    return {
      ...workOrder,
      quantity: newestLogs?.quantityUpdated || workOrder.quantity,
    };
  }

  // Production Manager: Update Work Order
  async update(id: string, updateWorkOrderDto: Partial<CreateWorkOrderDto>) {
    const workOrder = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    const status = updateWorkOrderDto.status;

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        ...updateWorkOrderDto,
        logs: {
          create: {
            quantityUpdated:
              status !== Status.CANCELED
                ? updateWorkOrderDto.quantity || workOrder.quantity
                : workOrder.quantity,
            status: updateWorkOrderDto.status || workOrder.status,
          },
        },
      },
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
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        logs: {
          where: {
            status: {
              equals: Status.IN_PROGRESS,
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
    if (!workOrder) throw new NotFoundException('Work Order not found');

    if (workOrder.assignedToId !== userId) {
      throw new NotFoundException('You are not assigned to this Work Order');
    }

    if (
      !updateWorkOrderStatusDto.productionStage &&
      ((workOrder.status === Status.PENDING &&
        updateWorkOrderStatusDto.status !== Status.IN_PROGRESS) ||
        (workOrder.status === Status.IN_PROGRESS &&
          updateWorkOrderStatusDto.status !== Status.COMPLETED))
    ) {
      throw new NotFoundException('Invalid status transition');
    }

    const logUpdate = {
      status: updateWorkOrderStatusDto.status,
      quantityUpdated: updateWorkOrderStatusDto.quantity,
      note: updateWorkOrderStatusDto.note || '',
    };

    if (
      workOrder.status === Status.IN_PROGRESS &&
      updateWorkOrderStatusDto.productionStage
    ) {
      logUpdate['productionStage'] = updateWorkOrderStatusDto.productionStage;
      logUpdate['quantityUpdated'] = workOrder.logs[0].quantityUpdated;
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: updateWorkOrderStatusDto.status,
        logs: {
          create: {
            ...logUpdate,
          },
        },
      },
    });
  }
}
