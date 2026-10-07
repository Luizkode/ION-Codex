import {
  model,
  niches,
  segmentations,
  genderShares,
} from "@/config/benchmarks";
import { parseLocalized } from "./formatters";
import type {
  FormErrors,
  FormValues,
  ProjectionInput,
} from "@/types/projection";
export const emptyValues: FormValues = {
  niche: "barbearia",
  companyName: "",
  city: "",
  averageTicket: "",
  monthlyAdSpend: "",
  population: "",
  minAge: "18",
  maxAge: "65",
  gender: "todos",
  segmentation: "aberta",
  competitors: "",
  monthlyCapacity: "",
};
export const demoValues: FormValues = {
  niche: "barbearia",
  companyName: "Barbearia Prime",
  city: "Sorocaba - SP",
  averageTicket: "150,00",
  monthlyAdSpend: "1.000,00",
  population: "723.000",
  minAge: "20",
  maxAge: "45",
  gender: "masculino",
  segmentation: "interesses",
  competitors: "8",
  monthlyCapacity: "60",
};
export function validate(values: FormValues): {
  input: ProjectionInput;
  errors: FormErrors;
} {
  const errors: FormErrors = {};
  const input = { ...values } as unknown as ProjectionInput;
  for (const key of ["companyName", "city"] as const) {
    input[key] = values[key].trim();
    if (!input[key]) errors[key] = "Preencha este campo.";
    else if (input[key].length > 100) errors[key] = "Use até 100 caracteres.";
  }
  const limits = {
    averageTicket: [0.01, model.maxMoney],
    monthlyAdSpend: [0, model.maxMoney],
    population: [1, model.maxPopulation],
    minAge: [model.minAge, model.maxAge],
    maxAge: [model.minAge, model.maxAge],
    competitors: [0, model.maxCount],
    monthlyCapacity: [0, model.maxCount],
  };
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const n = parseLocalized(values[key]);
    input[key] = n;
    const [min, max] = limits[key];
    if (!values[key].trim() || !Number.isFinite(n))
      errors[key] = "Informe um número válido.";
    else if (n < min || n > max)
      errors[key] =
        `Informe entre ${min.toLocaleString("pt-BR")} e ${max.toLocaleString("pt-BR")}.`;
    else if (
      !["averageTicket", "monthlyAdSpend"].includes(key) &&
      !Number.isInteger(n)
    )
      errors[key] = "Informe um número inteiro.";
  }
  if (input.maxAge < input.minAge)
    errors.maxAge = "A idade máxima deve ser igual ou maior que a mínima.";
  if (!(values.niche in niches)) errors.niche = "Selecione um nicho válido.";
  if (!(values.gender in genderShares))
    errors.gender = "Selecione um gênero válido.";
  if (!(values.segmentation in segmentations))
    errors.segmentation = "Selecione uma segmentação válida.";
  return { input, errors };
}
