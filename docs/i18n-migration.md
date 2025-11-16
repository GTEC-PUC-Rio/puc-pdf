# Guia de internacionalização

A tradução é centralizada no `i18next`. Mesmo atendendo apenas pt-BR, mantemos o catálogo organizado para permitir ajustes rápidos e futura expansão para outros idiomas. Este documento descreve como a infraestrutura atual funciona e como adicionar novas strings.

## Componentes principais
- `src/i18n/index.ts`: inicializa o `i18next`, registra os namespaces carregados e exporta o helper `initI18n()` (para scripts vanilla) e o `I18nextProvider` usado no React.
- `src/locales/pt-BR/` contém os arquivos JSON separados por domínio:
  - `common.json`: cabeçalho, rodapé, breadcrumb, mensagens genéricas e CTAs compartilhados.
  - `alerts.json`: loaders, toasts e mensagens de erro/sucesso mostradas pelos serviços globais.
  - `tools.json`: títulos, descrições e labels de todas as ferramentas. Cada `toolId` possui o bloco `templates.<id>` com subtabs, placeholders etc.
- `src/js/utils/layout-translations.ts`: aplica as traduções globais aos pontos onde ainda existe HTML estático (por exemplo, quando o `PdfMultiToolPage` injeta trechos legados).

## Uso no React
- `src/react/main.tsx` chama `initI18n()` antes de renderizar o app e envolve todo o router com `I18nextProvider`.
- Componentes funcionais usam `const { t } = useTranslation('<namespace>')`. Para strings que aparecem em diversos pontos, prefira `common` ou `alerts`. Ferramentas usam a seção `tools`.
- Sempre defina fallbacks para `dangerouslySetInnerHTML` usando `?? ''` e prefira interpolação (`t('foo', { value })`) a concatenações manuais.

## Uso fora do React
- Scripts de lógica (`src/js/logic/*`) importam `t` diretamente de `src/i18n/index.ts`. Garanta que `initI18n()` seja chamado uma vez no bootstrap (já feito em `main.tsx`).
- Quando uma lógica roda em Web Worker e não recebe `t`, passe as mensagens via parâmetros ou mantenha as strings no thread principal.

## Como adicionar ou alterar traduções
1. Identifique o namespace adequado. Ferramentas sempre entram em `tools.json` dentro de `templates.<toolId>`.
2. Adicione a chave/valor em JSON seguindo o padrão existente (use frases completas e mantenha placeholders HTML explícitos, ex.: `<strong>`).
3. Atualize o componente React ou o módulo TS para consumir `t('namespace.chave')`.
4. Execute `npm run lint`/`npm run test` quando aplicável e faça um sanity check navegando até a tela que usa a nova string.

## Boas práticas
- Padronize chaves no singular (`templates.merge.title`) e mantenha subestruturas previsíveis (`tabs`, `form`, `alerts`).
- Quando precisar de plurais, use o suporte nativo do i18next (`t('key', { count })`).
- Interpole valores dinâmicos usando placeholders nomeados (`{ value }`) e evite concatenar strings fora do `t`.
- Antes de remover uma chave, faça uma busca (`rg 'templates\.foo'`) para garantir que não existe uso residual.

## Validação
- `npm run test` inclui verificações que garantem a inicialização do i18n nos componentes principais.
- Planejamento futuro: adicionar um teste dedicado que carregue todos os JSONs e valide se não existem chaves duplicadas ou vazias. Enquanto isso não acontece, mantenha revisões manuais em PRs.
