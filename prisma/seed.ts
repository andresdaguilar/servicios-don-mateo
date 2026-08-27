import { PrismaClient } from "@prisma/client";
import { CATEGORY_SEED } from "../lib/constants";

const prisma = new PrismaClient();

async function main() {
  await prisma.recommendationTag.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.report.deleteMany();
  await prisma.requestReply.deleteMany();
  await prisma.request.deleteMany();
  await prisma.providerPhoto.deleteMany();
  await prisma.providerCategory.deleteMany();
  await prisma.moderationEvent.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.urgencyContact.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  for (const cat of CATEGORY_SEED) {
    await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        icon: cat.icon,
        isUrgency: cat.isUrgency,
        sortOrder: cat.sortOrder,
      },
    });
  }

  console.log("Seed OK: categorías listas, sin datos de demo.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
