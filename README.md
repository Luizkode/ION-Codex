# ION Projection

Ferramenta de projeção comercial da Agência ION. Aplicação de página única, em português, sem backend, contas ou persistência de dados do prospect.

## Desenvolvimento

Node.js 24 e npm 11 (validados neste ambiente).

```sh
npm ci
npm run dev
```

A aplicação escuta na porta 3000. Para produção: `npm run build` e `npm start`.

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
```

Os testes de navegador usam Chromium em `/usr/bin/chromium`. Em outro sistema, adapte `executablePath` em `playwright.config.ts` ou utilize o Chromium instalado pelo Playwright.

## Modelo

- `src/config/benchmarks.ts`: todas as premissas, limites, curva de CPL, nichos, segmentações e taxas de conversão.
- `src/lib/projection.ts`: funções puras e determinísticas. Alcance e impressões usam sete dias; leads, clientes, capacidade e faturamento usam um mês de 30 dias.
- `src/lib/validation.ts`: limites explícitos e erros por campo. Ticket e população devem ser positivos; investimento e capacidade podem ser zero.
- `src/components`: formulário, resultado, fluxo comercial e capacidade.

As faixas representam cenários indicativos, não intervalos estatísticos de confiança. As premissas iniciais são hipóteses solicitadas para a simulação; precisam de calibração com dados reais da agência. Faturamento é receita bruta potencial, não lucro ou retorno garantido. Frequência é impressões divididas pelo alcance de cada cenário de sete dias. Capacidade zero aparece explicitamente como indisponível, evitando uma razão indefinida.

O formulário começa vazio. “Usar exemplo” preenche o cenário Barbearia Prime. O resultado permanece vinculado ao cenário calculado até que o usuário recalcule. Editar preserva os campos; nova projeção limpa os dados; apresentar oculta o formulário.

## Identidade

A logo oficial e o screenshot citados no briefing não estavam anexados. O cabeçalho usa identificação textual provisória e o roxo de fallback `#7C2AE8`. Substituir pela logo oficial fornecida, mantendo proporções e texto alternativo, quando ela estiver disponível. Inter é servida localmente, sem chamadas a Google Fonts.

## Privacidade e acessibilidade

Sem APIs externas, analytics ou armazenamento de dados. Labels, mensagens vinculadas aos campos, foco visível, navegação por teclado e preferência por movimento reduzido são suportados.

## Validação realizada

- Instalação reproduzida com `npm ci` e build de produção concluído.
- TypeScript e ESLint sem erros.
- 6 testes do modelo: cenário de referência, continuidade da curva, 64 combinações de extremos, limites de alcance/receita, validações e determinismo.
- 8 testes de navegador no servidor de produção: edição, reset, apresentação, formatação, todos os controles e layouts de 390, 768, 1366, 1440 e 1920 px.
- Revisão visual desktop/mobile e cálculo sem erros de execução no navegador.

Cenário Barbearia Prime: aproximadamente 140 leads/mês, CPL R$ 6,55–R$ 7,69, 38–46 clientes potenciais e R$ 5.700–R$ 6.900 de faturamento mensal potencial. Valores estimados, sujeitos às premissas configuráveis.
