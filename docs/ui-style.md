# Design System interno

- Tokens e componentes base ficam em `src/react/ui/`.
- Para atualizar cores/tipografia, edite `tokens.ts` e os componentes em `src/react/ui/components`.
- Componentes compartilhados:
  - `Surface`: contêiner com background gradiente e borda translúcida.
  - `Button`: variantes `primary`, `secondary`, `ghost`.
  - `Input`: campo com ícone opcional.
  - `Badge`: rótulo destacado.
- O tema claro replica o projeto `frontend-dsi-lib`: fontes `Rethink Sans/Roboto` e as variáveis de cor definidas em `src/css/styles.css` (seção `:root`). Ao atualizar de lá, sincronize primeiro as variáveis globais e depois os tokens do design system.

Ao alinhar com o repositório de referência, compare somente esses arquivos (não expomos nada do outro projeto). Qualquer componente novo deve ser adicionado à mesma pasta para manter um único ponto de atualização.
