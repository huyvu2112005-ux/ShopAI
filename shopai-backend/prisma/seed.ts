import {PrismaClient} from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
 await prisma.user.upsert({where: {email: 'demo@shopai.com'}, update: {}, create: {email: 'demo@shopai.com', name: 'ShopAI Demo', password: await bcrypt.hash('123456', 12)}});
 console.log('Demo: demo@shopai.com / 123456');
}
main().finally(() => prisma.$disconnect());
