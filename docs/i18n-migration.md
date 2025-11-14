# Plano de migração para i18n

Este documento descreve como estamos incorporando o `i18next` para centralizar todas as strings da interface. Mesmo que o produto continue apenas em pt-BR, organizar o conteúdo desde já permite habilitar outros idiomas no futuro e facilita ajustes institucionais.

## Objetivos
- Remover strings hardcoded de HTML/TSX/TS e movê-las para `src/locales/pt-BR`.
- Usar as mesmas chaves no React e no código vanilla (Simple Mode) por meio do helper `t(...)`.
- Garantir que páginas legadas (ex.: `pdf-multi-tool.html`) também consumam traduções estáticas compartilhadas.

## Estrutura atual
- `src/i18n/index.ts`: inicializa o `i18next` e exporta `initI18n`/`t`.
- `src/locales/pt-BR/common.json`: navegação, rodapé, ações, modais e strings genéricas (upload, preview, botões).
- `src/locales/pt-BR/alerts.json`: textos de loaders e alertas.
- `src/locales/pt-BR/tools.json`: título/subtítulo do grid, estados vazios e CTAs.
- `src/js/utils/layout-translations.ts`: aplica traduções estáticas a nav, rodapé, modais e botões compartilhados (usado pelo `main.ts` e pelo `pdf-multi-tool.ts`).

## Etapas da migração
1. **Chrome compartilhado (concluído)**  
   - Nav, rodapé, botões dos modais e textos do dropzone foram movidos para `common.json`.
   - `applyLayoutTranslations()` sincroniza esses elementos tanto na Home quanto no Multi Tool.
2. **Fluxos do Simple Mode (em andamento)**  
   - Migrar gradualmente cada template em `src/js/ui.ts` para usar `t(...)`.  
   - Criar namespaces específicos (`tools.merge`, `tools.compress`, etc.) para opções, descrições e mensagens de instrução.
3. **Alertas e loaders das lógicas (pendente)**  
   - Mapear `src/js/logic/*` e mover todos os textos de `alert()`, `showLoader`, `console.warn` visíveis para usuários.
4. **Páginas estáticas**  
   - Reutilizar `layout-translations.ts` e injetar `initI18n()` nas páginas HTML legadas ou migrá-las para React quando possível.
5. **Testes e validação**  
   - Criar testes que conferem se chaves obrigatórias existem (ex.: usando `vitest` para validar JSONs).

## Guia rápido para novas traduções
1. Adicione a string em `src/locales/pt-BR/<namespace>.json`.
2. Se for usada no React, importe `t` diretamente. Caso precise de re-render automático, troque para `react-i18next` no componente.
3. Para HTML/TS vanilla, garanta que `initI18n()` foi chamado antes de acessar `t`.
4. Prefira estruturar as chaves por contexto (ex.: `upload.clearAll`, `modals.preview.download`) para evitar colisões.

## Próximos passos sugeridos
- Criar um namespace `tools.<toolId>` e migrar, ferramenta a ferramenta, o conteúdo de `toolTemplates`.
- Adaptar `src/react/App.tsx` para envolver `I18nextProvider`, permitindo hooks como `useTranslation`.
- Adicionar um script de lint simples que verifica se todas as traduções pt-BR têm valor preenchido.
- Atualizar os testes para cobrirem o comportamento traduzido (placeholders, labels e mensagens de alerta).
