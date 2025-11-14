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
- 2025-11-15: Chrome compartilhado (nav, rodapé, modais, dropzones) migrou para `i18next` via `src/js/utils/layout-translations.ts`, com catálogo centralizado em `src/locales/pt-BR/common.json` e plano documentado em `docs/i18n-migration.md`.
- 2025-11-15: React grid passou a usar `I18nextProvider`/`useTranslation`, loader de miniaturas usa `alerts.generatingPreviews` e os templates "Unir PDFs" e "Dividir PDF" migraram para `src/locales/pt-BR/tools.json`, incluindo instruções completas e opções dinâmicas.
- 2025-11-15: Fluxos "Proteger PDF", "Remover senha" e "Organizar PDF" foram migrados para o i18n (inputs, avisos, checkboxes e CTAs em `src/locales/pt-BR/tools.json`), mantendo paridade com o Simple Mode.
- 2025-11-15: Ferramentas "Comprimir PDF", "PDF para tons de cinza" e "Compactar PDFs em ZIP" também foram migradas para o catálogo (`templates.compress/pdfToGreyscale/pdfToZip`), cobrindo selects, tooltips e botões.
- 2025-11-15: Conversões de imagens (Imagens→PDF, JPG→PDF, PNG→PDF e PDF→JPG) passaram a consumir `templates.imageToPdf/jpgToPdf/pngToPdf/pdfToJpg`, eliminando strings hardcoded de sliders, descrições e CTAs.
- 2025-11-15: Restante das conversões gráficas (PDF→PNG/WebP/BMP/TIFF e TIFF/WebP→PDF) migrou para `tools.json`, mantendo todas as instruções, avisos e botões parametrizados em `t(...)`.
- 2025-11-15: Ferramentas “Texto→PDF”, “Markdown→PDF”, “Adicionar marca d’água” e “Cabeçalho/Rodapé” agora usam `templates.txtToPdf/mdToPdf/watermark/headerFooter`, com abas, placeholders e controles traduzidos.
- 2025-11-15: Fluxos de organização básica (“Excluir páginas”, “Adicionar páginas em branco”, “Extrair páginas”, “Inverter cores”, “Inverter ordem” e “Ver metadados”) também migraram para o catálogo, removendo os últimos textos hardcoded do Simple Mode.
- 2025-11-15: Ferramentas avançadas (permissões, anexos e sanitização) migradas para `templates.changePermissions/addAttachments/extractAttachments/editAttachments/sanitizePdf`, cobrindo painéis, tooltips e avisos.
- 2025-11-14: “Gerenciar páginas”, “Combinar em uma única página”, “Padronizar dimensões”, “Alterar cor de fundo”, “Alterar cor do texto”, “Comparar PDFs”, “OCR em PDF” e “Word para PDF” migrados para `i18next`, com legendas, placeholders, botões e tooltips servidos via `templates.*` no catálogo.
- 2025-11-14: Cobertura estendida para “Remover anotações”, “Preencher formulário”, “Transformar PDF em pôster”, “Remover páginas em branco”, “Alternar e mesclar páginas” e “Linearizar PDFs”, com seletores dinâmicos, legendas avançadas e botões alimentados pelo `templates.*`.
- 2025-11-14: “Recortar PDF” e “Assinar PDF” migrados para `templates.cropper/signPdf`, incluindo painéis de instrução, abas, botões, estados vazios e tooltips do editor de assinaturas.
- 2025-11-14: Fluxos “Girar PDF”, “Adicionar numeração”, “Cortar PDF (simples)”, “Editor de PDF” e “Remover restrições” também passaram a consumir `templates.rotate/addPageNumbers/crop/pdfEditor/removeRestrictions`, eliminando os últimos textos soltos desses formulários.
- 2025-11-14: Loaders/alertas de “Girar PDF”, “Adicionar numeração”, “Remover restrições” e “Adicionar marca d’água” migrados para `alerts.json`, garantindo paridade completa entre UI e lógica.
- 2025-11-14: Ferramentas “Combinar em uma única página”, “Dividir ao meio”, “Alterar cor de fundo”, “Alterar cor do texto”, “Compressão” e “Comparar PDFs” agora usam `alerts.*` para loaders/erros, cobrindo toda a camada de lógica do Simple Mode.
