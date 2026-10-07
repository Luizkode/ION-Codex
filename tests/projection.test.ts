import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateProjection, baseCpl } from "../src/lib/projection";
import { validate, demoValues, emptyValues } from "../src/lib/validation";
const input = validate(demoValues).input;
test("cenário ION de referência tem CPL de 6–8 e projeção determinística", () => {
  const r = calculateProjection(input);
  assert.ok(r.cpl.min >= 6 && r.cpl.max <= 8);
  assert.deepEqual(r, calculateProjection({ ...input }));
  assert.ok(r.centralCustomers > 35 && r.centralCustomers < 50);
});
test("CPL é contínuo nos limites da curva", () => {
  for (const t of [80, 150, 300, 600, 1000, 2500, 10000])
    assert.ok(Math.abs(baseCpl(t - 0.001) - baseCpl(t + 0.001)) < 0.001);
});
test("extremos preservam finitude, alcance e capacidade", () => {
  for (const population of [1, 100, 723000, 1e9])
    for (const spend of [0, 1, 1000, 1e8])
      for (const capacity of [0, 1, 60, 1e7]) {
        const r = calculateProjection({
          ...input,
          population,
          monthlyAdSpend: spend,
          monthlyCapacity: capacity,
          averageTicket: 1e8,
        });
        for (const value of Object.values(r)) {
          if (typeof value === "number")
            assert.ok(Number.isFinite(value) && value >= 0);
          else if (typeof value === "object")
            for (const n of Object.values(value))
              assert.ok(typeof n === "number" && Number.isFinite(n) && n >= 0);
        }
        assert.ok(r.reach.max <= r.potentialAudience);
        assert.ok(
          r.reach.min <= r.impressions.min && r.reach.max <= r.impressions.max,
        );
        assert.ok(r.revenue.max <= capacity * 1e8);
        assert.ok(r.leads.min <= r.leads.max);
      }
});
test("saturação e limite operacional acionam os insights", () => {
  assert.match(
    calculateProjection({ ...input, population: 100 }).insight,
    /restrito/,
  );
  const r = calculateProjection({ ...input, monthlyCapacity: 30 });
  assert.match(r.insight, /capacidade/);
  assert.ok(r.demandAbsorption < 100);
  assert.equal(r.revenue.max, 4500);
});
test("validação identifica campos inválidos e aceita investimento zero", () => {
  assert.ok(Object.keys(validate(emptyValues).errors).length > 0);
  for (const key of [
    "averageTicket",
    "monthlyAdSpend",
    "population",
    "competitors",
    "monthlyCapacity",
  ] as const)
    assert.ok(validate({ ...demoValues, [key]: "-1" }).errors[key]);
  assert.ok(validate({ ...demoValues, minAge: "17" }).errors.minAge);
  assert.ok(
    validate({ ...demoValues, minAge: "45", maxAge: "20" }).errors.maxAge,
  );
  assert.ok(validate({ ...demoValues, population: "1,5" }).errors.population);
  assert.deepEqual(
    validate({ ...demoValues, monthlyAdSpend: "0", monthlyCapacity: "0" })
      .errors,
    {},
  );
  assert.equal(
    calculateProjection({ ...input, monthlyAdSpend: 0 }).centralLeads,
    0,
  );
});
test("função pura rejeita entradas não finitas", () => {
  assert.throws(
    () => calculateProjection({ ...input, population: Infinity }),
    RangeError,
  );
  assert.throws(
    () => calculateProjection({ ...input, monthlyAdSpend: NaN }),
    RangeError,
  );
});
