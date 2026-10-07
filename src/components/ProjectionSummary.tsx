"use client";
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesColumnIncreasing,
  Check,
  Maximize2,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { money, number, range } from "@/lib/formatters";
import type { ProjectionInput, ProjectionResult } from "@/types/projection";
export function Disclaimer() {
  return (
    <p className="disclaimer">
      As projeções são estimativas baseadas no cenário informado, benchmarks
      internos e premissas de mídia. Resultados reais podem variar conforme
      oferta, criativos, sazonalidade, atendimento e comportamento do mercado.
    </p>
  );
}
export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function CapacityIndicator({
  input,
  result,
}: {
  input: ProjectionInput;
  result: ProjectionResult;
}) {
  const over = result.centralCustomers > input.monthlyCapacity,
    zero = input.monthlyCapacity === 0;
  return (
    <div className="capacity">
      <div className="capacity-title">
        <h3>Capacidade da operação</h3>
        <span>
          {zero
            ? "Sem capacidade disponível"
            : `${number(result.capacityUsage, 1)}% de utilização estimada`}
        </span>
      </div>
      <div className="capacity-track">
        <div style={{ width: `${Math.min(result.capacityUsage, 100)}%` }} />
      </div>
      <div className="capacity-numbers">
        <span>
          <strong>{number(input.monthlyCapacity)}</strong> clientes disponíveis
          / mês
        </span>
        <span>
          <strong>~{number(result.centralCustomers)}</strong> clientes
          projetados
        </span>
      </div>
      {over ? (
        <p className="capacity-note">
          <ArrowUpRight size={16} /> Existe demanda estimada acima da capacidade
          atual.
          <br />
          Sua estrutura absorveria aproximadamente{" "}
          {number(result.demandAbsorption, 1)}% da demanda projetada.
        </p>
      ) : (
        <p className="capacity-note">
          <Check size={16} /> Sua capacidade comporta a demanda estimada.
        </p>
      )}
    </div>
  );
}
export function ProjectionFlow({
  input,
  result,
}: {
  input: ProjectionInput;
  result: ProjectionResult;
}) {
  const items = [
    ["Investimento mensal", money(input.monthlyAdSpend)],
    ["CPL", money(result.cpl.max)],
    ["Oportunidades por mês", number(result.leads.min)],
    ["Clientes potenciais", number(result.customers.min)],
    ["Faturamento", money(result.revenue.min)],
  ];
  return (
    <div className="flow">
      <div className="flow-title flow-step">
        <span>Projeção conservadora</span>
      </div>
      {items.map(([label, value], index) => (
        <div className="flow-step" key={label}>
          <span>
            {String(index + 1).padStart(2, "0")} / {label}
          </span>
          <strong>{value}</strong>
          {index < items.length - 1 && <ArrowRight size={16} />}
        </div>
      ))}
    </div>
  );
}
export function ProjectionSummary({
  input,
  result,
  onEdit,
  onReset,
  presenting,
  onPresent,
}: {
  input: ProjectionInput;
  result: ProjectionResult;
  onEdit: () => void;
  onReset: () => void;
  presenting: boolean;
  onPresent: () => void;
}) {
  return (
    <section
      id="projection"
      className="projection"
      tabIndex={-1}
      aria-label="Resultado da projeção"
    >
      <div className="result-top">
        <span className="eyebrow">
          <span className="purple-dot" /> PROJEÇÃO ION
        </span>
        <div className="result-actions">
          <button type="button" onClick={onEdit}>
            <Pencil size={15} /> Editar cenário
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={15} /> Nova projeção
          </button>
          <button type="button" onClick={onPresent}>
            <Maximize2 size={15} />
            {presenting ? "Sair da apresentação" : "Apresentar"}
          </button>
        </div>
      </div>
      <p className="company-name">
        {input.companyName} <span>•</span> {input.city}
      </p>
      <h2>Potencial estimado da operação</h2>
      <div className="result-hero">
        <div className="lead-hero">
          <span className="lead-number">~{number(result.centralLeads)}</span>
          <h3>oportunidades por mês</h3>
          <p>Faixa estimada de {range(result.leads)} leads</p>
        </div>
        <div className="hero-metrics">
          <MetricCard
            label="CPL projetado"
            value={range(result.cpl, money)}
            detail="por oportunidade gerada"
          />
          <MetricCard
            label="Novos clientes potenciais"
            value={range(result.customers)}
            detail="demanda estimada por mês"
          />
          <MetricCard
            label="Faturamento potencial"
            value={range(result.revenue, money)}
            detail="por mês, respeitando sua capacidade"
          />
        </div>
      </div>
      <div className="media-metrics">
        <MetricCard
          label="Investimento diário"
          value={money(result.dailySpend)}
        />
        <MetricCard
          label="Público potencial"
          value={number(result.potentialAudience)}
          detail="pessoas na audiência estimada"
        />
        <MetricCard
          label="Alcance em 7 dias"
          value={range(result.reach, (n) => number(n))}
        />
        <MetricCard
          label="Impressões em 7 dias"
          value={range(result.impressions, (n) => number(n))}
        />
        <MetricCard
          label="Frequência em 7 dias"
          value={range(result.frequency, (n) => `${number(n, 1)}x`)}
          detail={result.frequencyLabel}
        />
      </div>
      <ProjectionFlow input={input} result={result} />
      <div className="result-bottom">
        <CapacityIndicator input={input} result={result} />
        <div className="insight">
          <span className="eyebrow">
            <Sparkles size={15} /> LEITURA DO CENÁRIO
          </span>
          <p>{result.insight}</p>
          {result.centralCustomers > input.monthlyCapacity && (
            <small>
              Potencial sem limitação de capacidade:{" "}
              <strong>{money(result.unlimitedRevenue)}/mês</strong>
            </small>
          )}
        </div>
      </div>
      <Disclaimer />
    </section>
  );
}
export function EmptyProjection() {
  return (
    <aside className="empty-projection">
      <div className="empty-icon">
        <ChartNoAxesColumnIncreasing size={25} />
      </div>
      <div>
        <span className="eyebrow">DE DADOS A POSSIBILIDADES</span>
        <h3>
          Transforme dados básicos em
          <br />
          uma projeção comercial.
        </h3>
        <p>
          Preencha o cenário da empresa para visualizar
          <br />o potencial estimado da operação.
        </p>
      </div>
      <div className="empty-path">
        <span>Investimento</span>
        <ArrowRight size={14} />
        <span>Oportunidades</span>
        <ArrowRight size={14} />
        <span>Crescimento</span>
      </div>
    </aside>
  );
}
