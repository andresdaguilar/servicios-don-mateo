export const APP_NAME = "Servicios Don Mateo";
export const APP_TAGLINE = "Contactos recomendados por vecinos";

export const TRUST_TAGS = [
  { id: "puntual", label: "Puntual" },
  { id: "buen_precio", label: "Buen precio" },
  { id: "respondio_rapido", label: "Respondió rápido" },
  { id: "trabajo_prolijo", label: "Trabajo prolijo" },
] as const;

export type TrustTagId = (typeof TRUST_TAGS)[number]["id"];

export const TRUST_TAG_LABELS: Record<string, string> = Object.fromEntries(
  TRUST_TAGS.map((tag) => [tag.id, tag.label]),
);

export const REPORT_REASONS: { id: string; label: string }[] = [
  { id: "suspicious", label: "Algo extraño" },
  { id: "incorrect_data", label: "Datos incorrectos" },
  { id: "outdated", label: "Contacto desactualizado" },
  { id: "offensive", label: "Contenido ofensivo" },
  { id: "spam", label: "Spam" },
  { id: "duplicate", label: "Duplicado" },
  { id: "wrong_category", label: "Mala categoría" },
  { id: "inappropriate", label: "Comportamiento inapropiado" },
];

export const POPULAR_CATEGORY_SLUGS = [
  "gas",
  "plomeria",
  "electricidad",
  "bicicletas",
] as const;

export const CATEGORY_SEED = [
  { slug: "gas", name: "Gas", icon: "flame", isUrgency: true, sortOrder: 1 },
  { slug: "plomeria", name: "Plomería", icon: "wrench", isUrgency: true, sortOrder: 2 },
  { slug: "electricidad", name: "Electricidad", icon: "zap", isUrgency: true, sortOrder: 3 },
  { slug: "bicicletas", name: "Bicicletas", icon: "bike", isUrgency: false, sortOrder: 4 },
  { slug: "jardineria", name: "Jardinería", icon: "flower-2", isUrgency: false, sortOrder: 5 },
  { slug: "construccion", name: "Construcción", icon: "hammer", isUrgency: false, sortOrder: 6 },
  { slug: "limpieza", name: "Limpieza", icon: "sparkles", isUrgency: false, sortOrder: 7 },
  { slug: "cerrajeria", name: "Cerrajería", icon: "key-round", isUrgency: true, sortOrder: 8 },
  { slug: "mascotas", name: "Mascotas", icon: "paw-print", isUrgency: true, sortOrder: 9 },
  { slug: "clases", name: "Clases", icon: "graduation-cap", isUrgency: false, sortOrder: 10 },
  { slug: "veterinaria", name: "Veterinaria", icon: "heart-pulse", isUrgency: true, sortOrder: 11 },
  { slug: "salud", name: "Emergencias médicas", icon: "cross", isUrgency: true, sortOrder: 12 },
  { slug: "seguridad", name: "Seguridad", icon: "shield", isUrgency: true, sortOrder: 13 },
  { slug: "administracion", name: "Administración", icon: "building-2", isUrgency: true, sortOrder: 14 },
  { slug: "transporte", name: "Transporte", icon: "car", isUrgency: false, sortOrder: 15 },
  { slug: "mecanico", name: "Mecánico/Electromecánico", icon: "cog", isUrgency: false, sortOrder: 16 },
  { slug: "herreria", name: "Herrería", icon: "anvil", isUrgency: false, sortOrder: 17 },
  { slug: "pintura", name: "Pintura", icon: "paintbrush", isUrgency: false, sortOrder: 18 },
  { slug: "otros", name: "Otros", icon: "ellipsis", isUrgency: false, sortOrder: 99 },
] as const;
