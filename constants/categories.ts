export const CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Hogar",
  "Ropa",
  "Servicios",
  "Otros"
] as const;

export type CategoryType = typeof CATEGORIES[number];