# Diretrizes permanentes do Simple Mode

A aplicação inteira foi desenhada para o Simple Mode: uma home enxuta que leva diretamente aos fluxos de ferramentas, sem páginas de marketing complexas ou recursos do "modo completo" do BentoPDF original. Este documento explica as convenções atuais para manter esse formato consistente.

## Estrutura geral
- O único entrypoint é `index.html`, que carrega o bundle React e injeta o `AppLayout` com header, grid de ferramentas, hero resumido e rodapé institucional.
- Todos os fluxos são rotas internas (`/tool/:toolId`). Ao sair de uma ferramenta, o usuário retorna ao grid — não existe shell separado nem manipulação manual do DOM.
- Páginas auxiliares (bookmark editor, multi tool, JSON↔PDF, sumário) estão disponíveis como rotas React dedicadas e reutilizam o mesmo layout/breadcrumb.

## Build e configuração
- Não existe mais flag `__SIMPLE_MODE__`. Scripts npm, Dockerfile e pipelines constroem apenas este modo.
- `vite.config.ts` exporta um único HTML e aplica `withBasePath` para permitir deploys em subcaminhos.
- Qualquer novo script deve assumir o Simple Mode como padrão; não adicione toggles para layouts alternativos.

## Layout e navegação
- O header (`AppHeader`) usa apenas os elementos institucionais (logo, título, autenticação). Não reintroduzir menus complexos nem CTAs de marketing.
- O grid (`GridPage`) mostra todas as ferramentas com cartões uniformes. Novos cards devem ser descritos em `src/js/config/tools.ts` para manter categorias e ordenação.
- O breadcrumb padrão (`ToolBreadcrumb`) substitui os botões "Voltar às ferramentas" antigos. Use o componente compartilhado em qualquer fluxo que não seja a home.
- Sempre preserve o estado de scroll do usuário; o roteador já faz isso ao navegar entre `/` e `/tool/:id`.

## CSS e assets
- Estilos globais vivem em `src/css/styles.css` e contêm apenas o que é necessário para o Simple Mode. Antes de adicionar uma classe nova, verifique se um utilitário Tailwind equivalente já existe.
- Logos e favicons ficam em `public/images/`. Não referencie CDN externas.
- Remova classes/trechos não usados assim que identificar (o objetivo é manter o bundle enxuto).

## Diretrizes para novas features
1. **Ferramentas**: implemente o componente em `src/react/components/tools/`, registre em `reactToolRegistry` e adicione as traduções em `tools.json`.
2. **Páginas**: se necessário, crie um componente em `src/react/pages/` e adicione a rota em `Router.tsx`. Reaproveite o `AppLayout`.
3. **Lógicas**: mantenha o processamento em `src/js/logic/` e exponha funções `setup`/`process`. Componentes React devem apenas montar o DOM esperado.
4. **Documentação**: atualize os arquivos em `docs/` sempre que o comportamento do Simple Mode mudar (por exemplo, novos componentes compartilhados ou alteração em autenticação).

Seguindo essas regras, evitamos regressões para o modo antigo e mantemos o código focado na experiência simples que os usuários esperam.
