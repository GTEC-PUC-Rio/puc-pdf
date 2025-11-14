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
| `src/pages/json-to-pdf.html` | ✅ Concluído | Tela auxiliar alinhada ao Simple Mode com avisos e CTAs em pt-BR. |
| `src/pages/pdf-to-json.html` | ✅ Concluído | Upload, instruções e controles adaptados para o público da PUC-Rio. |
| `src/pages/table-of-contents.html` | ✅ Concluído | Fluxo de geração de sumário traduzido, inclusive opções avançadas. |
| `src/pages/bookmark.html` | ✅ Concluído | Editor de marcadores traduzido (menus, etiquetas, botões e placeholders). |
| `src/pages/pdf-multi-tool.html` | ✅ Concluído | Toolbar, instruções e mensagens desta ferramenta avançada traduzidas, mantendo o fluxo em pt-BR. |
| `src/js/config/tools.ts` | ✅ Concluído | Categorias, nomes e descrições das ferramentas traduzidos. |
| Templates dinâmicos (`src/js/ui.ts`) | ✅ Concluído | Todos os formulários, botões e descrições das ferramentas do Simple Mode estão em pt-BR, incluindo estados vazios e tooltips. |
| Mensagens de lógica (`src/js/logic/*`) | ✅ Concluído | Loaders, alertas e mensagens de erro/sucesso traduzidos em todos os módulos. Novas strings devem seguir o mesmo padrão. |
| Documentação (`README.md`, etc.) | ✅ Concluído | Mantida em inglês por decisão de produto; não será traduzida nesta fase. |

## Próximos Passos
1. Monitorar pull requests futuros para garantir que novas ferramentas/strings em `src/js/ui.ts` cheguem já traduzidas.
2. Revisar periodicamente `src/js/logic` para manter consistência caso novas mensagens sejam adicionadas.
3. Localizar documentação Markdown (README, CONTRIBUTING, SECURITY, etc.) se o produto decidir migrar esses textos para pt-BR.

Manter este documento atualizado a cada entrega ajudará a garantir transparência sobre o que já foi traduzido e o que ainda falta.
- 2025-11-12: Templates dos fluxos "Unir PDF", "Dividir PDF", "Proteger PDF", "Remover senha", "Organizar", "Girar", "Adicionar numeração", "PDF↔JPG", "Compressão" e componentes gerais (upload, modais) traduzidos em `src/js/ui.ts`.
- 2025-11-12: Fluxos "Excluir páginas", "Adicionar página em branco", "Extrair páginas", "Marca d’água", "Imagens → PDF", "PDF → imagens (PNG/WebP)", "PNG/WebP → PDF" e "PDF em tons de cinza/ZIP" traduzidos em `src/js/ui.ts`.
- 2025-11-12: Branding atualizado para PUC PDF (favicon, logos, rodapés com link do repositório e crédito ao BentoPDF) e documentado em `docs/customizacao.md`.
- 2025-11-12: Traduzidos também "Cabeçalho/Rodapé", "Alterar permissões", "PDF→Markdown", "Texto→PDF", "Inverter cores", "Ver metadados", "Inverter ordem", "Markdown→PDF", conversões SVG/BMP/HEIC/TIFF e bloco de assinaturas/OCR.
- 2025-11-12: Interface completa da `src/pages/pdf-multi-tool.html` localizada (botões, legendas e mensagens de carregamento) para uso no Simple Mode.
- 2025-11-12: Páginas auxiliares (`json-to-pdf`, `pdf-to-json`, `table-of-contents`, `bookmark`) receberam tradução completa e rodapés atualizados com assets locais.
- 2025-11-13: “Recortar PDF” (template e lógica) e fluxo de upload (`src/js/handlers/fileHandler.ts`) traduzidos, incluindo mensagens de alerta, loaders e metadados.
- 2025-11-13: Fluxo "Comparar PDFs" localizado (template em `src/js/ui.ts` e lógica em `src/js/logic/compare-pdfs.ts`), cobrindo loaders, alertas e botões de visualização.
- 2025-11-13: Localizados os fluxos "Gerenciar páginas", "Combinar em uma única página", "Padronizar dimensões", "Alterar cor de fundo" e "Alterar cor do texto" (templates em `src/js/ui.ts` e lógicas relacionadas).
- 2025-11-14: Concluída a revisão final dos templates em `src/js/ui.ts` e de todas as mensagens em `src/js/logic/*`, garantindo paridade total com o front estático.
