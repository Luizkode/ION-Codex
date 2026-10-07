"use client";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { niches, segmentations } from "@/config/benchmarks";
import { money, number, parseLocalized } from "@/lib/formatters";
import type {
  FormValues,
  FormErrors,
  ProjectionInput,
} from "@/types/projection";
interface Props {
  values: FormValues;
  errors: FormErrors;
  onChange: (key: keyof ProjectionInput, value: string) => void;
  onSubmit: () => void;
  onDemo: () => void;
}
export function CurrencyInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  invalid: boolean;
  describedBy?: string;
}) {
  return (
    <div className="currency-input">
      <span>R$</span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        inputMode="decimal"
        placeholder="0,00"
        aria-invalid={invalid}
        aria-describedby={describedBy}
      />
    </div>
  );
}
export function ScenarioForm({
  values,
  errors,
  onChange,
  onSubmit,
  onDemo,
}: Props) {
  function field(
    key: keyof ProjectionInput,
    label: string,
    kind = "text",
    placeholder = "",
  ) {
    const error = errors[key],
      monetary = kind === "money";
    return (
      <div className={`field ${error ? "has-error" : ""}`}>
        <label htmlFor={key}>{label}</label>
        {monetary ? (
          <CurrencyInput
            id={key}
            value={values[key]}
            onChange={(v) => onChange(key, v)}
            onBlur={() => {
              const n = parseLocalized(values[key]);
              if (values[key] && Number.isFinite(n) && n >= 0)
                onChange(key, money(n).replace(/R\$\s*/, ""));
            }}
            invalid={!!error}
            describedBy={error ? `${key}-error` : undefined}
          />
        ) : (
          <input
            id={key}
            value={values[key]}
            placeholder={placeholder}
            inputMode={kind === "number" ? "numeric" : undefined}
            maxLength={kind === "text" ? 100 : 20}
            onChange={(e) => onChange(key, e.target.value)}
            onBlur={() => {
              if (kind === "number" && key === "population") {
                const n = parseLocalized(values[key]);
                if (values[key] && Number.isFinite(n)) onChange(key, number(n));
              }
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${key}-error` : undefined}
          />
        )}{" "}
        {error && (
          <span className="error" id={`${key}-error`}>
            {error}
          </span>
        )}
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <div className="section-heading">
        <span className="step">01</span>
        <div>
          <h2>Conheça a operação</h2>
          <p>O ponto de partida para uma boa estratégia.</p>
        </div>
        <button type="button" className="demo-button" onClick={onDemo}>
          <Sparkles size={14} /> Usar exemplo
        </button>
      </div>
      <div className="identity-grid">
        <div className="field">
          <label htmlFor="niche">Nicho de atuação</label>
          <select
            id="niche"
            value={values.niche}
            onChange={(e) => onChange("niche", e.target.value)}
          >
            {Object.entries(niches).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {field(
          "companyName",
          "Nome da empresa",
          "text",
          "Ex.: Barbearia Prime",
        )}
        {field("city", "Cidade", "text", "Ex.: Sorocaba - SP")}
      </div>
      <div className="section-heading scenario-heading">
        <span className="step">02</span>
        <div>
          <h2>Cenário atual</h2>
          <p>Poucos dados. Uma visão clara do potencial.</p>
        </div>
      </div>
      <div className="scenario-grid">
        {field("averageTicket", "Ticket médio", "money")}
        {field("monthlyAdSpend", "Investimento mensal em anúncios", "money")}
        {field("population", "Habitantes da cidade", "number", "Ex.: 250.000")}
        {field(
          "monthlyCapacity",
          "Novos clientes que consegue atender / mês",
          "number",
          "Ex.: 60",
        )}
        <fieldset className="age-field">
          <legend>Faixa etária</legend>
          <div>
            {field("minAge", "Idade mínima", "number")}
            <span className="age-dash">—</span>
            {field("maxAge", "Idade máxima", "number")}
          </div>
        </fieldset>
        <fieldset className="gender-field">
          <legend>Gênero</legend>
          <div className="segmented">
            {[
              ["todos", "Todos"],
              ["masculino", "Masculino"],
              ["feminino", "Feminino"],
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                aria-pressed={values.gender === key}
                onClick={() => onChange("gender", key)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="segmentation">Segmentação</label>
          <select
            id="segmentation"
            value={values.segmentation}
            onChange={(e) => onChange("segmentation", e.target.value)}
          >
            {Object.entries(segmentations).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {field(
          "competitors",
          "Concorrentes diretos próximos",
          "number",
          "Ex.: 8",
        )}
      </div>
      <div className="form-bottom">
        <p>
          Uma projeção para orientar a conversa.
          <br />
          <strong>A estratégia começa com o cenário.</strong>
        </p>
        <button className="primary" type="submit">
          Calcular projeção <ArrowUpRight size={20} />
        </button>
      </div>
    </form>
  );
}
