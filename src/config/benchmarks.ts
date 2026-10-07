import type { Niche, Segmentation, Gender } from "@/types/projection";
// Premissas iniciais de simulação; calibrar com dados observados da ION.
export const niches: Record<
  Niche,
  {
    label: string;
    cpm: number;
    cplMultiplier: number;
    conversionRate: number;
    audienceMultiplier: number;
  }
> = {
  barbearia: {
    label: "Barbearia",
    cpm: 16,
    cplMultiplier: 1,
    conversionRate: 0.3,
    audienceMultiplier: 1,
  },
  estetica: {
    label: "Clínica de estética",
    cpm: 20,
    cplMultiplier: 1.08,
    conversionRate: 0.2,
    audienceMultiplier: 0.95,
  },
  salao: {
    label: "Salão de beleza",
    cpm: 16.5,
    cplMultiplier: 1,
    conversionRate: 0.25,
    audienceMultiplier: 1,
  },
  vidracaria: {
    label: "Vidraçaria",
    cpm: 19,
    cplMultiplier: 1.1,
    conversionRate: 0.12,
    audienceMultiplier: 0.9,
  },
  assistencia: {
    label: "Assistência técnica",
    cpm: 15.5,
    cplMultiplier: 0.95,
    conversionRate: 0.25,
    audienceMultiplier: 1,
  },
  higienizacao: {
    label: "Higienização de estofados",
    cpm: 17,
    cplMultiplier: 1,
    conversionRate: 0.2,
    audienceMultiplier: 0.95,
  },
  paisagismo: {
    label: "Paisagismo",
    cpm: 21.5,
    cplMultiplier: 1.12,
    conversionRate: 0.1,
    audienceMultiplier: 0.85,
  },
  imobiliaria: {
    label: "Imobiliária",
    cpm: 25,
    cplMultiplier: 1.2,
    conversionRate: 0.04,
    audienceMultiplier: 0.8,
  },
  escola: {
    label: "Escola",
    cpm: 22,
    cplMultiplier: 1.08,
    conversionRate: 0.12,
    audienceMultiplier: 0.9,
  },
  outro: {
    label: "Outro",
    cpm: 21,
    cplMultiplier: 1.05,
    conversionRate: 0.15,
    audienceMultiplier: 1,
  },
};
export const segmentations: Record<
  Segmentation,
  { label: string; cplFactor: number; audienceFactor: number }
> = {
  aberta: { label: "Aberta", cplFactor: 1, audienceFactor: 1 },
  demografica: { label: "Gênero + idade", cplFactor: 1.03, audienceFactor: 1 },
  interesses: { label: "Interesses", cplFactor: 1.06, audienceFactor: 0.8 },
  posicionamentos: {
    label: "Posicionamentos",
    cplFactor: 1.02,
    audienceFactor: 0.9,
  },
  completa: { label: "Completa", cplFactor: 1.1, audienceFactor: 0.65 },
};
export const genderShares: Record<Gender, number> = {
  todos: 1,
  masculino: 0.49,
  feminino: 0.51,
};
export const model = {
  daysPerMonth: 30,
  projectionDays: 7,
  minAge: 18,
  maxAge: 65,
  adultShare: 0.72,
  competitionSlope: 0.015,
  competitionCap: 0.3,
  audienceReference: 20000,
  audiencePenalty: 0.12,
  reachEfficiency: 0.82,
  rangeVariation: 0.08,
  restrictedVariation: 0.1,
  restrictedAudience: 10000,
  maxMoney: 1e8,
  maxPopulation: 1e9,
  maxCount: 1e7,
  frequencyThresholds: [1.5, 3.5, 5],
  cplCurve: [
    [0, 4],
    [80, 4.8],
    [150, 6],
    [300, 8.5],
    [600, 11.5],
    [1000, 15],
    [2500, 24],
    [10000, 45],
  ] as readonly (readonly [number, number])[],
  highTicketSlope: 8,
};

// Margem adicional aplicada exclusivamente ao resumo conservador.
export const conservativeCplMultiplier = 1.25;
