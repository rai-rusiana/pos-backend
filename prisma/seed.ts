import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: { email: 'test@example.com', password: 'hashed_pw' }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())