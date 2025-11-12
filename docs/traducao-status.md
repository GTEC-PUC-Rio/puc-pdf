# Plano de Tradução para pt-BR

Este documento acompanha o progresso da localização do BentoPDF para português brasileiro.

## Escopo Geral
- **Interface pública**: páginas estáticas (index, about, contact, faq, privacy, terms), cabeçalhos, rodapés e mensagens modais.
- **Aplicação interativa**: grids de ferramentas, templates dinâmicos (`src/js/ui.ts`), mensagens de alerta/carregamento em `src/js/logic`.
- **Documentação**: README e demais arquivos Markdown no repositório.

## Status Atual
| Camada / Arquivo | Situação | Observações |
| --- | --- | --- |
| `index.html` | ✅ Concluído | Conteúdo hero, seções de recursos, FAQ, depoimentos, modais e rodapé traduzidos. |
| `about.html` | ✅ Concluído | Missão, filosofia, motivos e CTA em pt-BR. |
| `contact.html` | ✅ Concluído | Textos de contato e rodapé ajustados. |
| `faq.html` | ✅ Concluído | Perguntas e respostas alinhadas com conteúdo principal. |
| `privacy.html` | ✅ Concluído | Política de privacidade integralmente traduzida. |
| `terms.html` | ✅ Concluído | Termos e condições completos em pt-BR. |
| Templates dinâmicos (`src/js/ui.ts`) | ⏳ Pendente | Necessário traduzir todos os textos das ferramentas e botões exibidos após seleção. |
| Mensagens de lógica (`src/js/logic/*`) | ⏳ Pendente | Alertas, loaders e erros específicos por ferramenta precisam ser revisados. |
| Documentação (`README.md`, etc.) | ⏳ Pendente | Conteúdo permanece em inglês; tradução será feita após camada dinâmica. |

## Próximos Passos
1. Mapear e traduzir as strings dos templates em `src/js/ui.ts` (grid de ferramentas e formulários de cada módulo).
2. Revisar arquivos em `src/js/logic` para alinhar mensagens de erro/sucesso.
3. Localizar documentação Markdown (README, CONTRIBUTING, SECURITY, etc.).

Manter este documento atualizado a cada entrega ajudará a garantir transparência sobre o que já foi traduzido e o que ainda falta.
