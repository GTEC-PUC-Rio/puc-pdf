# PUC PDF – Fork do BentoPDF

Este repositório é um fork do [BentoPDF original](https://github.com/alam00000/bentopdf) mantido pela comunidade da PUC-Rio. O objetivo é disponibilizar a suíte de ferramentas de PDF em português, com identidade visual e rótulos alinhados à universidade, operando exclusivamente no **Simple Mode** para uso interno.

## Por que este fork existe?
- **Foco comunitário**: fornecer uma alternativa gratuita e privada para estudantes, docentes e técnicos da PUC-Rio.
- **Interface localizada**: idioma, labels, mensagens e conteúdos institucionais foram traduzidos para pt-BR.
- **Identidade visual ajustada**: Logos e ícones podem ser trocados em `public/images` para refletir campanhas e eventos locais.
- **Simple Mode por padrão**: removemos áreas de marketing/branding do app original e priorizamos o grid de ferramentas.

> Todas as funcionalidades de manipulação de PDF continuam iguais às do projeto upstream; apenas a camada de apresentação e configuração foi adaptada.

## Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (ou compatível)

## Executando localmente (modo Simple)
```bash
# 1. Instalar dependências
pnpm install

# 2. Rodar o Vite em modo desenvolvimento
pnpm run dev
```
O Vite expõe o app em `http://localhost:5173`. Qualquer alteração em HTML/CSS/JS e na pasta `public/` é refletida automaticamente, permitindo validar traduções, logos e textos.

Para inspecionar o build final (minificado):
```bash
pnpm run preview -- --host 0.0.0.0 --port 4173
```
O preview serve o conteúdo gerado em `dist/`, replicando o comportamento de produção.

## Customizações comuns
| Ajuste | Como fazer |
| --- | --- |
| Logos/ícones | Substitua os arquivos em `public/images` (ex.: `favicon.svg`, `logo.svg`). |
| Textos institucionais | Atualize `index.html`, `about.html`, `contact.html`, `faq.html`, `privacy.html`, `terms.html`. |
| Labels de ferramentas | Ajuste strings em `src/js/ui.ts` e `src/js/config/*.ts`. |

## Agradecimentos
Todo o mérito das funcionalidades de PDF é da equipe do projeto original BentoPDF. Este fork existe apenas para adaptar o produto às necessidades da PUC-Rio, mantendo o código aberto e a filosofia de privacidade em primeiro lugar.
