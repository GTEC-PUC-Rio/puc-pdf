# Arquitetura React e roteamento

Este documento descreve como o front-end opera hoje. A aplicação inteira roda em React 19, com Vite como bundler e React Router 7 para navegação declarativa. Todas as telas compartilham o mesmo layout e consomem os mesmos provedores (i18n, autenticação e tema).

## Stack principal
- `src/react/main.tsx` inicializa o i18n, cria o `RouterProvider` e injeta o app no `#app` do `index.html`.
- O layout base fica em `src/react/layouts/AppLayout.tsx`, que encapsula `<AppHeader>` e `<StaticLayout>` (hero + footer). O conteúdo da rota é renderizado dentro do `<main>` deste layout.
- Estilos globais continuam em `src/css/styles.css` (Tailwind + utilitários próprios). Componentes reutilizáveis ficam em `src/react/ui/` e `src/react/components/shared/`.

## Rotas
`src/react/Router.tsx` define o roteador:
- `/` → `GridPage`: lista categorias/cards das ferramentas com busca e filtros.
- `/tool/:toolId` → `ToolPage`: carrega o componente React correspondente (via registry) e mostra o breadcrumb padrão.
- Páginas institucionais (`/about`, `/contact`, `/faq`, `/privacy`, `/terms`) usam `StaticLayout` com conteúdo React.
- Fluxos especiais (`/bookmark`, `/table-of-contents`, `/pdf-to-json`, `/json-to-pdf`, `/multi-tool`) também são componentes React que encapsulam a lógica existente.
- `/auth/callback` e `/auth/silent-renew` tratam o retorno do OIDC.

O roteador já lida com acessos diretos (ex.: `/tool/merge`), e o histórico/back/forward funciona nativamente porque não há mais `switchView` ou manipulação manual do DOM.

## Ferramentas
- `src/react/bridge/reactToolRegistry.ts` mapeia cada `toolId` para um componente React. Todas as 61 ferramentas presentes no grid usam esse registry.
- Componentes vivem em `src/react/components/tools/`. Cada um monta apenas o markup necessário e, no `useEffect`, chama os helpers legados quando necessário (`setupFileInputHandler`, `setup<Feature>Tool`, etc.).
- Se uma ferramenta ainda depende de HTML legado, ela é encapsulada em um componente que injeta o template e, em seguida, executa a lógica correspondente (ex.: `BookmarkPage`, `PdfMultiToolPage`).

### Como adicionar uma nova ferramenta
1. Criar `src/react/components/tools/<Name>Tool.tsx` com as traduções via `useTranslation` e os elementos esperados pela lógica.
2. Importar o módulo de lógica necessário (`src/js/logic/...`) e executar o `setup` no `useEffect`.
3. Registrar o componente no `reactToolRegistry` e garantir que o `toolId` exista em `src/js/config/tools.ts`.
4. Adicionar as traduções em `src/locales/pt-BR/tools.json`.
5. Rodar `pnpm run build` para confirmar que o Vite resolve o novo chunk.

## Integração com a lógica existente
- `src/js/logic/*` permanece como fonte da verdade para processamento de PDF (workers, qpdf wasm, etc.).
- `setupFileInputHandler(toolId)` monta os dropzones compartilhados e continua sendo chamado pelos componentes React.
- Os módulos de lógica ainda importam `alertService`, `loaderService` e helpers de `src/js/utils/`. As mensagens exibidas nesses serviços vêm do `i18n` (ver documento `i18n`).

## Testes e verificação
- `pnpm run test` cobre componentes de navegação e o roteador (ver `src/tests/router/toolRoutes.test.tsx`).
- `pnpm run build` compila todos os tools e garante que o bundle legado (`src/js/logic`) continue íntegro.
- Para smoke tests manuais, abrir `/`, navegar até alguns `/tool/:id` e acessar diretamente rotas especiais para confirmar inicialização correta dos setups.

## Deployment
- O `vite.config.ts` usa um único ponto de entrada (`index.html`). Reescritas do servidor precisam apontar qualquer rota para esse arquivo para que o React Router cuide do restante.
- Assets (logos, fontes) vivem em `public/`. Sempre utilize `withBasePath()` ao referenciar imagens dentro do React para respeitar `VITE_BASE`.
