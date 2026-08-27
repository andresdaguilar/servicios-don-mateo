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

export const HOME_PROMPTS = [
  "¿Qué estás buscando hoy?",
  "¿Qué necesitás resolver hoy?",
  "¿A quién necesitás encontrar?",
  "¿Qué servicio necesitás?",
  "¿Qué contacto estás buscando?",
  "¿Con qué te damos una mano?",
  "¿Qué necesitás en el barrio?",
  "¿Qué estás necesitando?",
  "¿A quién querés llamar?",
  "¿Qué querés solucionar?",
  "¿Buscás algún servicio?",
  "¿Qué recomendación necesitás?",
  "¿Qué rubro estás buscando?",
  "¿Qué contacto te vendría bien?",
  "¿Qué necesitás encontrar rápido?",
  "¿Hay algo que resolver en casa?",
  "¿Buscás alguien recomendado?",
  "¿Qué oficio estás buscando?",
  "¿Qué necesitás consultar?",
  "¿Qué se te rompió hoy?",
] as const;

export const CATEGORY_SEED = [
  { slug: "administracion", name: "Administración", icon: "building-2", isUrgency: true, sortOrder: 1 },
  { slug: "albanileria", name: "Albañilería", icon: "brick-wall", isUrgency: false, sortOrder: 2 },
  { slug: "bicicletas", name: "Bicicletas", icon: "bike", isUrgency: false, sortOrder: 3 },
  { slug: "cerrajeria", name: "Cerrajería", icon: "key-round", isUrgency: true, sortOrder: 4 },
  { slug: "clases", name: "Clases", icon: "graduation-cap", isUrgency: false, sortOrder: 5 },
  { slug: "construccion", name: "Construcción", icon: "hammer", isUrgency: false, sortOrder: 6 },
  { slug: "electricidad", name: "Electricidad", icon: "zap", isUrgency: true, sortOrder: 7 },
  { slug: "salud", name: "Emergencias médicas", icon: "cross", isUrgency: true, sortOrder: 8 },
  { slug: "gas", name: "Gas", icon: "flame", isUrgency: true, sortOrder: 9 },
  { slug: "herreria", name: "Herrería", icon: "anvil", isUrgency: false, sortOrder: 10 },
  { slug: "jardineria", name: "Jardinería", icon: "flower-2", isUrgency: false, sortOrder: 11 },
  { slug: "limpieza", name: "Limpieza", icon: "sparkles", isUrgency: false, sortOrder: 12 },
  { slug: "mascotas", name: "Mascotas", icon: "paw-print", isUrgency: true, sortOrder: 13 },
  { slug: "mecanico", name: "Mecánico/Electromecánico", icon: "cog", isUrgency: false, sortOrder: 14 },
  { slug: "otros", name: "Otros", icon: "ellipsis", isUrgency: false, sortOrder: 15 },
  { slug: "pintura", name: "Pintura", icon: "paintbrush", isUrgency: false, sortOrder: 16 },
  { slug: "plomeria", name: "Plomería", icon: "wrench", isUrgency: true, sortOrder: 17 },
  { slug: "portones", name: "Portones", icon: "fence", isUrgency: false, sortOrder: 18 },
  { slug: "seguridad", name: "Seguridad", icon: "shield", isUrgency: true, sortOrder: 19 },
  { slug: "service-electro", name: "Service Electro", icon: "refrigerator", isUrgency: false, sortOrder: 20 },
  { slug: "transporte", name: "Transporte", icon: "car", isUrgency: false, sortOrder: 21 },
  { slug: "verduleria", name: "Verdulería", icon: "carrot", isUrgency: false, sortOrder: 22 },
  { slug: "veterinaria", name: "Veterinaria", icon: "heart-pulse", isUrgency: true, sortOrder: 23 },
] as const;
