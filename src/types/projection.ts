export type Niche =
  | "barbearia"
  | "estetica"
  | "salao"
  | "vidracaria"
  | "assistencia"
  | "higienizacao"
  | "paisagismo"
  | "imobiliaria"
  | "escola"
  | "outro";
export type Gender = "todos" | "masculino" | "feminino";
export type Segmentation =
  "aberta" | "demografica" | "interesses" | "posicionamentos" | "completa";
export interface ProjectionInput {
  niche: Niche;
  companyName: string;
  city: string;
  averageTicket: number;
  monthlyAdSpend: number;
  population: number;
  minAge: number;
  maxAge: number;
  gender: Gender;
  segmentation: Segmentation;
  competitors: number;
  monthlyCapacity: number;
}
export interface Range {
  min: number;
  max: number;
}
export interface ProjectionResult {
  dailySpend: number;
  potentialAudience: number;
  reach: Range;
  impressions: Range;
  frequency: Range;
  cpl: Range;
  leads: Range;
  customers: Range;
  revenue: Range;
  centralLeads: number;
  centralCustomers: number;
  unlimitedRevenue: number;
  capacityUsage: number;
  demandAbsorption: number;
  frequencyValue: number;
  frequencyLabel: string;
  insight: string;
}
export type FormValues = { [K in keyof ProjectionInput]: string };
export type FormErrors = Partial<Record<keyof ProjectionInput, string>>;
