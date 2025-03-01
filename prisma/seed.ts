import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Production Manager',
      email: 'manager@example.com',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@example.com' },
    update: {},
    create: {
      name: 'Operator 1',
      email: 'operator@example.com',
      password: hashedPassword,
      role: 'OPERATOR',
    },
  });

  console.log('✅ Seeded Users:', { manager, operator });

  const workOrder1 = await prisma.workOrder.create({
    data: {
      number: 'WO-20240301-001',
      productName: 'Product A',
      quantity: 100,
      status: 'PENDING',
      assignedToId: operator.id,
      dueDate: new Date('2024-03-10T00:00:00Z'),
    },
  });

  const workOrder2 = await prisma.workOrder.create({
    data: {
      number: 'WO-20240301-002',
      productName: 'Product B',
      quantity: 200,
      status: 'PENDING',
      assignedToId: operator.id,
      dueDate: new Date('2024-03-15T00:00:00Z'),
    },
  });

  console.log('✅ Seeded Work Orders:', { workOrder1, workOrder2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
