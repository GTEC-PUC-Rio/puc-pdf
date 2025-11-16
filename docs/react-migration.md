# Migração para React 19

Este guia descreve uma estratégia gradual para portar o front-end atual (HTML/TS + Vite) para React 19, mantendo o comportamento Simple Mode como padrão e evitando regressões enquanto a migração acontece.

## 1. Objetivos
- Reaproveitar o CSS e a lógica existente, encapsulando os blocos de UI em componentes React.
- Permitir migrações parciais (por exemplo, usar React apenas no grid de ferramentas e, aos poucos, incorporar o restante).
- Minimizar interrupções: idealmente, o build em Vite continua funcionando com uma mistura de React + código vanilla até a migração terminar.

## 2. Pré-requisitos
- Node.js 18+ (já atendido).
- Dependências React 19 (`react`, `react-dom`, `@types/react`, `@types/react-dom`), além de um plugin Vite para React (ex.: `@vitejs/plugin-react`).

## 3. Etapas sugeridas
### 3.1 Preparar o ambiente
1. Instalar dependências:
   ```bash
   npm install react@19 react-dom@19
   npm install -D @vitejs/plugin-react @types/react @types/react-dom
   ```
2. Atualizar `vite.config.ts` para incluir o plugin React, mantendo o resto (tailwindcss, node polyfills, etc.).
3. Conferir typings do projeto (tsconfig) para aceitar JSX/TSX (`"jsx": "react-jsx"`).

### 3.2 Componentizar o grid
- Criar um diretório `src/react/` com:
  - `App.tsx`: ponto de entrada principal.
  - `components/ToolGrid.tsx`: renderiza categorias e cards das ferramentas.
  - `components/Modals.tsx`: loader/alert modais controlados por props ou contexto.
- Aproveitar as configs existentes (`src/js/config/tools.ts`) exportando-as para uso em React ou convertendo-as em hooks/contexts reutilizáveis.
- No `index.html`, trocar o `<script type="module" src="src/js/main.ts"></script>` por um bootstrap React (`src/react/main.tsx`) que chama `ReactDOM.createRoot(document.getElementById('app')).render(<App />)` mas, inicialmente, manter o antigo script até que o grid esteja 100% pronto.

### 3.3 Convivência entre React e vanilla
- Enquanto o grid React não estiver completo, renderize o App React dentro de um contêiner específico (ex.: `<div id="react-grid"></div>`) e deixe o restante do HTML como está.
- Ao migrar cada bloco (header, modais, tool-interface), remova o código vanilla correspondente.

### 3.4 Migrar páginas auxiliares
- Depois que a home Simple Mode estiver 100% em React, avaliar se as páginas estáticas (about/contact etc.) também serão convertidas ou se continuarão como HTML renderizado pelo build Vite (podem ser transformadas em rotas React ou mantidas como páginas separadas).

### 3.5 Ajustes finais
- Garantir que as lógicas em `src/js/logic` (ex.: handlers de ferramentas) sejam expostas como hooks ou módulos consumidos pelos componentes React (ex.: `useToolInterface`, `useAlerts`).
- Atualizar testes para usar `@testing-library/react` ao invés de manipular DOM manualmente.
- Revisar o CSS: manter Tailwind/estilos atuais ou migrar para CSS Modules/Styled Components conforme necessidade.

## 4. Checklist
1. [ ] Adicionar dependências React 19 + plugin Vite.
2. [ ] Configurar `tsconfig`/`vite.config.ts` para JSX e inicializar o i18n (mesmo que apenas pt-BR).
3. [ ] Criar um `App.tsx` inicial, renderizar dentro do `#app` e expor um provider de tradução (ex.: `I18nextProvider`).
4. [ ] Migrar o grid de ferramentas consumindo strings via `t('tools.grid.title')`.
5. [ ] Migrar modais/loader e handlers de upload para hooks + i18n (todas as mensagens em `alerts.json`).
6. [ ] Migração das páginas auxiliares: transformar em componentes React ou rotas, reaproveitando o mesmo provider de i18n.
7. [ ] Atualizar testes e documentação (React + i18n), garantindo que as chaves de tradução existam.

## 5. Observações
- Manter o Simple Mode como requisito: cada componente React deve continuar ocultando seções desnecessárias, mantendo o layout enxuto.
- Avaliar se vale introduzir um sistema de rotas (ex.: `react-router`) ou se as páginas continuarão separadas: migrar o header/footer comuns ajuda a reutilizar o layout.
- Planejar concomitantemente a migração das strings para o i18n:
  - Criar `src/locales/pt-BR/*.json` agrupando textos por domínio (layout, ferramentas, alertas).
  - Durante a componentização, substituir strings hardcoded por `t('...')`.
  - Assim, quando React estiver no controle, o app já terá infraestrutura para mais idiomas futuramente.

## 6. Próximos passos
- Validar dependências e plugins necessários com o time de infraestrutura.
- Definir quais partes da UI serão migradas primeiro (ex.: grid de ferramentas e modais).
- Planejar uma fase de “dual build”, em que o React convive com o código atual até que tudo esteja portado.

## 7. Roteamento declarativo para ferramentas
Com o grid migrado e a maioria das UIs encapsuladas em componentes React, o próximo passo é abandonar o “shell” híbrido (React + `setupToolInterface`) e deixar o React Router assumir o ciclo de vida das ferramentas.

### 7.1 Objetivo
Cada ferramenta deve ter uma rota dedicada (`/tool/:toolId`), renderizando:
- Um componente React nativo (para as ferramentas já portadas);
- Ou um wrapper genérico (`LegacyToolPage`) que injeta o template HTML existente e chama o `setup/teardown` correspondente.

Dessa forma o histórico, o scroll e o carregamento ficam sob controle do React Router, eliminando os hacks atuais para sincronizar rota ↔ tool.

### 7.2 Etapas propostas
1. **Criar `LegacyToolPage`:** componente que recebe `toolId`, injeta `toolTemplates[toolId]` em um contêiner e executa o `setup`/`resetState` via `useEffect`. Esse wrapper já é usado nas páginas que migramos (bookmark, multi-tool), então basta generalizar.
2. **Inserir rotas reais:** no `RootRouter`, adicionar `<Route path="/tool/:toolId" element={<ToolPage />} />`, onde `ToolPage` decide se renderiza um componente React (via `reactToolRegistry`) ou o wrapper legado.
3. **Grid apenas navega:** ao clicar no card, chamar `navigate('/tool/merge')` sem invocar `setupToolInterface`. O efeito no `ToolPage` assume o restante.
4. **Remover shell antigo:** quando tudo estiver funcionando via rotas, apagar `setupToolInterface`, `toolTemplates` e a bridge manual de scroll/navegação. O grid passa a ser apenas outro componente React e o estado global `state.activeTool` pode ser simplificado.
5. **URLs legadas:** mapear os antigos links (ex.: `/src/pages/bookmark.html`, hashes `#tool`) para as novas rotas via rewrites no servidor (nginx, Vite dev). Assim preservamos compatibilidade até removermos os HTMLs.

### 7.3 Checklist de migração de rotas
- [x] Criar wrapper (`LegacyToolMount`) e validá-lo para ferramentas legadas/React que ainda dependem do shell.
- [x] Adicionar `/tool/:toolId` ao Router e fazer o grid navegar diretamente para essas rotas.
- [x] Migrar cada ferramenta React do registry para a rota declarativa (sem `setupToolInterface`).
- [ ] Cobrir ferramentas estritamente legadas com wrappers específicos ou convertê-las para componentes definitivos.
- [x] Remover `setupToolInterface`, `toolTemplates` e o `historyBridge` (todos os fluxos agora dependem exclusivamente do React Router).
- [x] Atualizar documentação/testes, garantindo que acessos diretos (`/tool/merge`) funcionem no build final.

> **Atualização 3:** Bookmark e Multi Tool agora usam o mesmo breadcrumb global, e os botões legados "Voltar"/"Fechar" foram ocultados sem quebrar a lógica existente. A próxima etapa é validar testes/acessos diretos e remover qualquer resquício de markup duplicado.

> **Atualização:** o router já responde a `/tool/:toolId`. O grid usa `navigate('/tool/...')`, e o wrapper `LegacyToolMount` invoca o setup legado quando necessário. O próximo passo é eliminar `setupToolInterface` substituindo cada ferramenta por um componente dedicado ou por wrappers que não dependam de IDs globais.
> **Atualização 2:** Todas as ferramentas agora são servidas por componentes React; o shell antigo (`toolTemplates`/`setupToolInterface`) e o `historyBridge` foram eliminados. O grid e as ferramentas navegam exclusivamente pelas rotas do React Router.
> **Atualização 4:** Adicionamos `src/tests/router/toolRoutes.test.tsx` para garantir a navegação direta em `/tool/:toolId` (o teste cobre ferramentas simples e avançadas) e padronizamos o breadcrumb também nas páginas especiais (`/pdf-to-json`, `/json-to-pdf`, `/table-of-contents`). Isso elimina o botão legado “Voltar às ferramentas” e garante histórico/scroll consistentes. Hoje todas as 61 ferramentas do grid vivem em rotas declarativas; os marcadores foram incorporados como `bookmark-pdf`.
> **Atualização 5:** As páginas especiais restantes (Ferramenta completa de PDF e os conversores JSON ↔ PDF) agora são componentes declarativos (`multi-tool`, `pdf-to-json`, `json-to-pdf`). As antigas rotas HTML apenas redirecionam para `/tool/:id`, então qualquer acesso direto recebe o mesmo layout, scroll e breadcrumb do restante da aplicação.
