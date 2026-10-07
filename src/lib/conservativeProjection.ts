import { conservativeCplMultiplier, niches } from "@/config/benchmarks";
import {
  calculateLeads,
  calculatePotentialCustomers,
  calculateRevenue,
} from "./projection";
import type { ProjectionInput, ProjectionResult } from "@/types/projection";

export function calculateConservativeProjection(
  input: ProjectionInput,
  result: ProjectionResult,
) {
  const cpl = result.cpl.max * conservativeCplMultiplier;
  const opportunities = Math.floor(calculateLeads(input.monthlyAdSpend, cpl));
  const customers = Math.floor(
    calculatePotentialCustomers(
      opportunities,
      niches[input.niche].conversionRate,
    ),
  );
  const revenue = calculateRevenue(
    customers,
    input.monthlyCapacity,
    input.averageTicket,
  );
  return { cpl, opportunities, customers, revenue };
}
