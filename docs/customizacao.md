# Customizações de Branding

Para manter o visual alinhado à identidade da PUC-Rio, aplicamos três ajustes principais ao fork:

1. **Favicon**  
   - Todos os arquivos HTML passaram a referenciar `/images/puc-favicon.ico` no `<link rel="icon">`.  
   - O arquivo está em `public/images/puc-favicon.ico`; substitua-o (mantendo o nome) para atualizar o ícone sem precisar alterar o código.

2. **Logotipo**  
   - Substituímos os antigos svgs do BentoPDF pela marca oficial (`/images/logo-puc.png`) em navbars, rodapés e no Simple Mode (inserido via `src/js/main.ts`).  
   - O arquivo local está em `public/images/logo-puc.png`. Troque-o pelo novo logo mantendo o mesmo nome, ou ajuste o atributo `src` caso altere o caminho.
   - Para uso offline, não há mais dependência de CDN; todos os assets ficam no repositório.

3. **Links institucionais**  
   - O rodapé agora aponta para o repositório `https://github.com/orgs/GTEC-PUC-Rio/puc-pdf` e credita o projeto original BentoPDF (`https://github.com/alam00000/bentopdf`).  
   - Qualquer alteração nesse crédito pode ser feita editando o bloco do rodapé em cada HTML ou no template simplificado criado em `main.ts`.

Com isso, todo o front-end exibe “PUC PDF” como marca principal, mantendo a atribuição ao BentoPDF.
