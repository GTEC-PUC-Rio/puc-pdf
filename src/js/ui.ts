import { resetState } from './state.js';
import { formatBytes } from './utils/helpers.js';
import { tesseractLanguages } from './config/tesseract-languages.js';
import { icons, createIcons } from 'lucide';
import Sortable from 'sortablejs';

// Centralizing DOM element selection
export const dom = {
  gridView: document.getElementById('grid-view'),
  toolGrid: document.getElementById('tool-grid'),
  toolInterface: document.getElementById('tool-interface'),
  toolContent: document.getElementById('tool-content'),
  backToGridBtn: document.getElementById('back-to-grid'),
  loaderModal: document.getElementById('loader-modal'),
  loaderText: document.getElementById('loader-text'),
  alertModal: document.getElementById('alert-modal'),
  alertTitle: document.getElementById('alert-title'),
  alertMessage: document.getElementById('alert-message'),
  alertOkBtn: document.getElementById('alert-ok'),
  toolsHeader: document.getElementById('tools-header'),
};

export const showLoader = (text = 'Processando...') => {
  dom.loaderText.textContent = text;
  dom.loaderModal.classList.remove('hidden');
};

export const hideLoader = () => dom.loaderModal.classList.add('hidden');

export const showAlert = (title: any, message: any) => {
  dom.alertTitle.textContent = title;
  dom.alertMessage.textContent = message;
  dom.alertModal.classList.remove('hidden');
};

export const hideAlert = () => dom.alertModal.classList.add('hidden');

export const switchView = (view: any) => {
  const showGrid = view === 'grid';
  dom.gridView.classList.toggle('hidden', !showGrid);
  dom.toolInterface.classList.toggle('hidden', showGrid);
  if (dom.toolsHeader) {
    dom.toolsHeader.classList.toggle('hidden', !showGrid);
  }

  if (showGrid) {
    resetState();
  }
};

const thumbnailState = {
  sortableInstances: {},
};

function initializeOrganizeSortable(containerId: any) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (thumbnailState.sortableInstances[containerId]) {
    thumbnailState.sortableInstances[containerId].destroy();
  }

  thumbnailState.sortableInstances[containerId] = Sortable.create(container, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    filter: '.delete-page-btn',
    preventOnFilter: true,
    onStart: function (evt: any) {
      evt.item.style.opacity = '0.5';
    },
    onEnd: function (evt: any) {
      evt.item.style.opacity = '1';
    },
  });
}

/**
 * Renders page thumbnails for tools like 'Organize' and 'Rotate'.
 * @param {string} toolId The ID of the active tool.
 * @param {object} pdfDoc The loaded pdf-lib document instance.
 */
export const renderPageThumbnails = async (toolId: any, pdfDoc: any) => {
  const containerId = toolId === 'organize' ? 'page-organizer' : 'page-rotator';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  showLoader('Gerando prévias das páginas...');

  const pdfData = await pdfDoc.save();
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'pdfjsLib'.
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const wrapper = document.createElement('div');
    wrapper.className = 'page-thumbnail relative group';
    // @ts-expect-error TS(2322) FIXME: Type 'number' is not assignable to type 'string'.
    wrapper.dataset.pageIndex = i - 1;

    const imgContainer = document.createElement('div');
    imgContainer.className =
      'w-full h-36 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-600';

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.className = 'max-w-full max-h-full object-contain';

    imgContainer.appendChild(img);

    if (toolId === 'organize') {
      wrapper.className = 'page-thumbnail relative group';
      wrapper.appendChild(imgContainer);

      const pageNumSpan = document.createElement('span');
      pageNumSpan.className =
        'absolute top-1 left-1 bg-gray-900 bg-opacity-75 text-white text-xs rounded-full px-2 py-1';
      pageNumSpan.textContent = i.toString();

      const deleteBtn = document.createElement('button');
      deleteBtn.className =
        'delete-page-btn absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', (e) => {
        (e.currentTarget as HTMLElement).parentElement.remove();
        initializeOrganizeSortable(containerId);
      });

      wrapper.append(pageNumSpan, deleteBtn);
    } else if (toolId === 'rotate') {
      wrapper.className = 'page-rotator-item flex flex-col items-center gap-2';
      wrapper.dataset.rotation = '0';
      img.classList.add('transition-transform', 'duration-300');
      wrapper.appendChild(imgContainer);

      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'flex items-center justify-center gap-3 w-full';

      const pageNumSpan = document.createElement('span');
      pageNumSpan.className = 'font-medium text-sm text-white';
      pageNumSpan.textContent = i.toString();

      const rotateBtn = document.createElement('button');
      rotateBtn.className =
        'rotate-btn btn bg-gray-700 hover:bg-gray-600 p-2 rounded-full';
      rotateBtn.title = 'Girar 90°';
      rotateBtn.innerHTML = '<i data-lucide="rotate-cw" class="w-5 h-5"></i>';
      rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = (e.currentTarget as HTMLElement).closest(
          '.page-rotator-item'
        ) as HTMLElement;
        const imgEl = card.querySelector('img');
        let currentRotation = parseInt(card.dataset.rotation);
        currentRotation = (currentRotation + 90) % 360;
        card.dataset.rotation = currentRotation.toString();
        imgEl.style.transform = `rotate(${currentRotation}deg)`;
      });

      controlsDiv.append(pageNumSpan, rotateBtn);
      wrapper.appendChild(controlsDiv);
    }

    container.appendChild(wrapper);
    createIcons({ icons });
  }

  if (toolId === 'organize') {
    initializeOrganizeSortable(containerId);
  }

  hideLoader();
};

/**
 * Renders a list of uploaded files in the specified container.
 * @param {HTMLElement} container The DOM element to render the list into.
 * @param {File[]} files The array of file objects.
 */
export const renderFileDisplay = (container: any, files: any) => {
  container.textContent = '';
  if (files.length > 0) {
    files.forEach((file: any) => {
      const fileDiv = document.createElement('div');
      fileDiv.className =
        'flex items-center justify-between bg-gray-700 p-3 rounded-lg text-sm';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'truncate font-medium text-gray-200';
      nameSpan.textContent = file.name;

      const sizeSpan = document.createElement('span');
      sizeSpan.className = 'flex-shrink-0 ml-4 text-gray-400';
      sizeSpan.textContent = formatBytes(file.size);

      fileDiv.append(nameSpan, sizeSpan);
      container.appendChild(fileDiv);
    });
  }
};

const createFileInputHTML = (options = {}) => {
  // @ts-expect-error TS(2339) FIXME: Property 'multiple' does not exist on type '{}'.
  const multiple = options.multiple ? 'multiple' : '';
  // @ts-expect-error TS(2339) FIXME: Property 'accept' does not exist on type '{}'.
  const acceptedFiles = options.accept || 'application/pdf';
  // @ts-expect-error TS(2339) FIXME: Property 'showControls' does not exist on type '{}... Remove this comment to see the full error message
  const showControls = options.showControls || false; // NEW: Add this parameter

  return `
        <div id="drop-zone" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700 transition-colors duration-300">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i data-lucide="upload-cloud" class="w-10 h-10 mb-3 text-gray-400"></i>
                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Clique para selecionar</span> ou arraste e solte</p>
                <p class="text-xs text-gray-500">${multiple ? 'PDFs ou imagens' : 'Um único arquivo PDF'}</p>
                <p class="text-xs text-gray-500">Seus arquivos nunca saem do seu dispositivo.</p>
            </div>
            <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" ${multiple} accept="${acceptedFiles}">
        </div>
        
        ${
          showControls
            ? `
            <!-- NEW: Add control buttons for multi-file uploads -->
            <div id="file-controls" class="hidden mt-4 flex gap-3">
                <button id="add-more-btn" class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="plus"></i> Adicionar mais arquivos
                </button>
                <button id="clear-files-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="x"></i> Limpar tudo
                </button>
            </div>
        `
            : ''
        }
    `;
};

export const toolTemplates = {
  merge: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Unir PDFs</h2>
    <p class="mb-6 text-gray-400">Una arquivos completos ou escolha páginas específicas para formar um novo documento.</p>
    ${createFileInputHTML({ multiple: true, showControls: true })} 

    <div id="merge-options" class="hidden mt-6">
        <div class="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
            <button id="file-mode-btn" class="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md">Modo arquivo</button>
            <button id="page-mode-btn" class="flex-1 btn text-gray-300 font-semibold py-2 rounded-md">Modo página</button>
        </div>

        <div id="file-mode-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Clique e arraste o ícone <i data-lucide="grip-vertical" class="inline-block w-3 h-3"></i> para alterar a ordem dos arquivos.</li>
                    <li>Na coluna “Páginas” de cada arquivo, informe intervalos (ex.: “1-3, 5”) para unir somente essas páginas.</li>
                    <li>Deixe o campo vazio para incluir todas as páginas daquele arquivo.</li>
                </ul>
            </div>
            <ul id="file-list" class="space-y-2"></ul>
        </div>

        <div id="page-mode-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                 <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Todas as páginas dos PDFs enviados aparecem abaixo.</li>
                    <li>Arraste e solte as miniaturas para definir exatamente a ordem desejada no novo arquivo.</li>
                </ul>
            </div>
             <div id="page-merge-preview" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[200px]"></div>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Unir PDFs</button>
    </div>
`,

  split: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Dividir PDF</h2>
    <p class="mb-6 text-gray-400">Extraia páginas de um PDF utilizando diversos métodos.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="split-options" class="hidden mt-6">
        
        <label for="split-mode" class="block mb-2 text-sm font-medium text-gray-300">Modo de divisão</label>
        <select id="split-mode" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4">
            <option value="range">Extrair por intervalo (padrão)</option>
            <option value="even-odd">Separar por páginas pares/ímpares</option>
            <option value="all">Dividir todas as páginas em arquivos separados</option>
            <option value="visual">Selecionar páginas visualmente</option>
            <option value="bookmarks">Dividir por marcadores</option>
            <option value="n-times">Dividir em N partes</option>
        </select>

        <div id="range-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Informe números de página separados por vírgula (ex.: 2, 8, 14).</li>
                    <li>Use hífen para intervalos (ex.: 5-10).</li>
                    <li>Combine os formatos para seleções complexas (ex.: 1-3, 7, 12-15).</li>
                </ul>
            </div>
            <p class="mb-2 font-medium text-white">Total de páginas: <span id="total-pages"></span></p>
            <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Informe o intervalo:</label>
            <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-5, 8">
        </div>

        <div id="even-odd-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Cria um novo PDF contendo apenas as páginas pares ou apenas as páginas ímpares do documento original.</p>
            </div>
            <div class="flex gap-4">
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="odd" checked class="hidden">
                    <span class="font-semibold text-white">Somente páginas ímpares</span>
                </label>
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="even" class="hidden">
                    <span class="font-semibold text-white">Somente páginas pares</span>
                </label>
            </div>
        </div>
        
        <div id="visual-select-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Clique nas miniaturas abaixo para selecioná-las. Clique novamente para remover a seleção. Todas as páginas marcadas serão extraídas.</p>
            </div>
             <div id="page-selector-grid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[150px]"></div>
        </div>

        <div id="all-pages-panel" class="hidden p-3 bg-gray-900 rounded-lg border border-gray-700">
            <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
            <p class="text-xs text-gray-400 mt-1">Este modo cria um PDF separado para cada página do documento e faz o download de todos em um único arquivo ZIP.</p>
        </div>

        <div id="bookmarks-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Divide o PDF nos pontos onde existirem marcadores. Cada marcador inicia um novo arquivo.</p>
            </div>
            <div class="mb-4">
                <label for="bookmark-level" class="block mb-2 text-sm font-medium text-gray-300">Nível de marcador</label>
                <select id="bookmark-level" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="0">Nível 0 (somente topo)</option>
                    <option value="1">Nível 1</option>
                    <option value="2">Nível 2</option>
                    <option value="3">Nível 3</option>
                    <option value="all" selected>Todos os níveis</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">Escolha qual nível de hierarquia será usado na divisão.</p>
            </div>
        </div>

        <div id="n-times-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Divide o PDF em N partes iguais. Ex.: um PDF de 40 páginas com N=5 gera 8 PDFs com 5 páginas.</p>
            </div>
            <div class="mb-4">
                <label for="split-n-value" class="block mb-2 text-sm font-medium text-gray-300">Número de páginas por divisão (N)</label>
                <input type="number" id="split-n-value" min="1" value="5" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                <p class="mt-1 text-xs text-gray-400">Cada PDF resultante terá N páginas (exceto, talvez, o último).</p>
            </div>
            <div id="n-times-warning" class="hidden p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg mb-3">
                <p class="text-sm text-yellow-200"><strong>Observação:</strong> <span id="n-times-warning-text"></span></p>
            </div>
        </div>
        
        <div id="zip-option-wrapper" class="hidden mt-4">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                <input type="checkbox" id="download-as-zip" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                Baixar páginas como arquivos individuais em um ZIP
            </label>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6">Dividir PDF</button>

    </div>
`,
  encrypt: () => `
  <h2 class="text-2xl font-bold text-white mb-4">Proteger PDF com senha</h2>
  <p class="mb-6 text-gray-400">Ative uma proteção AES 256 bits para o seu PDF.</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="encrypt-options" class="hidden space-y-4 mt-6">
      <div>
          <label for="user-password-input" class="block mb-2 text-sm font-medium text-gray-300">Senha do usuário</label>
          <input required type="password" id="user-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para abrir o PDF">
          <p class="text-xs text-gray-500 mt-1">Obrigatória para abrir e visualizar o PDF.</p>
      </div>
      <div>
          <label for="owner-password-input" class="block mb-2 text-sm font-medium text-gray-300">Senha do proprietário (opcional)</label>
          <input type="password" id="owner-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para permissões completas (recomendado)">
          <p class="text-xs text-gray-500 mt-1">Permite alterar permissões e remover a criptografia.</p>
      </div>

      <!-- Restriction checkboxes (shown when owner password is entered) -->
      <div id="restriction-options" class="hidden p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 class="font-semibold text-base mb-2 text-white">🔒 Restrinja permissões do PDF</h3>
        <p class="text-sm text-gray-400 mb-3">Escolha quais ações serão bloqueadas:</p>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify" checked>
            <span>Bloquear qualquer modificação (--modify=none)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-extract" checked>
            <span>Bloquear extração de texto/imagem (--extract=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-print" checked>
            <span>Bloquear impressão (--print=none)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-accessibility">
            <span>Bloquear cópia para acessibilidade (--accessibility=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-annotate">
            <span>Bloquear anotações (--annotate=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-assemble">
            <span>Bloquear montagem de páginas (--assemble=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-form">
            <span>Bloquear preenchimento de formulários (--form=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify-other">
            <span>Bloquear outras modificações (--modify-other=n)</span>
          </label>
        </div>
      </div>

      <div class="p-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">⚠️ Recomendação de segurança</h3>
          <p class="text-sm text-gray-300">Para máxima segurança, defina as duas senhas. Sem a senha de proprietário, restrições (impressão, cópia etc.) podem ser contornadas.</p>
      </div>
      <div class="p-4 bg-green-900/20 border border-green-500/30 text-green-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">✓ Criptografia de alta qualidade</h3>
          <p class="text-sm text-gray-300">Criptografia AES 256 bits sem perda de qualidade. O texto continua selecionável e pesquisável.</p>
      </div>
      <button id="process-btn" class="btn-gradient w-full mt-6">Criptografar e baixar</button>
  </div>
`,
  decrypt: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Remover senha do PDF</h2>
        <p class="mb-6 text-gray-400">Envie um PDF protegido e informe a senha atual para gerar uma cópia desbloqueada.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="decrypt-options" class="hidden space-y-4 mt-6">
            <div>
                <label for="password-input" class="block mb-2 text-sm font-medium text-gray-300">Digite a senha atual</label>
                <input type="password" id="password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Informe a senha correta">
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Desbloquear e baixar</button>
        </div>
        <canvas id="pdf-canvas" class="hidden"></canvas>
    `,
  organize: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Organizar PDF</h2>
        <p class="mb-6 text-gray-400">Reordene, gire ou exclua páginas arrastando e soltando.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="page-organizer" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Salvar alterações</button>
    `,

  rotate: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Girar PDF</h2>
        <p class="mb-6 text-gray-400">Gire todas as páginas ou apenas as selecionadas do documento.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        
        <div id="rotate-all-controls" class="hidden my-6">
            <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-gray-400 mb-3 text-center">Ações em lote</h3>
                <div class="flex justify-center gap-4">
                    <button id="rotate-all-left-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-ccw" class="mr-2 h-4 w-4"></i>
                        Girar todas à esquerda
                    </button>
                    <button id="rotate-all-right-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-cw" class="mr-2 h-4 w-4"></i>
                        Girar todas à direita
                    </button>
                </div>
            </div>
        </div>
        <div id="page-rotator" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Salvar rotações</button>
    `,

  'add-page-numbers': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Adicionar numeração</h2>
        <p class="mb-6 text-gray-400">Insira números de página personalizados no PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="pagenum-options" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
                <label for="position" class="block mb-2 text-sm font-medium text-gray-300">Posição</label>
                <select id="position" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="bottom-center">Inferior central</option>
                    <option value="bottom-left">Inferior esquerda</option>
                    <option value="bottom-right">Inferior direita</option>
                    <option value="top-center">Superior central</option>
                    <option value="top-left">Superior esquerda</option>
                    <option value="top-right">Superior direita</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da fonte</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="number-format" class="block mb-2 text-sm font-medium text-gray-300">Formato</label>
                <select id="number-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="default">1, 2, 3...</option>
                    <option value="page_x_of_y">Página 1/N, 2/N...</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do texto</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Inserir numeração</button>
    `,
  'pdf-to-jpg': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para JPG</h2>
        <p class="mb-6 text-gray-400">Converta cada página do PDF em uma imagem JPG de alta qualidade.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="jpg-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="jpg-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade da imagem</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="jpg-quality" min="0.1" max="1.0" step="0.1" value="0.9" class="flex-1">
                    <span id="jpg-quality-value" class="text-white font-medium w-16 text-right">90%</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">Qualidade maior = arquivos maiores.</p>
            </div>
            <p class="mb-4 text-white text-center">Clique em “Baixar tudo como ZIP” para obter as imagens de todas as páginas.</p>
            <button id="process-btn" class="btn-gradient w-full">Baixar tudo como ZIP</button>
        </div>
    `,
  'jpg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">JPG para PDF</h2>
        <p class="mb-6 text-gray-400">Converta uma ou mais imagens JPG em um único PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="jpg-to-pdf-options" class="hidden mt-6">
            <div class="mb-4">
                <label for="jpg-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade do PDF</label>
                <select id="jpg-pdf-quality" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="high">Alta qualidade (arquivo maior)</option>
                    <option value="medium" selected>Média (equilíbrio)</option>
                    <option value="low">Baixa qualidade (arquivo menor)</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">Controla a compressão das imagens ao incorporá-las no PDF.</p>
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'scan-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Escanear para PDF</h2>
        <p class="mb-6 text-gray-400">Use a câmera do dispositivo para digitalizar documentos e salvá-los como PDF. No desktop, será aberto o seletor de arquivos.</p>
        ${createFileInputHTML({ accept: 'image/*' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Criar PDF a partir das capturas</button>
    `,

  crop: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Cortar PDF</h2>
    <p class="mb-6 text-gray-400">Clique e arraste para selecionar a área de corte em cada página. É possível definir cortes diferentes por página.</p>
    ${createFileInputHTML()}
    <div id="crop-editor" class="hidden">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div id="page-nav" class="flex items-center gap-2"></div>
            <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="zoom-controls" class="flex items-center gap-2">
                <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Reduzir zoom"><i data-lucide="zoom-out" class="w-5 h-5"></i></button>
                <button id="fit-page-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Ajustar à tela"><i data-lucide="minimize" class="w-5 h-5"></i></button>
                <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Aumentar zoom"><i data-lucide="zoom-in" class="w-5 h-5"></i></button>
            </div>
             <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="crop-controls" class="flex items-center gap-2">
                 <button id="clear-crop-btn" class="btn bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="Limpar corte desta página">Limpar página</button>
                 <button id="clear-all-crops-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="Limpar todas as seleções de corte">Limpar tudo</button>
            </div>
        </div>
        <div id="canvas-container" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600" style="height: 70vh;">
            <canvas id="canvas-editor" class="mx-auto cursor-crosshair"></canvas>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar corte e salvar PDF</button>
    </div>
`,
  compress: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Comprimir PDF</h2>
    <p class="mb-6 text-gray-400">Reduza o tamanho escolhendo o método de compressão ideal. Suporta vários PDFs.</p>
    ${createFileInputHTML({ multiple: true, showControls: true })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="compress-options" class="hidden mt-6 space-y-6">
        <div>
            <label for="compression-level" class="block mb-2 text-sm font-medium text-gray-300">Nível de compressão</label>
            <select id="compression-level" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="balanced">Equilibrado (recomendado)</option>
                <option value="high-quality">Alta qualidade (arquivo maior)</option>
                <option value="small-size">Menor tamanho (qualidade reduzida)</option>
                <option value="extreme">Extremo (qualidade muito baixa)</option>
            </select>
        </div>

        <div>
            <label for="compression-algorithm" class="block mb-2 text-sm font-medium text-gray-300">Algoritmo de compressão</label>
            <select id="compression-algorithm" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="vector">Vector (PDFs com muito texto)</option>
                <option value="photon">Photon (imagens digitalizadas/desenhos)</option>
            </select>
            <p class="mt-2 text-xs text-gray-400">
                Use “Vector” para PDFs focados em texto ou “Photon” para arquivos escaneados e com muitas imagens.
            </p>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-4" disabled>Comprimir PDF</button>
    </div>
`,
  'pdf-to-greyscale': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para tons de cinza</h2>
        <p class="mb-6 text-gray-400">Converta todas as páginas para preto e branco. Cada página é renderizada, recebe um filtro e o PDF é reconstruído.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para tons de cinza</button>
    `,
  'pdf-to-zip': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Compactar PDFs em ZIP</h2>
        <p class="mb-6 text-gray-400">Selecione vários PDFs para baixar tudo junto em um único arquivo ZIP.</p>
        ${createFileInputHTML({ multiple: true, showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Gerar arquivo ZIP</button>
    `,

  'edit-metadata': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Editar metadados do PDF</h2>
    <p class="mb-6 text-gray-400">Altere os metadados principais do seu PDF. Deixe o campo vazio para limpar o valor correspondente.</p>
    
    <div class="p-3 mb-6 bg-gray-900 border border-yellow-500/30 text-yellow-200/80 rounded-lg text-sm flex items-start gap-3">
        <i data-lucide="info" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div>
            <strong class="font-semibold text-yellow-200">Importante:</strong>
            Esta ferramenta usa a biblioteca <code class="bg-gray-700 px-1 rounded text-white">pdf-lib</code>, que pode atualizar os campos <strong>Producer</strong>, <strong>CreationDate</strong> e <strong>ModDate</strong> ao salvar. Para conferir o resultado final, utilize a opção <strong>Ver metadados</strong>.
        </div>
    </div>

    ${createFileInputHTML()}
    
    <div id="metadata-form" class="hidden mt-6 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="meta-title" class="block mb-2 text-sm font-medium text-gray-300">Título</label>
                <input type="text" id="meta-title" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-author" class="block mb-2 text-sm font-medium text-gray-300">Autor</label>
                <input type="text" id="meta-author" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-subject" class="block mb-2 text-sm font-medium text-gray-300">Assunto</label>
                <input type="text" id="meta-subject" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-keywords" class="block mb-2 text-sm font-medium text-gray-300">Palavras-chave (separadas por vírgula)</label>
                <input type="text" id="meta-keywords" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-creator" class="block mb-2 text-sm font-medium text-gray-300">Ferramenta criadora</label>
                <input type="text" id="meta-creator" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-producer" class="block mb-2 text-sm font-medium text-gray-300">Ferramenta produtora</label>
                <input type="text" id="meta-producer" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-creation-date" class="block mb-2 text-sm font-medium text-gray-300">Data de criação</label>
                <input type="datetime-local" id="meta-creation-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-mod-date" class="block mb-2 text-sm font-medium text-gray-300">Data de modificação</label>
                <input type="datetime-local" id="meta-mod-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>

        <div id="custom-metadata-container" class="space-y-3 pt-4 border-t border-gray-700">
             <h3 class="text-lg font-semibold text-white">Campos personalizados</h3>
             <p class="text-sm text-gray-400 -mt-2">Observação: nem todos os leitores de PDF suportam campos personalizados.</p>
        </div>
        <button id="add-custom-meta-btn" class="btn border border-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            <i data-lucide="plus"></i> Adicionar campo
        </button>
        
    </div>

    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Atualizar metadados e baixar</button>
`,

  'remove-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Remover metadados</h2>
        <p class="mb-6 text-gray-400">Elimine totalmente metadados identificáveis do PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">Remover e baixar</button>
    `,
  flatten: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Achatar PDF</h2>
        <p class="mb-6 text-gray-400">Transforme formulários e anotações em conteúdo fixo e não editável.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">Achatar PDF</button>
    `,
  'pdf-to-png': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para PNG</h2>
        <p class="mb-6 text-gray-400">Converta cada página do PDF em uma imagem PNG de alta qualidade.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="png-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="png-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade da imagem (escala)</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="png-quality" min="1.0" max="4.0" step="0.5" value="2.0" class="flex-1">
                    <span id="png-quality-value" class="text-white font-medium w-16 text-right">2.0x</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">Escala maior = qualidade melhor, porém arquivos maiores.</p>
            </div>
            <p class="mb-4 text-white text-center">Seu arquivo está pronto. Clique para baixar um ZIP com todas as imagens PNG.</p>
            <button id="process-btn" class="btn-gradient w-full">Baixar tudo como ZIP</button>
        </div>
    `,
  'png-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PNG para PDF</h2>
        <p class="mb-6 text-gray-400">Converta uma ou mais imagens PNG em um único PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/png', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="png-to-pdf-options" class="hidden mt-6">
            <div class="mb-4">
                <label for="png-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade do PDF</label>
                <select id="png-pdf-quality" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="high">Alta qualidade (arquivo maior)</option>
                    <option value="medium" selected>Qualidade média (equilíbrio)</option>
                    <option value="low">Baixa qualidade (arquivo menor)</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">Controla a compressão das imagens ao incorporá-las no PDF.</p>
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'pdf-to-webp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para WebP</h2>
        <p class="mb-6 text-gray-400">Converta cada página em uma imagem WebP moderna.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="webp-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="webp-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade da imagem</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="webp-quality" min="0.1" max="1.0" step="0.1" value="0.9" class="flex-1">
                    <span id="webp-quality-value" class="text-white font-medium w-16 text-right">90%</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">Mais qualidade = arquivos maiores.</p>
            </div>
            <p class="mb-4 text-white text-center">Arquivo pronto! Clique para baixar um ZIP com todas as imagens WebP.</p>
            <button id="process-btn" class="btn-gradient w-full">Baixar tudo como ZIP</button>
        </div>
    `,
  'webp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">WebP para PDF</h2>
        <p class="mb-6 text-gray-400">Converta uma ou mais imagens WebP em um único PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/webp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  edit: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Editor de PDF</h2>
        <p class="mb-6 text-gray-400">Ferramenta para anotar, desenhar, destacar, redigir trechos, adicionar comentários e formas, capturar telas e visualizar PDFs com precisão.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="embed-pdf-wrapper" class="hidden mt-6 w-full h-[75vh] border border-gray-600 rounded-lg">
            <div id="embed-pdf-container" class="w-full h-full"></div>
        </div>
    `,
  'delete-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Excluir páginas</h2>
        <p class="mb-6 text-gray-400">Remova páginas específicas ou intervalos inteiros do PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="delete-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de páginas: <span id="total-pages"></span></p>
            <label for="pages-to-delete" class="block mb-2 text-sm font-medium text-gray-300">Informe as páginas a excluir (ex.: 2, 4-6, 9):</label>
            <input type="text" id="pages-to-delete" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="ex.: 2, 4-6, 9">
            <button id="process-btn" class="btn-gradient w-full">Excluir e baixar</button>
        </div>
    `,
  'add-blank-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Adicionar páginas em branco</h2>
        <p class="mb-6 text-gray-400">Insira páginas vazias em qualquer posição do documento.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="blank-page-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de páginas: <span id="total-pages"></span></p>
            <label for="page-number" class="block mb-2 text-sm font-medium text-gray-300">Inserir páginas após o número:</label>
            <input type="number" id="page-number" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="Use 0 para inserir no início">
            <label for="page-count" class="block mb-2 text-sm font-medium text-gray-300">Quantidade de páginas em branco:</label>
            <input type="number" id="page-count" min="1" value="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="Informe o número de páginas">
            <button id="process-btn" class="btn-gradient w-full">Adicionar páginas e baixar</button>
        </div>
    `,
  'extract-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Extrair páginas</h2>
        <p class="mb-6 text-gray-400">Exporte páginas específicas em arquivos separados. O download será feito em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="extract-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de páginas: <span id="total-pages"></span></p>
            <label for="pages-to-extract" class="block mb-2 text-sm font-medium text-gray-300">Informe as páginas para extrair (ex.: 2, 4-6, 9):</label>
            <input type="text" id="pages-to-extract" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="ex.: 2, 4-6, 9">
            <button id="process-btn" class="btn-gradient w-full">Extrair e baixar ZIP</button>
        </div>
    `,

  'add-watermark': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Adicionar marca d’água</h2>
    <p class="mb-6 text-gray-400">Aplique uma marca d’água em texto ou imagem em todas as páginas do PDF.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="watermark-options" class="hidden mt-6 space-y-4">
        <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="text" checked class="hidden">
                <span class="font-semibold text-white">Texto</span>
            </label>
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="image" class="hidden">
                <span class="font-semibold text-white">Imagem</span>
            </label>
        </div>

        <div id="text-watermark-options">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="watermark-text" class="block mb-2 text-sm font-medium text-gray-300">Texto da marca d’água</label>
                    <input type="text" id="watermark-text" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: CONFIDENCIAL">
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da fonte</label>
                    <input type="number" id="font-size" value="72" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do texto</label>
                    <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
                <div>
                    <label for="opacity-text" class="block mb-2 text-sm font-medium text-gray-300">Opacidade (<span id="opacity-value-text">0.3</span>)</label>
                    <input type="range" id="opacity-text" value="0.3" min="0" max="1" step="0.1" class="w-full">
                </div>
            </div>
            <div class="mt-4">
                <label for="angle-text" class="block mb-2 text-sm font-medium text-gray-300">Ângulo (<span id="angle-value-text">0</span>°)</label>
                <input type="range" id="angle-text" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

        <div id="image-watermark-options" class="hidden space-y-4">
            <div>
                <label for="image-watermark-input" class="block mb-2 text-sm font-medium text-gray-300">Envie a imagem da marca d’água</label>
                <input type="file" id="image-watermark-input" accept="image/png, image/jpeg" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
            </div>
            <div>
                <label for="opacity-image" class="block mb-2 text-sm font-medium text-gray-300">Opacidade (<span id="opacity-value-image">0.3</span>)</label>
                <input type="range" id="opacity-image" value="0.3" min="0" max="1" step="0.1" class="w-full">
            </div>
            <div>
                <label for="angle-image" class="block mb-2 text-sm font-medium text-gray-300">Ângulo (<span id="angle-value-image">0</span>°)</label>
                <input type="range" id="angle-image" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar marca d’água e baixar</button>
`,

  'add-header-footer': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Adicionar cabeçalho e rodapé</h2>
    <p class="mb-6 text-gray-400">Insira textos personalizados nas margens superior e inferior de cada página.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="header-footer-options" class="hidden mt-6 space-y-4">
        
        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Opções de formatação</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Intervalo de páginas (opcional)</label>
                    <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-3, 5">
                    <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages">0</span></p>
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da fonte</label>
                    <input type="number" id="font-size" value="10" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="font-color" class="block mb-2 text-sm font-medium text-gray-300">Cor da fonte</label>
                    <input type="color" id="font-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="header-left" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho esquerdo</label>
                <input type="text" id="header-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-center" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho central</label>
                <input type="text" id="header-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-right" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho direito</label>
                <input type="text" id="header-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="footer-left" class="block mb-2 text-sm font-medium text-gray-300">Rodapé esquerdo</label>
                <input type="text" id="footer-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-center" class="block mb-2 text-sm font-medium text-gray-300">Rodapé central</label>
                <input type="text" id="footer-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-right" class="block mb-2 text-sm font-medium text-gray-300">Rodapé direito</label>
                <input type="text" id="footer-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar cabeçalho/rodapé</button>
`,

  'image-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Imagens para PDF</h2>
        <p class="mb-6 text-gray-400">Combine várias imagens em um único PDF. Arraste e solte para ordenar.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg,image/png,image/webp', showControls: true })}
        <ul id="image-list" class="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        </ul>
        <div id="image-to-pdf-options" class="hidden mt-6">
          <div class="mb-4">
            <label for="image-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">Qualidade das imagens no PDF</label>
            <div class="flex items-center gap-4">
              <input type="range" id="image-pdf-quality" min="0.3" max="1.0" step="0.1" value="0.9" class="flex-1">
              <span id="image-pdf-quality-value" class="text-white font-medium w-16 text-right">90%</span>
            </div>
            <p class="mt-1 text-xs text-gray-400">Mais qualidade = PDF maior.</p>
          </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,

  'change-permissions': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Alterar permissões do PDF</h2>
    <p class="mb-6 text-gray-400">Ajuste senhas e permissões sem perder qualidade.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="permissions-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="current-password" class="block mb-2 text-sm font-medium text-gray-300">Senha atual (se houver)</label>
            <input type="password" id="current-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Deixe em branco se não houver senha">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="new-user-password" class="block mb-2 text-sm font-medium text-gray-300">Nova senha do usuário (opcional)</label>
                <input type="password" id="new-user-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para abrir o PDF">
            </div>
            <div>
                <label for="new-owner-password" class="block mb-2 text-sm font-medium text-gray-300">Nova senha do proprietário (opcional)</label>
                <input type="password" id="new-owner-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para manter as permissões">
            </div>
        </div>

        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
            <h3 class="font-semibold text-base mb-2">Como funciona</h3>
            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li><strong>Senha do usuário:</strong> necessária para abrir o PDF.</li>
                <li><strong>Senha do proprietário:</strong> aplica as permissões configuradas abaixo.</li>
                <li>Deixe ambas vazias para remover toda a proteção.</li>
                <li>Marque as caixas para PERMITIR ações específicas (desmarcado = bloqueado).</li>
            </ul>
        </div>
        
        <fieldset class="border border-gray-600 p-4 rounded-lg">
            <legend class="px-2 text-sm font-medium text-gray-300">Permissões (só funcionam com a senha do proprietário):</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-printing" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir impressão
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-copying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir copiar texto/imagens
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-modifying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir modificações
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-annotating" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir anotações
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-filling-forms" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir preenchimento de formulários
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-document-assembly" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir montagem de páginas
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-page-extraction" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir extração de páginas
                </label>
            </div>
        </fieldset>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar alterações</button>
`,

  'pdf-to-markdown': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para Markdown</h2>
        <p class="mb-6 text-gray-400">Converta o texto do PDF em um arquivo Markdown estruturado.</p>
        ${createFileInputHTML({ accept: '.pdf' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div class="hidden mt-4 p-3 bg-gray-900 border border-yellow-500/30 text-yellow-200 rounded-lg" id="quality-note">
            <p class="text-sm text-gray-400"><b>Observação:</b> esta conversão é focada em texto. Tabelas e imagens não serão incluídas.</p>
        </div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Converter para Markdown</button>
    `,
  'txt-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Texto para PDF</h2>
        <p class="mb-6 text-gray-400">Envie arquivos .txt ou digite/cole o conteúdo abaixo para gerar um PDF formatado.</p>
        
        <div class="mb-4">
            <div class="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
                <button id="txt-mode-upload-btn" class="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md">Enviar arquivos</button>
                <button id="txt-mode-text-btn" class="flex-1 btn bg-gray-700 text-gray-300 font-semibold py-2 rounded-md">Digitar texto</button>
            </div>
            
            <div id="txt-upload-panel">
                ${createFileInputHTML({ multiple: true, accept: 'text/plain,.txt', showControls: true })}
                <div id="file-display-area" class="mt-4 space-y-2"></div>
            </div>
            
            <div id="txt-text-panel" class="hidden">
                <textarea id="text-input" rows="12" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" placeholder="Comece a digitar aqui..."></textarea>
            </div>
        </div>
        
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label for="font-family" class="block mb-2 text-sm font-medium text-gray-300">Família de fonte</label>
                <select id="font-family" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="Helvetica">Helvetica</option>
                    <option value="TimesRoman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da fonte</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da página</label>
                <select id="page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="A4">A4</option>
                    <option value="Letter">Carta</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do texto</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Criar PDF</button>
    `,
  'invert-colors': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Inverter cores do PDF</h2>
        <p class="mb-6 text-gray-400">Gere uma versão “modo escuro” invertendo as cores. Funciona melhor em documentos simples de texto/imagem.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Inverter cores e baixar</button>
    `,
  'view-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Ver metadados do PDF</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para visualizar propriedades como título, autor e datas.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="metadata-results" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg"></div>
    `,
  'reverse-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Inverter ordem das páginas</h2>
        <p class="mb-6 text-gray-400">Inverta a ordem das páginas, tornando a última a primeira.</p>
        ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Inverter e baixar</button>
    `,
  'md-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Markdown para PDF</h2>
        <p class="mb-6 text-gray-400">Escreva em Markdown, escolha as opções de formatação e gere um PDF de alta qualidade. <br><strong class="text-gray-300">Observação:</strong> imagens hospedadas na web (https://...) precisam de conexão para serem renderizadas.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label for="page-format" class="block mb-2 text-sm font-medium text-gray-300">Formato da página</label>
                <select id="page-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="a4">A4</option>
                    <option value="letter">Carta</option>
                </select>
            </div>
            <div>
                <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação</label>
                <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="portrait">Retrato</option>
                    <option value="landscape">Paisagem</option>
                </select>
            </div>
            <div>
                <label for="margin-size" class="block mb-2 text-sm font-medium text-gray-300">Margens</label>
                <select id="margin-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="normal">Normal</option>
                    <option value="narrow">Estreita</option>
                    <option value="wide">Larga</option>
                </select>
            </div>
        </div>
        <div class="h-[50vh]">
            <label for="md-input" class="block mb-2 text-sm font-medium text-gray-300">Editor Markdown</label>
            <textarea id="md-input" class="w-full h-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 font-mono resize-none" placeholder="# Bem-vindo ao Markdown..."></textarea>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Gerar PDF a partir do Markdown</button>
    `,
  'svg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">SVG para PDF</h2>
        <p class="mb-6 text-gray-400">Converta uma ou mais imagens SVG em um único PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/svg+xml', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'bmp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">BMP para PDF</h2>
        <p class="mb-6 text-gray-400">Converta imagens BMP em um PDF único.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/bmp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'heic-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">HEIC para PDF</h2>
        <p class="mb-6 text-gray-400">Converta imagens HEIC do iPhone ou câmera em um PDF único.</p>
        ${createFileInputHTML({ multiple: true, accept: '.heic,.heif', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'tiff-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">TIFF para PDF</h2>
        <p class="mb-6 text-gray-400">Converta imagens TIFF (simples ou multipágina) em um único PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/tiff', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'pdf-to-bmp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para BMP</h2>
        <p class="mb-6 text-gray-400">Transforme cada página do PDF em imagem BMP. O download será feito em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para BMP e baixar ZIP</button>
    `,
  'pdf-to-tiff': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para TIFF</h2>
        <p class="mb-6 text-gray-400">Converta cada página do PDF em imagem TIFF de alta qualidade. O download será feito em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para TIFF e baixar ZIP</button>
    `,

  'split-in-half': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Dividir páginas ao meio</h2>
        <p class="mb-6 text-gray-400">Escolha como dividir cada página do documento em duas metades.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="split-half-options" class="hidden mt-6">
            <label for="split-type" class="block mb-2 text-sm font-medium text-gray-300">Tipo de divisão</label>
            <select id="split-type" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6">
                <option value="vertical">Dividir verticalmente (metade esquerda/direita)</option>
                <option value="horizontal">Dividir horizontalmente (parte superior/inferior)</option>
            </select>

            <button id="process-btn" class="btn-gradient w-full mt-6">Dividir PDF</button>
        </div>
    `,
  'page-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Analisar dimensões das páginas</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para ver as dimensões exatas, o formato padrão e a orientação de cada página.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="dimensions-results" class="hidden mt-6">
            <div class="flex justify-end mb-4">
                <label for="units-select" class="text-sm font-medium text-gray-300 self-center mr-3">Unidade de medida:</label>
                <select id="units-select" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                    <option value="pt" selected>Pontos (pt)</option>
                    <option value="in">Polegadas (in)</option>
                    <option value="mm">Milímetros (mm)</option>
                    <option value="px">Pixels (a 96 DPI)</option>
                </select>
            </div>
            <div class="overflow-x-auto rounded-lg border border-gray-700">
                <table class="min-w-full divide-y divide-gray-700 text-sm text-left">
                    <thead class="bg-gray-900">
                        <tr>
                            <th class="px-4 py-3 font-medium text-white">Página #</th>
                            <th class="px-4 py-3 font-medium text-white">Dimensões (L x A)</th>
                            <th class="px-4 py-3 font-medium text-white">Tamanho padrão</th>
                            <th class="px-4 py-3 font-medium text-white">Orientação</th>
                        </tr>
                    </thead>
                    <tbody id="dimensions-table-body" class="divide-y divide-gray-700">
                        </tbody>
                </table>
            </div>
        </div>
    `,

  'n-up': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Distribuição N-Up</h2>
        <p class="mb-6 text-gray-400">Combine várias páginas do PDF em uma única folha — ideal para livretos, provas e visualizações rápidas.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="n-up-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="pages-per-sheet" class="block mb-2 text-sm font-medium text-gray-300">Páginas por folha</label>
                    <select id="pages-per-sheet" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="2">2 páginas (2-up)</option>
                        <option value="4" selected>4 páginas (2x2)</option>
                        <option value="9">9 páginas (3x3)</option>
                        <option value="16">16 páginas (4x4)</option>
                    </select>
                </div>
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da página de saída</label>
                    <select id="output-page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="Letter">Letter (8.5 x 11 in)</option>
                        <option value="Legal">Legal (8.5 x 14 in)</option>
                        <option value="Tabloid">Tabloid (11 x 17 in)</option>
                        <option value="A4" selected>A4 (210 x 297 mm)</option>
                        <option value="A3">A3 (297 x 420 mm)</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação da saída</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>Automática</option>
                        <option value="portrait">Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
                <div class="flex items-end pb-1">
                     <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input type="checkbox" id="add-margins" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Adicionar margens e espaçamentos
                    </label>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center">
                     <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input type="checkbox" id="add-border" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Desenhar borda ao redor de cada página
                    </label>
                </div>
                 <div id="border-color-wrapper" class="hidden">
                    <label for="border-color" class="block mb-2 text-sm font-medium text-gray-300">Cor da borda</label>
                     <input type="color" id="border-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>

            <button id="process-btn" class="btn-gradient w-full mt-6">Gerar PDF N-Up</button>
        </div>
    `,

  'duplicate-organize': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Gerenciar páginas</h2>
        <p class="mb-6 text-gray-400">Arraste as páginas para reorganizá-las. Use o ícone <i data-lucide="copy-plus" class="inline-block w-4 h-4 text-green-400"></i> para duplicar e o <i data-lucide="x-circle" class="inline-block w-4 h-4 text-red-400"></i> para excluir.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="page-manager-options" class="hidden mt-6">
             <div id="page-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6">
                </div>
             <button id="process-btn" class="btn-gradient w-full mt-6">Salvar novo PDF</button>
        </div>
    `,

  'combine-single-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Combinar em uma única página</h2>
        <p class="mb-6 text-gray-400">Una todas as páginas do PDF verticalmente para gerar um único documento rolável.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="combine-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="page-spacing" class="block mb-2 text-sm font-medium text-gray-300">Espaçamento entre páginas (em pontos)</label>
                    <input type="number" id="page-spacing" value="18" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Cor de fundo</label>
                    <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
            <div>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="add-separator" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Desenhar uma linha separadora entre as páginas
                </label>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Combinar páginas</button>
        </div>
    `,

  'fix-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Padronizar dimensões das páginas</h2>
        <p class="mb-6 text-gray-400">Converta todas as páginas do PDF para um tamanho uniforme. Escolha um formato conhecido ou defina medidas personalizadas.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="fix-dimensions-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="target-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho desejado</label>
                    <select id="target-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="Tabloid">Tabloid</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                        <option value="Custom">Tamanho personalizado...</option>
                    </select>
                </div>
                <div>
                    <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação</label>
                    <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="portrait" selected>Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
            </div>

            <div id="custom-size-wrapper" class="hidden p-4 rounded-lg bg-gray-900 border border-gray-700 grid grid-cols-3 gap-3">
                <div>
                    <label for="custom-width" class="block mb-2 text-xs font-medium text-gray-300">Largura</label>
                    <input type="number" id="custom-width" value="8.5" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-height" class="block mb-2 text-xs font-medium text-gray-300">Altura</label>
                    <input type="number" id="custom-height" value="11" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-units" class="block mb-2 text-xs font-medium text-gray-300">Unidade</label>
                    <select id="custom-units" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                        <option value="in">Polegadas</option>
                        <option value="mm">Milímetros</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-300">Método de dimensionamento do conteúdo</label>
                <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        <div>
                            <span class="font-semibold text-white">Ajustar</span>
                            <p class="text-xs text-gray-400">Preserva todo o conteúdo, mas pode gerar barras brancas.</p>
                        </div>
                    </label>
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                         <div>
                            <span class="font-semibold text-white">Preencher</span>
                            <p class="text-xs text-gray-400">Cobre toda a página, podendo cortar o conteúdo.</p>
                        </div>
                    </label>
                </div>
            </div>

             <div>
                <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Cor de fundo (modo “Ajustar”)</label>
                <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>

            <button id="process-btn" class="btn-gradient w-full mt-6">Padronizar páginas</button>
        </div>
    `,

  'change-background-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Alterar cor de fundo</h2>
        <p class="mb-6 text-gray-400">Selecione uma nova cor para todas as páginas do PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="change-background-color-options" class="hidden mt-6">
            <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Escolha a cor de fundo</label>
            <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar cor e baixar</button>
        </div>
    `,

  'change-text-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Alterar cor do texto</h2>
        <p class="mb-6 text-gray-400">Altere a cor dos textos escuros do PDF. Esse processo converte as páginas em imagens, portanto o texto não ficará selecionável no arquivo final.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="text-color-options" class="hidden mt-6 space-y-4">
            <div>
                <label for="text-color-input" class="block mb-2 text-sm font-medium text-gray-300">Selecione a cor do texto</label>
                <input type="color" id="text-color-input" value="#FF0000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">Original</h3>
                    <canvas id="original-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">Prévia</h3>
                    <canvas id="text-color-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar cor e baixar</button>
        </div>
    `,

  'compare-pdfs': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Comparar PDFs</h2>
        <p class="mb-6 text-gray-400">Envie dois arquivos para compará-los visualmente usando sobreposição ou visualização lado a lado.</p>
        
        <div id="compare-upload-area" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="drop-zone-1" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-1" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-scan" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Enviar PDF original</span></p>
                </div>
                <input id="file-input-1" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
            <div id="drop-zone-2" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-2" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-diff" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Enviar PDF revisado</span></p>
                </div>
                <input id="file-input-2" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
        </div>

        <div id="compare-viewer" class="hidden mt-6">
            <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <button id="prev-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
                <span class="text-white font-medium">Página <span id="current-page-display-compare">1</span> de <span id="total-pages-display-compare">1</span></span>
                <button id="next-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div class="bg-gray-700 p-1 rounded-md flex gap-1">
                    <button id="view-mode-overlay" class="btn bg-indigo-600 px-3 py-1 rounded text-sm font-semibold">Sobreposição</button>
                    <button id="view-mode-side" class="btn px-3 py-1 rounded text-sm font-semibold">Lado a lado</button>
                </div>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div id="overlay-controls" class="flex items-center gap-2">
                    <button id="flicker-btn" class="btn bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm font-semibold">Piscar</button>
                    <label for="opacity-slider" class="text-sm font-medium text-gray-300">Opacidade:</label>
                    <input type="range" id="opacity-slider" min="0" max="1" step="0.05" value="0.5" class="w-24">
                </div>
                <div id="side-by-side-controls" class="hidden flex items-center gap-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
                        <input type="checkbox" id="sync-scroll-toggle" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Sincronizar rolagem
                    </label>
                </div>
            </div>
            <div id="compare-viewer-wrapper" class="compare-viewer-wrapper overlay-mode">
                <div id="panel-1" class="pdf-panel"><canvas id="canvas-compare-1"></canvas></div>
                <div id="panel-2" class="pdf-panel"><canvas id="canvas-compare-2"></canvas></div>
            </div>
        </div>
    `,

  'ocr-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">OCR em PDF</h2>
    <p class="mb-6 text-gray-400">Converta PDFs digitalizados em documentos pesquisáveis. Selecione um ou mais idiomas presentes no arquivo para obter melhor precisão.</p>
    
    <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
        <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
        <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
            <li><strong class="text-white">Extração de texto:</strong> utiliza o Tesseract OCR para reconhecer texto em imagens ou PDFs escaneados.</li>
            <li><strong class="text-white">PDF pesquisável:</strong> gera um novo PDF com camada invisível de texto, preservando o visual original.</li>
            <li><strong class="text-white">Filtro de caracteres:</strong> use listas permitidas para ignorar símbolos indesejados e aumentar a precisão em notas fiscais, formulários etc.</li>
            <li><strong class="text-white">Suporte multilíngue:</strong> selecione vários idiomas para documentos com conteúdo misto.</li>
        </ul>
    </div>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="ocr-options" class="hidden mt-6 space-y-4">
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-300">Idiomas presentes no documento</label>
            <div class="relative">
                <input type="text" id="lang-search" class="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-2.5 mb-2" placeholder="Busque por idiomas...">
                <div id="lang-list" class="max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-900">
                    ${Object.entries(tesseractLanguages)
                      .map(
                        ([code, name]) => `
                        <label class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                            <input type="checkbox" value="${code}" class="lang-checkbox w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                            ${name}
                        </label>
                    `
                      )
                      .join('')}
                </div>
            </div>
             <p class="text-xs text-gray-500 mt-1">Selecionados: <span id="selected-langs-display" class="font-semibold">Nenhum</span></p>
        </div>
        
        <!-- Advanced settings section -->
        <details class="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <summary class="text-sm font-medium text-gray-300 cursor-pointer flex items-center justify-between">
                <span>Configurações avançadas (recomendado para melhorar a precisão)</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform details-icon"></i>
            </summary>
            <div class="mt-4 space-y-4">
                <!-- Resolution Setting -->
                <div>
                    <label for="ocr-resolution" class="block mb-1 text-xs font-medium text-gray-400">Resolução</label>
                    <select id="ocr-resolution" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                        <option value="2.0">Padrão (192 DPI)</option>
                        <option value="3.0" selected>Alta (288 DPI)</option>
                        <option value="4.0">Ultra (384 DPI)</option>
                    </select>
                </div>
                <!-- Binarization Toggle -->
                <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" id="ocr-binarize" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                    Binarizar imagem (aumenta o contraste para digitalizações limpas)
                </label>
                
                <!-- Character Whitelist Presets -->
                <div>
                    <label for="whitelist-preset" class="block mb-1 text-xs font-medium text-gray-400">Modelo de lista permitida</label>
                    <select id="whitelist-preset" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm mb-2">
                        <option value="">Nenhum (todos os caracteres)</option>
                        <option value="alphanumeric">Alfanumérico + pontuação básica</option>
                        <option value="numbers-currency">Números + símbolos monetários</option>
                        <option value="letters-only">Somente letras (A-Z, a-z)</option>
                        <option value="numbers-only">Somente números (0-9)</option>
                        <option value="invoice">Notas fiscais/recibos (números, $, ., -, /)</option>
                        <option value="forms">Formulários (alfanumérico + símbolos comuns)</option>
                        <option value="custom">Personalizado...</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Somente esses caracteres serão reconhecidos. Deixe vazio para aceitar todos.</p>
                </div>
                
                <!-- Character Whitelist Input -->
                <div>
                    <label for="ocr-whitelist" class="block mb-1 text-xs font-medium text-gray-400">Lista de caracteres permitidos (opcional)</label>
                    <input type="text" id="ocr-whitelist" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm" placeholder="ex.: abcdefghijklmnopqrstuvwxyz0123456789$.,">
                    <p class="text-xs text-gray-500 mt-1">Somente esses caracteres serão reconhecidos. Deixe vazio para todos.</p>
                </div>
            </div>
        </details>
        
        <button id="process-btn" class="btn-gradient w-full disabled:opacity-50" disabled>Iniciar OCR</button>
    </div>

    <div id="ocr-progress" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p id="progress-status" class="text-white mb-2">Inicializando...</p>
        <div class="w-full bg-gray-700 rounded-full h-4">
            <div id="progress-bar" class="bg-indigo-600 h-4 rounded-full transition-width duration-300" style="width: 0%"></div>
        </div>
        <pre id="progress-log" class="mt-4 text-xs text-gray-400 max-h-32 overflow-y-auto bg-black p-2 rounded-md"></pre>
    </div>

    <div id="ocr-results" class="hidden mt-6">
        <h3 class="text-xl font-bold text-white mb-2">OCR concluído</h3>
        <p class="mb-4 text-gray-400">Seu PDF pesquisável está pronto. Você também pode copiar ou baixar o texto extraído.</p>
        <div class="relative">
            <textarea id="ocr-text-output" rows="10" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" readonly></textarea>
            <button id="copy-text-btn" class="absolute top-2 right-2 btn bg-gray-700 hover:bg-gray-600 p-2 rounded-md" title="Copiar para a área de transferência">
                <i data-lucide="clipboard-copy" class="w-4 h-4 text-gray-300"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button id="download-txt-btn" class="btn w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600">Baixar como .txt</button>
            <button id="download-searchable-pdf" class="btn w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700">Baixar PDF pesquisável</button>
        </div>
    </div>
`,

  'word-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Word para PDF</h2>
        <p class="mb-6 text-gray-400">Envie um arquivo .docx para gerar um PDF com texto selecionável. Layouts muito complexos podem sofrer ajustes.</p>
        
        <div id="file-input-wrapper">
             <div class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-text" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Clique para selecionar</span> ou arraste e solte</p>
                    <p class="text-xs text-gray-500">Apenas um arquivo .docx</p>
                </div>
                <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </div>
        </div>
        
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Visualizar e converter</button>
    `,

  'sign-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Assinar PDF</h2>
    <p class="mb-6 text-gray-400">Crie sua assinatura, selecione-a e clique no documento para posicionar. É possível arrastar para reposicionar.</p>
    ${createFileInputHTML()}
    
    <div id="signature-editor" class="hidden mt-6">
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
            <div class="flex border-b border-gray-700 mb-4">
                <button id="draw-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-indigo-500 text-white">Desenhar</button>
                <button id="type-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">Digitar</button>
                <button id="upload-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">Enviar</button>
            </div>
            
            <div id="draw-panel">
                <canvas id="signature-draw-canvas" class="bg-white rounded-md cursor-crosshair w-full" height="150"></canvas>
                
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-4 sm:gap-2">
                    <div class="flex items-center gap-2">
                        <label for="signature-color" class="text-sm font-medium text-gray-300">Cor:</label>
                        <input type="color" id="signature-color" value="#22c55e" class="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="clear-draw-btn" class="btn hover:bg-gray-600 text-sm flex-grow sm:flex-grow-0">Limpar</button>
                        <button id="save-draw-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg flex-grow sm:flex-grow-0">Salvar assinatura</button>
                    </div>
                </div>
            </div>

            <div id="type-panel" class="hidden">
                <input type="text" id="signature-text-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="Digite seu nome aqui">
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label for="font-family-select" class="block mb-1 text-xs font-medium text-gray-400">Estilo de fonte</label>
                        <select id="font-family-select" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                            <option value="'Great Vibes', cursive">Assinatura</option>
                            <option value="'Kalam', cursive">Manuscrita</option>
                            <option value="'Dancing Script', cursive">Caligrafia</option>
                            <option value="'Lato', sans-serif">Regular</option>
                            <option value="'Merriweather', serif">Formal</option>
                        </select>
                    </div>
                     <div>
                        <label for="font-size-slider" class="block mb-1 text-xs font-medium text-gray-400">Tamanho (<span id="font-size-value">48</span>px)</label>
                        <input type="range" id="font-size-slider" min="24" max="72" value="32" class="w-full">
                    </div>
                    <div>
                        <label for="font-color-picker" class="block mb-1 text-xs font-medium text-gray-400">Cor</label>
                        <input type="color" id="font-color-picker" value="#22c55e" class="w-full h-[38px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                </div>

                <div id="font-preview" class="p-4 h-[80px] bg-transparent rounded-md flex items-center justify-center text-4xl" style="font-family: 'Great Vibes', cursive; font-size: 32px; color: #22c55e;">Seu Nome</div>
                 
                <div class="flex justify-end mt-4">
                    <button id="save-type-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg">Salvar assinatura</button>
                </div>
            </div>

            <div id="upload-panel" class="hidden">
                <input type="file" id="signature-upload-input" accept="image/png" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                *apenas arquivos PNG
            </div>
            
            <hr class="border-gray-700 my-4">
            <h4 class="text-md font-semibold text-white mb-2">Suas assinaturas salvas</h4>
            <div id="saved-signatures-container" class="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-md min-h-[50px]">
                <p class="text-xs text-gray-500 text-center w-full">As assinaturas salvas aparecerão aqui. Clique em uma para selecionar.</p>
            </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <button id="prev-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
            <span class="text-white font-medium">Página <span id="current-page-display-sign">1</span> de <span id="total-pages-display-sign">1</span></span>
            <button id="next-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-out"></i></button>
            <button id="fit-width-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="minimize"></i></button>
            <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-in"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="undo-btn" class="btn p-2 rounded-full" title="Desfazer última inserção"><i data-lucide="undo-2"></i></button>
        </div>

        <div id="canvas-container-sign" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 h-[60vh] md:h-[80vh]">
            <canvas id="canvas-sign" class="mx-auto"></canvas>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar assinaturas e baixar PDF</button>
`,

  'remove-annotations': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Remover anotações</h2>
    <p class="mb-6 text-gray-400">Escolha os tipos de anotação que deseja excluir de todas as páginas ou de um intervalo específico.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-annotations-options" class="hidden mt-6 space-y-6">
        <div>
            <h3 class="text-lg font-semibold text-white mb-2">1. Escolha as páginas</h3>
            <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="all" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">Todas as páginas</span>
                </label>
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="specific" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">Páginas específicas</span>
                </label>
            </div>
            <div id="page-range-wrapper" class="hidden mt-2">
                 <input type="text" id="page-range-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-3, 5, 8">
                 <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages"></span></p>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold text-white mb-2">2. Selecione os tipos de anotação para remover</h3>
            <div class="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div class="border-b border-gray-700 pb-2">
                    <label class="flex items-center gap-2 font-semibold text-white cursor-pointer">
                        <input type="checkbox" id="select-all-annotations" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                        Selecionar / limpar tudo
                    </label>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Highlight"> Destaque (Highlight)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="StrikeOut"> Tachado (StrikeOut)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Underline"> Sublinhado</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Ink"> Desenho à mão (Ink)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Polygon"> Polígono</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Square"> Quadrado</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Circle"> Círculo</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Line"> Linha / seta</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="PolyLine"> Polilinha</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Link"> Link</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Text"> Texto (nota)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FreeText"> Texto livre</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Popup"> Popup / comentário</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Squiggly"> Ondulado (Squiggly)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Stamp"> Carimbo (Stamp)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Caret"> Marcador (Caret)</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FileAttachment"> Anexo de arquivo</label>    
                </div>
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Remover anotações selecionadas</button>
`,

  cropper: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Recortar PDF</h2>
    <p class="mb-6 text-gray-400">Envie um PDF para recortar visualmente uma ou mais páginas. A ferramenta oferece pré-visualização em tempo real e dois modos de corte distintos.</p>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="cropper-ui-container" class="hidden mt-6">
        
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
            <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li><strong class="text-white">Pré-visualização:</strong> veja a área de corte em tempo real antes de aplicar.</li>
                <li><strong class="text-white">Modo não destrutivo:</strong> padrão. Ajusta os limites da página e “esconde” o conteúdo recortado, mantendo texto e dados originais.</li>
                <li><strong class="text-white">Modo destrutivo:</strong> remove o conteúdo definitivamente ao achatar o PDF. Ideal para máxima privacidade e arquivos menores, porém remove texto selecionável.</li>
            </ul>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div class="flex items-center gap-2">
                 <button id="prev-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <span id="page-info" class="text-white font-medium">Página 0 de 0</span>
                <button id="next-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="destructive-crop-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Ativar corte destrutivo
                </label>
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="apply-to-all-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Aplicar em todas as páginas
                </label>
            </div>
        </div>
        
        <div id="status" class="text-center italic text-gray-400 mb-4">Selecione um arquivo PDF para começar.</div>
        <div id="cropper-container" class="w-full relative overflow-hidden flex items-center justify-center bg-gray-900 rounded-lg border border-gray-600 min-h-[500px]"></div>
        
        <button id="crop-button" class="btn-gradient w-full mt-6" disabled>Cortar e baixar</button>
    </div>
`,

  'form-filler': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Preencher formulário PDF</h2>
    <p class="mb-6 text-gray-400">Envie um PDF com campos interativos e preencha tudo em português. A visualização à direita é atualizada em tempo real.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="form-filler-options" class="hidden mt-6">
        <div class="flex flex-col lg:flex-row gap-4 h-[80vh]">
            
            <!-- Sidebar for form fields -->
            <div class="w-full lg:w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 flex-shrink-0">
                <div id="form-fields-container" class="space-y-4">
                    <div class="p-4 text-center text-gray-400">
                        <p>Envie um arquivo para listar os campos aqui.</p>
                    </div>
                </div>
            </div>

            <!-- PDF Viewer -->
            <div class="w-full lg:w-2/3 flex flex-col items-center gap-4">
                <div class="flex flex-nowrap items-center justify-center gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <button id="prev-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                    </button>
                    <span class="text-white font-medium">
                        Página <span id="current-page-display">1</span> de <span id="total-pages-display">1</span>
                    </span>
                    <button id="next-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>
                    <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                        <i data-lucide="zoom-out"></i>
                    </button>
                    <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                        <i data-lucide="zoom-in"></i>
                    </button>
                </div>

                <div id="pdf-viewer-container" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 flex-grow">
                    <canvas id="pdf-canvas" class="mx-auto max-w-full h-full"></canvas>
                </div>
            </div>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6 hidden">Salvar e baixar</button>
    </div>
`,

  posterize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Transformar PDF em pôster</h2>
    <p class="mb-6 text-gray-400">Divida uma página em várias folhas menores para montar um pôster. Ajuste os parâmetros e acompanhe a grade na prévia.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="posterize-options" class="hidden mt-6 space-y-6">

        <div class="space-y-2">
             <label class="block text-sm font-medium text-gray-300">Prévia da página (<span id="current-preview-page">1</span> / <span id="total-preview-pages">1</span>)</label>
            <div id="posterize-preview-container" class="relative w-full max-w-xl mx-auto bg-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                <button id="prev-preview-page" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-left"></i></button>
                <canvas id="posterize-preview-canvas" class="w-full h-auto rounded-md"></canvas>
                <button id="next-preview-page" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-right"></i></button>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Grade do pôster</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="posterize-rows" class="block mb-2 text-sm font-medium text-gray-300">Linhas</label>
                    <input type="number" id="posterize-rows" value="1" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="posterize-cols" class="block mb-2 text-sm font-medium text-gray-300">Colunas</label>
                    <input type="number" id="posterize-cols" value="2" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Configurações da página de saída</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da página</label>
                    <select id="output-page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                    </select>
                </div>
                <div>
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>Automática (recomendado)</option>
                        <option value="portrait">Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Opções avançadas</h3>
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-300">Escala do conteúdo</label>
                    <div class="flex gap-4 p-2 rounded-lg bg-gray-800">
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                            <div>
                                <span class="font-semibold text-white">Ajustar</span>
                                <p class="text-xs text-gray-400">Preserva todo o conteúdo; pode acrescentar margens.</p>
                            </div>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                             <div>
                                <span class="font-semibold text-white">Preencher (corte)</span>
                                <p class="text-xs text-gray-400">Preenche a folha, podendo cortar parte do conteúdo.</p>
                            </div>
                        </label>
                    </div>
                </div>
                 <div>
                    <label for="overlap" class="block mb-2 text-sm font-medium text-gray-300">Sobreposição (para montagem)</label>
                    <div class="flex items-center gap-2">
                        <input type="number" id="overlap" value="0" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <select id="overlap-units" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                            <option value="pt">Pontos</option>
                            <option value="in">Polegadas</option>
                            <option value="mm">Milímetros</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Intervalo de páginas (opcional)</label>
                    <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-3, 5">
                    <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages">0</span></p>
                </div>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Gerar pôster em PDF</button>
    </div>
`,

  'remove-blank-pages': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Remover páginas em branco</h2>
    <p class="mb-6 text-gray-400">Detecte e exclua páginas vazias (ou quase vazias) do PDF automaticamente. Ajuste a sensibilidade para definir o que conta como “em branco”.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-blank-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="sensitivity-slider" class="block mb-2 text-sm font-medium text-gray-300">
                Sensibilidade (<span id="sensitivity-value">99</span>%)
            </label>
            <input type="range" id="sensitivity-slider" min="80" max="100" value="99" class="w-full">
            <p class="text-xs text-gray-400 mt-1">Sensibilidades mais altas exigem páginas quase vazias para que sejam removidas.</p>
        </div>
        
        <div id="analysis-preview" class="hidden p-4 bg-gray-900 border border-gray-700 rounded-lg">
             <h3 class="text-lg font-semibold text-white mb-2">Resultado da análise</h3>
             <p id="analysis-text" class="text-gray-300"></p>
             <div id="removed-pages-thumbnails" class="mt-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2"></div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">Remover páginas e baixar</button>
    </div>
`,

  'alternate-merge': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Alternar e mesclar páginas</h2>
    <p class="mb-6 text-gray-400">Combine páginas de dois ou mais documentos alternando entre eles. Arraste os arquivos para definir a ordem (ex.: página 1 do Doc A, página 1 do Doc B, página 2 do Doc A...).</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
    
    <div id="alternate-merge-options" class="hidden mt-6">
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li>A ferramenta usa uma página de cada documento na ordem definida abaixo e repete o ciclo até acabar todo o conteúdo.</li>
                <li>Se um documento terminar antes, ele é ignorado e o processo continua com os demais arquivos.</li>
            </ul>
        </div>
        <ul id="alternate-file-list" class="space-y-2"></ul>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Alternar e mesclar PDFs</button>
    </div>
`,

  linearize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Linearizar PDFs (visualização rápida)</h2>
    <p class="mb-6 text-gray-400">Otimize vários PDFs para carregamento mais ágil na web. Todos os arquivos serão baixados em um ZIP.</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })} 
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>Linearizar PDFs e baixar ZIP</button> 
  `,
  'add-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Adicionar anexos ao PDF</h2>
    <p class="mb-6 text-gray-400">Envie primeiro o PDF ao qual deseja anexar arquivos.</p>
    ${createFileInputHTML({ accept: 'application/pdf' })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="attachment-options" class="hidden mt-8">
      <h3 class="text-lg font-semibold text-white mb-3">Envie os arquivos que serão anexados</h3>
      <p class="mb-4 text-gray-400">Selecione um ou mais arquivos para incorporar ao PDF. Aceitamos qualquer formato (imagens, documentos, planilhas etc.).</p>
      
      <label for="attachment-files-input" class="w-full flex justify-center items-center px-6 py-10 bg-gray-900 text-gray-400 rounded-lg border-2 border-dashed border-gray-600 hover:bg-gray-800 hover:border-gray-500 cursor-pointer transition-colors">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span class="mt-2 block text-sm font-medium">Clique para selecionar os arquivos</span>
          <span class="mt-1 block text-xs">Qualquer tipo de arquivo, vários itens permitidos</span>
        </div>
        <input id="attachment-files-input" name="attachment-files" type="file" class="sr-only" multiple>
      </label>

      <div id="attachment-file-list" class="mt-4 space-y-2"></div>

      <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>Incorporar arquivos e baixar</button>
    </div>
  `,
  'extract-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Extrair anexos</h2>
    <p class="mb-6 text-gray-400">Extraia todos os arquivos incorporados de um ou mais PDFs. Os anexos são reunidos em um ZIP.</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <button id="process-btn" class="btn-gradient w-full mt-6">Extrair anexos</button>
  `,
  'edit-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Editar anexos</h2>
    <p class="mb-6 text-gray-400">Visualize, remova ou substitua anexos do seu PDF.</p>
    ${createFileInputHTML({ accept: 'application/pdf' })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="edit-attachments-options" class="hidden mt-6">
      <div id="attachments-list" class="space-y-3 mb-4"></div>
      <button id="process-btn" class="btn-gradient w-full mt-6">Salvar alterações e baixar</button>
    </div>
  `,

  'sanitize-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Sanitizar PDF</h2>
    <p class="mb-6 text-gray-400">Remova informações sensíveis ou desnecessárias antes de compartilhar o PDF. Escolha abaixo os elementos a serem eliminados.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="sanitize-pdf-options" class="hidden mt-6 space-y-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <h3 class="text-lg font-semibold text-white mb-3">Opções de sanitização</h3>
    <div>
            <strong class="font-semibold text-yellow-200">Atenção:</strong>
            Remover <code class="bg-gray-700 px-1 rounded text-white">fontes incorporadas</code> pode quebrar a renderização do texto. Use essa opção apenas se tiver certeza de que o visualizador terá fontes substitutas.
    </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Segurança essencial</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="flatten-forms" name="sanitizeOption" value="flatten-forms" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Achatar campos de formulário</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-metadata" name="sanitizeOption" value="metadata" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover todos os metadados</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-annotations" name="sanitizeOption" value="annotations" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover anotações</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-javascript" name="sanitizeOption" value="javascript" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover JavaScript</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-embedded-files" name="sanitizeOption" value="embeddedFiles" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover arquivos incorporados</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-layers" name="sanitizeOption" value="layers" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover camadas (OCG)</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-links" name="sanitizeOption" value="links" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover links externos</span>
                </label>
            </div>
        </div>

        <div>
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Opções adicionais</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-structure-tree" name="sanitizeOption" value="structure" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover árvore de estrutura</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-markinfo" name="sanitizeOption" value="markinfo" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover informações de marcação</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-fonts" name="sanitizeOption" value="fonts" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white text-sm">Remover fontes incorporadas</span>
                </label>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">Sanitizar PDF e baixar</button>
    </div>
`,

  'remove-restrictions': () => `
  <h2 class="text-2xl font-bold text-white mb-4">Remover restrições do PDF</h2>
  <p class="mb-6 text-gray-400">Libere as permissões de impressão, cópia e edição removendo as restrições de segurança do arquivo.</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="remove-restrictions-options" class="hidden space-y-4 mt-6">
        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2"> Como funciona </h3>
          <p class="text-sm text-gray-300 mb-2">Esta operação:</p>
          <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
            <li>Remove todas as restrições de permissão (impressão, cópia e edição)</li>
            <li>Remove a criptografia mesmo que o arquivo esteja protegido</li>
            <li>Elimina restrições associadas a assinaturas digitais (a assinatura se tornará inválida)</li>
            <li>Gera um PDF totalmente editável e sem bloqueios</li>
          </ul>
      </div>

      <div>
          <label for="owner-password-remove" class="block mb-2 text-sm font-medium text-gray-300">Senha do proprietário (se houver)</label>
          <input type="password" id="owner-password-remove" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Deixe em branco se o PDF não tiver senha">
          <p class="text-xs text-gray-500 mt-1">Informe a senha do proprietário caso o PDF esteja protegido</p>
      </div>

<div class="p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg">
  <h3 class="font-semibold text-base mb-2">Aviso</h3>
  <p class="text-sm text-gray-300 mb-2">Esta ferramenta deve ser usada apenas para finalidades legítimas, como:</p>
  <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
    <li>Remover restrições de PDFs que você possui ou tem autorização para alterar</li>
    <li>Recuperar acesso quando esqueceu a senha de um documento legítimo</li>
    <li>Acessar conteúdo que você adquiriu ou criou legalmente</li>
    <li>Editar documentos para fins corporativos autorizados</li>
    <li>Abrir arquivos para fluxos legítimos de arquivo, conformidade ou recuperação</li>
    <li class="font-semibold">Limitações: esta ferramenta só remove restrições de PDFs com proteção fraca ou sem senha do proprietário. Ela não remove criptografia AES-256 aplicada corretamente.</li>
  </ul>
  <p class="text-sm text-gray-300 mt-3 font-semibold">
    Usar este recurso para violar direitos autorais, infringir propriedade intelectual ou acessar documentos sem autorização pode ser ilegal. Consulte o responsável legal ou o proprietário do arquivo em caso de dúvida.
  </p>
</div>
      <button id="process-btn" class="btn-gradient w-full mt-6">Remover restrições e baixar</button>
  </div>
`,
};
