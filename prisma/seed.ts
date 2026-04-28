import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const employer = await prisma.user.upsert({
    where: { email: "employer@example.com" },
    update: {},
    create: {
      email: "employer@example.com",
      name: "Demo Employer",
      passwordHash,
      role: Role.EMPLOYER
    }
  });

  await prisma.user.upsert({
    where: { email: "candidate@example.com" },
    update: {},
    create: {
      email: "candidate@example.com",
      name: "Demo Candidate",
      passwordHash,
      role: Role.CANDIDATE
    }
  });

  await prisma.vacancy.create({
    data: {
      title: "Senior Fullstack Engineer",
      description: "Build MVP products with Next.js and PostgreSQL.",
      location: "Remote",
      salaryFrom: 250000,
      salaryTo: 350000,
      employerId: employer.id
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
