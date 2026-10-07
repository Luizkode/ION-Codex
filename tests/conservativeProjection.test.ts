import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateConservativeProjection } from "../src/lib/conservativeProjection";
import { calculateProjection } from "../src/lib/projection";
import { demoValues, validate } from "../src/lib/validation";
const input = validate(demoValues).input;
test("resumo conservador aplica margem e mantém a projeção original intacta", () => {
  const result = calculateProjection(input),
    before = structuredClone(result);
  const conservative = calculateConservativeProjection(input, result);
  assert.equal(conservative.cpl, result.cpl.max * 1.25);
  assert.equal(conservative.opportunities, 103);
  assert.equal(conservative.customers, 30);
  assert.equal(conservative.revenue, 4500);
  assert.deepEqual(result, before);
});
test("receita conservadora respeita capacidade e investimento zero", () => {
  for (const spend of [0, 1000])
    for (const capacity of [0, 10, 60]) {
      const scenario = {
        ...input,
        monthlyAdSpend: spend,
        monthlyCapacity: capacity,
      };
      const conservative = calculateConservativeProjection(
        scenario,
        calculateProjection(scenario),
      );
      assert.ok(conservative.revenue <= capacity * input.averageTicket);
      if (spend === 0)
        assert.deepEqual(
          [
            conservative.opportunities,
            conservative.customers,
            conservative.revenue,
          ],
          [0, 0, 0],
        );
    }
});
