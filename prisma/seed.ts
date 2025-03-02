import {
  PrismaClient,
  Role,
  WorkOrderStatus,
  ProductionStage,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Manager',
      email: 'manager@example.com',
      password: 'hashedpassword123',
      role: Role.MANAGER,
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@example.com' },
    update: {},
    create: {
      name: 'Operator',
      email: 'operator@example.com',
      password: 'hashedpassword123',
      role: Role.OPERATOR,
    },
  });

  const operator2 = await prisma.user.upsert({
    where: { email: 'operator2@example.com' },
    update: {},
    create: {
      name: 'Operator',
      email: 'operator@example.com',
      password: 'hashedpassword123',
      role: Role.OPERATOR,
    },
  });

  const operator3 = await prisma.user.upsert({
    where: { email: 'operator2@example.com' },
    update: {},
    create: {
      name: 'Operator',
      email: 'operator@example.com',
      password: 'hashedpassword123',
      role: Role.OPERATOR,
    },
  });

  const operators = [operator, operator2, operator3];

  console.log('✅ Created Users:', { manager, operator });

  const workOrders = await Promise.all(
    Array.from({ length: 100 }).map(async (_, index) => {
      const qty = faker.number.int({ min: 1, max: 500 });
      console.log(qty);
      return prisma.workOrder.create({
        data: {
          number: `WO-${new Date().getTime().toString(32).toUpperCase()}-${index}`,
          productName: faker.commerce.productName(),
          quantity: qty,
          status: WorkOrderStatus.PENDING,
          assignedToId: (() => {
            switch (Math.floor(Math.random() * 3) + 1) {
              case 1:
                return operator.id;
              case 2:
                return operator2.id;
              case 3:
                return operator2.id;

              default:
                return operator.id;
            }
          })(),
          createdById: manager.id,
          dueDate: faker.date.future(),
          logs: {
            create: {
              quantityUpdated: qty,
              status: WorkOrderStatus.PENDING,
            },
          },
        },
      });
    }),
  );

  console.log(`✅ Created ${workOrders.length} Work Orders`);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
