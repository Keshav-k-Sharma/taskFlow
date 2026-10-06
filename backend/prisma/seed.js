const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      full_name: 'Test User',
      email: 'test@example.com',
      password_hash: passwordHash,
    }
  });

  const project = await prisma.project.create({
    data: {
      name: 'Test Project',
      description: 'A project for testing',
      owner_id: user.id,
      status: 'IN_PROGRESS',
    }
  });

  await prisma.task.create({
    data: {
      name: 'Test Task 1',
      description: 'First task',
      project_id: project.id,
      status: 'PENDING',
      priority: 'HIGH'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
