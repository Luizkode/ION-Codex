import {
  model,
  niches,
  segmentations,
  genderShares,
} from "@/config/benchmarks";
import type {
  ProjectionInput,
  ProjectionResult,
  Range,
} from "@/types/projection";
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
export function calculateAudience(i: ProjectionInput) {
  const coverage =
    (i.maxAge - i.minAge + 1) / (model.maxAge - model.minAge + 1);
  return clamp(
    Math.round(
      i.population *
        model.adultShare *
        coverage *
        genderShares[i.gender] *
        segmentations[i.segmentation].audienceFactor *
        niches[i.niche].audienceMultiplier,
    ),
    1,
    i.population,
  );
}
export function baseCpl(ticket: number) {
  const curve = model.cplCurve;
  for (let k = 1; k < curve.length; k++) {
    const [x, y] = curve[k],
      [px, py] = curve[k - 1];
    if (ticket <= x) return py + ((y - py) * (ticket - px)) / (x - px);
  }
  const [x, y] = curve[curve.length - 1];
  return y + model.highTicketSlope * Math.log1p((ticket - x) / x);
}
export function calculateCpl(i: ProjectionInput, audience: number) {
  return (
    baseCpl(i.averageTicket) *
    niches[i.niche].cplMultiplier *
    (1 +
      Math.min(i.competitors * model.competitionSlope, model.competitionCap)) *
    segmentations[i.segmentation].cplFactor *
    (1 +
      model.audiencePenalty *
        clamp(1 - audience / model.audienceReference, 0, 1))
  );
}
export const calculateImpressions = (spend: number, cpm: number) =>
  (spend / cpm) * 1000;
// Ocupação exponencial modela repetição de impressões e limita alcance ao público.
export const calculateReach = (audience: number, impressions: number) =>
  Math.min(
    audience,
    impressions,
    audience * -Math.expm1((-impressions / audience) * model.reachEfficiency),
  );
export const calculateFrequency = (impressions: number, reach: number) =>
  reach > 0 ? impressions / reach : 0;
export const calculateLeads = (spend: number, cpl: number) => spend / cpl;
export const calculatePotentialCustomers = (leads: number, rate: number) =>
  leads * rate;
export const calculateRevenue = (
  customers: number,
  capacity: number,
  ticket: number,
) => Math.min(customers, capacity) * ticket;
export const calculateCapacityUsage = (customers: number, capacity: number) =>
  capacity > 0 ? (customers / capacity) * 100 : 0;
export function calculateProjection(i: ProjectionInput): ProjectionResult {
  const nums = [
    i.averageTicket,
    i.monthlyAdSpend,
    i.population,
    i.minAge,
    i.maxAge,
    i.competitors,
    i.monthlyCapacity,
  ];
  if (
    nums.some((n) => !Number.isFinite(n)) ||
    i.averageTicket <= 0 ||
    i.monthlyAdSpend < 0 ||
    i.population < 1 ||
    i.population > model.maxPopulation ||
    i.averageTicket > model.maxMoney ||
    i.monthlyAdSpend > model.maxMoney ||
    i.minAge < model.minAge ||
    i.maxAge > model.maxAge ||
    i.minAge > i.maxAge ||
    i.competitors < 0 ||
    i.competitors > model.maxCount ||
    i.monthlyCapacity < 0 ||
    i.monthlyCapacity > model.maxCount ||
    !niches[i.niche] ||
    !segmentations[i.segmentation] ||
    !genderShares[i.gender]
  )
    throw new RangeError("Cenário inválido");
  const audience = calculateAudience(i),
    cpl = calculateCpl(i, audience),
    v =
      audience < model.restrictedAudience
        ? model.restrictedVariation
        : model.rangeVariation;
  const spread = (n: number): Range => ({ min: n * (1 - v), max: n * (1 + v) }),
    rounded = (r: Range): Range => ({
      min: Math.floor(r.min),
      max: Math.ceil(r.max),
    });
  const dailySpend = i.monthlyAdSpend / model.daysPerMonth,
    cpm =
      niches[i.niche].cpm *
      (1 +
        Math.min(
          i.competitors * model.competitionSlope,
          model.competitionCap,
        )) *
      segmentations[i.segmentation].cplFactor;
  const impressions = spread(
    calculateImpressions(dailySpend * model.projectionDays, cpm),
  );
  const reach = {
    min: calculateReach(audience, impressions.min),
    max: calculateReach(audience, impressions.max),
  };
  const frequency = {
    min: calculateFrequency(impressions.min, reach.min),
    max: calculateFrequency(impressions.max, reach.max),
  };
  const cplRange = spread(cpl),
    leads = {
      min: calculateLeads(i.monthlyAdSpend, cplRange.max),
      max: calculateLeads(i.monthlyAdSpend, cplRange.min),
    },
    rate = niches[i.niche].conversionRate;
  const customers = {
    min: Math.floor(calculatePotentialCustomers(leads.min, rate)),
    max: Math.ceil(calculatePotentialCustomers(leads.max, rate)),
  };
  const centralLeads = Math.round(i.monthlyAdSpend / cpl),
    centralCustomers = Math.round(centralLeads * rate),
    frequencyValue = calculateFrequency(
      calculateImpressions(dailySpend * model.projectionDays, cpm),
      calculateReach(
        audience,
        calculateImpressions(dailySpend * model.projectionDays, cpm),
      ),
    );
  const [low, healthy, high] = model.frequencyThresholds;
  const frequencyLabel =
    frequencyValue === 0
      ? "Sem exposição"
      : frequencyValue < low
        ? "Baixa exposição"
        : frequencyValue <= healthy
          ? "Faixa saudável"
          : frequencyValue <= high
            ? "Alta frequência"
            : "Possível saturação";
  const insight =
    i.monthlyAdSpend === 0
      ? "Informe um investimento maior que zero para projetar aquisição de clientes."
      : frequencyValue > high
        ? "O público está relativamente restrito para o investimento informado. Recomendamos ampliar a segmentação ou o raio de atuação."
        : centralCustomers > i.monthlyCapacity
          ? "A demanda projetada ultrapassa a capacidade atual da operação. O principal gargalo poderá deixar de ser aquisição e passar a ser atendimento."
          : "Seu investimento está bem dimensionado para o tamanho do público atual. Há espaço para gerar demanda sem saturar a audiência.";
  return {
    dailySpend,
    potentialAudience: audience,
    reach,
    impressions,
    frequency,
    cpl: cplRange,
    leads: rounded(leads),
    customers,
    revenue: {
      min: calculateRevenue(customers.min, i.monthlyCapacity, i.averageTicket),
      max: calculateRevenue(customers.max, i.monthlyCapacity, i.averageTicket),
    },
    centralLeads,
    centralCustomers,
    unlimitedRevenue: centralCustomers * i.averageTicket,
    capacityUsage: calculateCapacityUsage(centralCustomers, i.monthlyCapacity),
    demandAbsorption:
      centralCustomers > 0
        ? Math.min(i.monthlyCapacity / centralCustomers, 1) * 100
        : 100,
    frequencyValue,
    frequencyLabel,
    insight,
  };
}
