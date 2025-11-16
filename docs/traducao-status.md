# Cobertura de tradução (pt-BR)

Todo o front-end é apresentado em português brasileiro. Este documento explica onde vivem os textos e como manter a localização consistente.

## Escopo coberto atualmente
- **Layout global**: cabeçalho, rodapé, breadcrumb, buscador e hero usam as entradas de `src/locales/pt-BR/common.json`.
- **Ferramentas**: cada `toolId` possui um bloco em `src/locales/pt-BR/tools.json` com título, descrição, labels de formulários, abas, tooltips e mensagens de resultado.
- **Alertas/Loaders**: `src/locales/pt-BR/alerts.json` contém todos os textos exibidos por `loaderService`, `alertService` e handlers de erro das lógicas.
- **Páginas auxiliares** (`/bookmark`, `/multi-tool`, `/pdf-to-json`, `/json-to-pdf`, `/table-of-contents`): usam os mesmos arquivos de tradução, inclusive quando injetam HTML legacy.
- **Documentação de onboarding**: README permanece em inglês; os guias internos (esta pasta) estão em português.

## Como garantir que novas features estejam traduzidas
1. Antes de codar, defina as chaves necessárias no JSON correspondente (de preferência sob `templates.<toolId>` ou `common.*`).
2. Utilize `useTranslation()` nos componentes React e `t()` diretamente nos módulos TS. Nunca deixe strings literais visíveis ao usuário fora dos arquivos de tradução.
3. Quando adicionar novas mensagens de lógica (alertas, loaders), atualize `alerts.json` e referencie as chaves nos helpers.
4. Revise visualmente a tela após a mudança; textos ricos (`dangerouslySetInnerHTML`) devem ser checados para garantir que o HTML esteja fechado corretamente.

## Auditoria rápida
- Rode `rg "text-" src/react/components/tools -g"*.tsx"` para verificar strings literais restantes.
- Execute `npm run test`/`npm run build` para ter certeza de que o i18n inicializa sem chaves faltantes.
- Periodicamente, valide os JSONs com um script simples (por exemplo, `node scripts/validate-locales.mjs`) para garantir que não haja chaves vazias ou duplicadas.

Seguindo estes passos, mantemos o idioma consistente em todo o produto e evitamos regressões introduzidas por textos hardcoded.
