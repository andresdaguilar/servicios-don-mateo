import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { CATEGORY_SEED } from "../lib/constants";
import { normalizePhone } from "../lib/phone";
import { toDisplayName } from "../lib/utils";

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

  const passwordHash = await hash("donmateo", 10);

  const mariana = await prisma.user.create({
    data: {
      name: "Mariana Gómez",
      displayName: toDisplayName("Mariana Gómez"),
      email: "mariana@donmateo.ar",
      passwordHash,
      role: "neighbor",
      communityVerifiedAt: new Date(),
    },
  });

  const andres = await prisma.user.create({
    data: {
      name: "Andrés Aguilar",
      displayName: toDisplayName("Andrés Aguilar"),
      email: process.env.ADMIN_EMAIL?.toLowerCase() ?? "moderacion@donmateo.ar",
      passwordHash,
      role: "moderator",
      communityVerifiedAt: new Date(),
    },
  });

  const lucasUser = await prisma.user.create({
    data: {
      name: "Lucas Pérez",
      displayName: toDisplayName("Lucas Pérez"),
      email: "lucas@donmateo.ar",
      passwordHash,
      role: "neighbor",
      communityVerifiedAt: new Date(),
    },
  });

  const danielUser = await prisma.user.create({
    data: {
      name: "Daniel Fernández",
      displayName: toDisplayName("Daniel Fernández"),
      email: "daniel@donmateo.ar",
      passwordHash,
      role: "provider",
      communityVerifiedAt: new Date(),
    },
  });

  const categories = [];
  for (const cat of CATEGORY_SEED) {
    categories.push(
      await prisma.category.create({
        data: {
          slug: cat.slug,
          name: cat.name,
          icon: cat.icon,
          isUrgency: cat.isUrgency,
          sortOrder: cat.sortOrder,
        },
      }),
    );
  }

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  await prisma.urgencyContact.createMany({
    data: [
      {
        name: "Administración del barrio",
        phone: normalizePhone("1144001100"),
        note: "Lunes a viernes 9 a 17",
        sortOrder: 1,
      },
      {
        name: "Emergencias médicas",
        phone: normalizePhone("107"),
        note: "SAME / urgencias",
        sortOrder: 2,
      },
      {
        name: "Seguridad",
        phone: normalizePhone("1144001199"),
        note: "Vigilancia Don Mateo",
        sortOrder: 3,
      },
    ],
  });

  const daniel = await prisma.provider.create({
    data: {
      name: "Daniel Gasista",
      description:
        "Gasista matriculado. Atiende pérdidas, calefones, cocinas y calefacción. Responde rápido y deja todo prolijo.",
      phone: normalizePhone("1155550101"),
      whatsapp: normalizePhone("1155550101"),
      zone: "a 3 cuadras",
      license: "Gasista matriculado · Mat. 18422",
      status: "approved",
      source: "neighbor",
      createdById: mariana.id,
      ownerId: danielUser.id,
      lastRecommendedAt: new Date(),
      categories: { create: [{ categoryId: bySlug.gas }] },
    },
  });

  const lucas = await prisma.provider.create({
    data: {
      name: "Lucas Electricista",
      description:
        "Instalaciones, tableros y cortes. Trabaja en Don Mateo y alrededores. 10 años de oficio.",
      phone: normalizePhone("1155550102"),
      whatsapp: normalizePhone("1155550102"),
      zone: "a 5 cuadras",
      license: "Matrícula electricista",
      status: "approved",
      source: "neighbor",
      createdById: mariana.id,
      lastRecommendedAt: new Date(Date.now() - 86400000),
      categories: { create: [{ categoryId: bySlug.electricidad }] },
    },
  });

  const ana = await prisma.provider.create({
    data: {
      name: "Ana Plomería",
      description: "Destapes, canillas y termotanques. Clara con el presupuesto.",
      phone: normalizePhone("1155550103"),
      whatsapp: normalizePhone("1155550103"),
      zone: "Don Mateo",
      status: "approved",
      source: "neighbor",
      createdById: lucasUser.id,
      lastRecommendedAt: new Date(Date.now() - 3600000 * 30),
      categories: { create: [{ categoryId: bySlug.plomeria }] },
    },
  });

  const bici = await prisma.provider.create({
    data: {
      name: "Taller Lo de Rui",
      description: "Bicicletería del barrio. Ajustes, cubiertas y service.",
      phone: normalizePhone("1155550104"),
      whatsapp: normalizePhone("1155550104"),
      zone: "entrada del barrio",
      status: "approved",
      source: "self",
      createdById: andres.id,
      lastRecommendedAt: new Date(Date.now() - 86400000 * 4),
      categories: { create: [{ categoryId: bySlug.bicicletas }] },
    },
  });

  const pending = await prisma.provider.create({
    data: {
      name: "Mati Jardinería",
      description: "Corte de césped y poda. Recién publicado por el prestador.",
      phone: normalizePhone("1155550199"),
      whatsapp: normalizePhone("1155550199"),
      zone: "Don Mateo",
      status: "pending",
      source: "self",
      createdById: lucasUser.id,
      categories: { create: [{ categoryId: bySlug.jardineria }] },
    },
  });

  await prisma.recommendation.create({
    data: {
      comment: "Vino enseguida por una pérdida. Dejó todo prolijo y el precio fue claro.",
      hired: true,
      wouldCallAgain: true,
      rating: 5,
      userId: mariana.id,
      providerId: daniel.id,
      tags: {
        create: [
          { tag: "respondio_rapido" },
          { tag: "trabajo_prolijo" },
          { tag: "puntual" },
        ],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      comment: "Lo llamé un domingo y atendió. Buen precio.",
      hired: true,
      wouldCallAgain: true,
      rating: 5,
      userId: lucasUser.id,
      providerId: daniel.id,
      tags: {
        create: [{ tag: "buen_precio" }, { tag: "respondio_rapido" }],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      comment: "Cambió el tablero de la cocina. Muy prolijo.",
      hired: true,
      wouldCallAgain: true,
      rating: 5,
      userId: mariana.id,
      providerId: lucas.id,
      tags: {
        create: [{ tag: "trabajo_prolijo" }, { tag: "puntual" }],
      },
    },
  });

  await prisma.recommendation.create({
    data: {
      comment: "Destapó la pileta en un rato. Volvería a llamarla.",
      hired: true,
      wouldCallAgain: true,
      rating: 4,
      userId: andres.id,
      providerId: ana.id,
      tags: {
        create: [{ tag: "respondio_rapido" }, { tag: "buen_precio" }],
      },
    },
  });

  await prisma.comment.create({
    data: {
      body: "Lo recomendó mi vecina de la manzana 4 y coincido.",
      displayName: mariana.displayName,
      userId: mariana.id,
      providerId: daniel.id,
    },
  });

  await prisma.favorite.create({
    data: { userId: mariana.id, providerId: daniel.id },
  });

  await prisma.report.create({
    data: {
      targetType: "provider",
      targetId: bici.id,
      providerId: bici.id,
      reason: "outdated",
      details: "El WhatsApp no contesta desde hace semanas.",
      reporterId: mariana.id,
    },
  });

  const request = await prisma.request.create({
    data: {
      body: "Busco gasista para pérdida. Zona Don Mateo. Urgente.",
      urgent: true,
      categoryId: bySlug.gas,
      userId: lucasUser.id,
    },
  });

  await prisma.requestReply.create({
    data: {
      body: "Te paso a Daniel, lo usé el mes pasado y vino rápido.",
      requestId: request.id,
      userId: mariana.id,
      providerId: daniel.id,
    },
  });

  await prisma.moderationEvent.create({
    data: {
      action: "seed",
      details: "Datos de ejemplo cargados",
      userId: andres.id,
    },
  });

  void pending;
  console.log("Seed OK: mariana@donmateo.ar / donmateo");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
