# Simplificação Definitiva para Simple Mode

Este guia lista tudo o que precisa ser feito para transformar o projeto em uma aplicação _exclusivamente_ Simple Mode. A ideia é remover o código redundante (switches, CSS e seções que só existem para o modo completo) e deixar o build/runtime assumindo o modo simples o tempo todo.

## 1. Build e configuração
- **Vite:** já não injeta mais `__SIMPLE_MODE__` (define removido).
- **Scripts npm / Docker / docker-compose / workflow:** todos os comandos passaram a construir apenas o Simple Mode (sem variáveis/arg extras) e o `serve:simple` foi removido. O pipeline de CI também gera uma única imagem.
- **Documentação:** README e SECURITY foram atualizados; `SIMPLE_MODE.md` foi removido por não fazer mais sentido.

## 2. Estrutura HTML
O `index.html` já foi reduzido ao que o Simple Mode de fato exibe (nav simples + grid + modais). Falta replicar essa limpeza nas demais páginas estáticas, eliminar classes/estilos mortos e revisar o footer para garantir consistência.

## 3. Domínio JS ligado ao Simple Mode
- **`src/js/main.ts`** e **`src/js/ui.ts`** já não escondem/mostram seções de marketing; todo o fluxo agora considera apenas o grid simples. É preciso garantir que novas ferramentas sigam esse padrão e remover dependências semelhantes em outros bundles, caso apareçam.
- **Outras referências ao modo completo:** procurar e remover eventuais usos remanescentes de `hero-section`, `features-section`, `hideSections`, `section-divider` etc. em CSS ou scripts herdados.

## 4. Uso de `__SIMPLE_MODE__` e globals
- Toda a checagem `__SIMPLE_MODE__` foi removida, assim como a declaração em `src/types/globals.d.ts`. Manter esse estado e impedir que novos condicionais sejam introduzidos em futuros PRs.

## 5. CSS e assets
Grande parte do CSS em `src/css/styles.css` foi desenhada para o site marketing (hero, FAQ, cards de depoimento). Depois de remover esses elementos, revisaremos as classes utilitárias/componentes que ficaram sem uso para diminuir o bundle.

## 6. Documentação complementar
- `SIMPLE_MODE.md` foi removido; manter README/SECURITY como fontes únicas de deploy.
- Outros documentos (`docs/customizacao.md`, `docs/traducao-status.md`) já conversam com o Simple Mode, mas vale uma revisão final para remover referências à versão completa.

## 7. Checklist final
1. Remover toda a superfície do modo completo no HTML/CSS.
2. Apagar condicionais que dependem de `__SIMPLE_MODE__` em JS/TS.
3. Fixar Simple Mode no build (scripts, Docker, Vite).
4. Revisar documentação e scripts de automação para garantir que ninguém consiga “ativar” o modo antigo.
5. Rodar um build testando o novo layout simplificado e ajustar o CSS conforme necessário.

Seguindo esses passos o repositório passa a representar apenas o Simple Mode, com código menor e sem toggles escondidos. Se surgirem novas ferramentas ou páginas, elas já devem ser criadas diretamente nesse formato enxuto.

### Progresso recente
- 2025-11-14: Página inicial simplificada (nav/hero removidos), condicionais de `__SIMPLE_MODE__` eliminados e `vite.config.ts` não depende mais de variáveis de modo.
- 2025-11-14: Páginas auxiliares (About/FAQ/Contato/etc. e ferramentas dedicadas) receberam o mesmo nav simples, carregamento protegido (`data-loading`) e não dependem mais do `mobileMenu.ts` (arquivo removido).
- 2025-11-14: Scripts npm, Dockerfile, docker-compose e o workflow de build passaram a gerar somente o Simple Mode; README/SECURITY foram ajustados e `SIMPLE_MODE.md` foi removido.
