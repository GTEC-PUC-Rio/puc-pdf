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
