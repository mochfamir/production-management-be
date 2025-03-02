import { PrismaClient, Role, WorkOrderStatus, ProductionStage } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      name: "Manager",
      email: "manager@example.com",
      password: "hashedpassword123",
      role: Role.MANAGER,
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: "operator@example.com" },
    update: {},
    create: {
      name: "Operator",
      email: "operator@example.com",
      password: "hashedpassword123",
      role: Role.OPERATOR,
    },
  });

  console.log("✅ Created Users:", { manager, operator });

  const workOrders = await Promise.all(
    Array.from({ length: 30 }).map(async (_, index) => {
      return prisma.workOrder.create({
        data: {
          number: `WO-${1000 + index}`,
          productName: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 500 }),
          status: faker.helpers.arrayElement(Object.values(WorkOrderStatus)),
          assignedToId: operator.id,
          createdById: manager.id,
          dueDate: faker.date.future(),
        },
      });
    })
  );

  console.log(`✅ Created ${workOrders.length} Work Orders`);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
