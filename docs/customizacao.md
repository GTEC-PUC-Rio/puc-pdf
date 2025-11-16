# Customizações de Branding

Para manter o visual alinhado à identidade da PUC-Rio, aplicamos três ajustes principais ao fork:

1. **Favicon**  
   - Todos os arquivos HTML passaram a referenciar `/images/puc-favicon.ico` no `<link rel="icon">`.  
   - O arquivo está em `public/images/puc-favicon.ico`; substitua-o (mantendo o nome) para atualizar o ícone sem precisar alterar o código.

2. **Logotipo**  
   - O cabeçalho continua exibindo a marca colorida (`/images/logo-puc.png`), enquanto rodapés e páginas institucionais passaram a usar a versão monocromática nova (`/images/logo-puc-mono.png`).  
   - Ambos os arquivos estão em `public/images/`. Substitua-os mantendo os mesmos nomes para atualizar rapidamente o branding, ou ajuste o atributo `src` caso mude o caminho.  
   - Para uso offline, não há mais dependência de CDN; todos os assets ficam no repositório.

3. **Links institucionais**  
   - O rodapé agora aponta para o repositório `https://github.com/GTEC-PUC-Rio/puc-pdf` e credita o projeto original BentoPDF (`https://github.com/alam00000/bentopdf`).  
   - Qualquer alteração nesse crédito pode ser feita editando o bloco do rodapé em cada HTML ou no template simplificado criado em `main.ts`.

Com isso, todo o front-end exibe “PUC PDF” como marca principal, mantendo a atribuição ao BentoPDF.

## Servindo em um subcaminho (ex.: `/puc-pdf/`)

Por padrão, o Vite gera o bundle assumindo que a aplicação está na raiz do domínio (`/`). Para publicar sob um subdiretório (como `https://portal.exemplo.br/puc-pdf/`), basta informar o caminho base no `.env` usado durante o build:

```bash
VITE_BASE=/puc-pdf/
```

Regras importantes:

- Inclua a barra inicial e final (`/puc-pdf/`) para evitar links quebrados.
- Se o valor não for definido, o build assume `/` automaticamente.
- O mesmo valor deve ser usado localmente e na pipeline (por exemplo, exportando a variável antes do `pnpm run build` ou passando `--build-arg VITE_BASE=/puc-pdf/` quando usar Docker).

Todos os assets, páginas e links internos usam agora essa base configurada, então não é necessário editar manualmente os caminhos nos HTMLs.
