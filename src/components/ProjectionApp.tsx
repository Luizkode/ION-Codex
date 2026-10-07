"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { flushSync } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { ScenarioForm } from "./ScenarioForm";
import { EmptyProjection, ProjectionSummary } from "./ProjectionSummary";
import { demoValues, emptyValues, validate } from "@/lib/validation";
import { calculateProjection } from "@/lib/projection";
import type {
  FormErrors,
  FormValues,
  ProjectionInput,
  ProjectionResult,
} from "@/types/projection";
export function CompanyHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ION Projection, início">
        <span className="brand-name">
          ION<span className="brand-period">.</span>
        </span>
        <span className="brand-divider" />
        <span className="brand-product">PROJECTION</span>
      </Link>
      <span className="header-note">
        <span /> Inteligência que move negócios
      </span>
    </header>
  );
}
export default function ProjectionApp() {
  const [values, setValues] = useState<FormValues>({ ...emptyValues }),
    [errors, setErrors] = useState<FormErrors>({}),
    [projection, setProjection] = useState<{
      input: ProjectionInput;
      result: ProjectionResult;
    } | null>(null),
    [presenting, setPresenting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const scrollForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("companyName")?.focus({ preventScroll: true });
  };
  function calculate() {
    const { input, errors: nextErrors } = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    flushSync(() =>
      setProjection({ input, result: calculateProjection(input) }),
    );
    {
      const el = document.getElementById("projection");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      el?.focus({ preventScroll: true });
    }
  }
  return (
    <>
      <CompanyHeader />
      <main className={presenting ? "presenting" : ""}>
        <div className="intro">
          <div>
            <span className="eyebrow">ION // INTELIGÊNCIA DE MÍDIA</span>
            <h1>
              O próximo movimento
              <br />
              do seu negócio<span>.</span>
            </h1>
            <p>
              Uma visão estratégica do que a mídia pode fazer pela sua operação.
            </p>
          </div>
          <div className="intro-side">
            <span className="outline-arrow">
              <ArrowUpRight size={30} />
            </span>
            <p>
              Menos suposições.
              <br />
              <strong>Mais possibilidades.</strong>
            </p>
          </div>
        </div>
        <div className="form-panel" ref={formRef}>
          <ScenarioForm
            values={values}
            errors={errors}
            onChange={(key, value) => {
              setValues((v) => ({ ...v, [key]: value }));
              setErrors((e) => ({ ...e, [key]: undefined }));
            }}
            onSubmit={calculate}
            onDemo={() => {
              setValues({ ...demoValues });
              setErrors({});
            }}
          />
        </div>
        {projection ? (
          <ProjectionSummary
            {...projection}
            presenting={presenting}
            onEdit={() => {
              flushSync(() => setPresenting(false));
              scrollForm();
            }}
            onReset={() => {
              flushSync(() => {
                setValues({ ...emptyValues });
                setErrors({});
                setProjection(null);
                setPresenting(false);
              });
              scrollForm();
            }}
            onPresent={() => {
              flushSync(() => setPresenting((v) => !v));
              document
                .getElementById("projection")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ) : (
          <EmptyProjection />
        )}
        <footer>
          <span>ION // PROJECTION</span>
          <span>Estratégia antes do investimento.</span>
          <span>Uso interno · Agência ION</span>
        </footer>
      </main>
    </>
  );
}
