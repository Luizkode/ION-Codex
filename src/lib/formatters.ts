import type { Range } from "@/types/projection";
export const number = (n: number, digits = 0) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(n);
export const money = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );
export const range = (r: Range, format: (n: number) => string = number) =>
  `${format(r.min)} – ${format(r.max)}`;
export const parseLocalized = (value: string) =>
  Number(value.replace(/\./g, "").replace(",", "."));
