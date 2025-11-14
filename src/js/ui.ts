import { resetState } from './state.js';
import { formatBytes } from './utils/helpers.js';
import { tesseractLanguages } from './config/tesseract-languages.js';
import { icons, createIcons } from 'lucide';
import Sortable from 'sortablejs';
import { t } from '../i18n/index.js';

// Centralizing DOM element selection
export const dom = {
  gridView: document.getElementById('grid-view'),
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

export const showLoader = (text = t('loading', { ns: 'alerts' })) => {
  dom.loaderText.textContent = text;
  dom.loaderModal.classList.remove('hidden');
};

export const hideLoader = () => dom.loaderModal.classList.add('hidden');

export const showAlert = (
  title: any = t('defaultTitle', { ns: 'alerts' }),
  message: any = t('defaultMessage', { ns: 'alerts' })
) => {
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
  showLoader(t('generatingPreviews', { ns: 'alerts' }));

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
  const fileHint = multiple
    ? t('upload.multiHint')
    : t('upload.singleHint');

  return `
        <div id="drop-zone" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700 transition-colors duration-300">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i data-lucide="upload-cloud" class="w-10 h-10 mb-3 text-gray-400"></i>
                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">${t(
                  'upload.ctaPrimary'
                )}</span> ${t('upload.ctaSecondary')}</p>
                <p class="text-xs text-gray-500">${fileHint}</p>
                <p class="text-xs text-gray-500">${t('upload.privacy')}</p>
            </div>
            <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" ${multiple} accept="${acceptedFiles}">
        </div>
        
        ${
          showControls
            ? `
            <!-- NEW: Add control buttons for multi-file uploads -->
            <div id="file-controls" class="hidden mt-4 flex gap-3">
                <button id="add-more-btn" class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="plus"></i> ${t('upload.addMore')}
                </button>
                <button id="clear-files-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="x"></i> ${t('upload.clearAll')}
                </button>
            </div>
        `
            : ''
        }
    `;
};

export const toolTemplates = {
  merge: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.merge.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.merge.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ multiple: true, showControls: true })} 

    <div id="merge-options" class="hidden mt-6">
        <div class="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
            <button id="file-mode-btn" class="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md">${t(
              'templates.merge.modeToggle.file',
              { ns: 'tools' }
            )}</button>
            <button id="page-mode-btn" class="flex-1 btn text-gray-300 font-semibold py-2 rounded-md">${t(
              'templates.merge.modeToggle.page',
              { ns: 'tools' }
            )}</button>
        </div>

        <div id="file-mode-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.merge.fileMode.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>${t('templates.merge.fileMode.tips.0', {
                      ns: 'tools',
                      icon:
                        '<i data-lucide="grip-vertical" class="inline-block w-3 h-3"></i>',
                    })}</li>
                    <li>${t('templates.merge.fileMode.tips.1', {
                      ns: 'tools',
                    })}</li>
                    <li>${t('templates.merge.fileMode.tips.2', {
                      ns: 'tools',
                    })}</li>
                </ul>
            </div>
            <ul id="file-list" class="space-y-2"></ul>
        </div>

        <div id="page-mode-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.merge.pageMode.heading',
                  { ns: 'tools' }
                )}</strong></p>
                 <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>${t('templates.merge.pageMode.tips.0', {
                      ns: 'tools',
                    })}</li>
                    <li>${t('templates.merge.pageMode.tips.1', {
                      ns: 'tools',
                    })}</li>
                </ul>
            </div>
             <div id="page-merge-preview" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[200px]"></div>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Unir PDFs</button>
    </div>
`,

  split: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.split.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.split.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="split-options" class="hidden mt-6">
        
        <label for="split-mode" class="block mb-2 text-sm font-medium text-gray-300">${t(
          'templates.split.modeLabel',
          { ns: 'tools' }
        )}</label>
        <select id="split-mode" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4">
            <option value="range">${t('templates.split.modeOptions.range', {
              ns: 'tools',
            })}</option>
            <option value="even-odd">${t(
              'templates.split.modeOptions.evenOdd',
              { ns: 'tools' }
            )}</option>
            <option value="all">${t('templates.split.modeOptions.all', {
              ns: 'tools',
            })}</option>
            <option value="visual">${t('templates.split.modeOptions.visual', {
              ns: 'tools',
            })}</option>
            <option value="bookmarks">${t(
              'templates.split.modeOptions.bookmarks',
              { ns: 'tools' }
            )}</option>
            <option value="n-times">${t(
              'templates.split.modeOptions.nTimes',
              { ns: 'tools' }
            )}</option>
        </select>

        <div id="range-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.split.rangePanel.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>${t('templates.split.rangePanel.tips.0', {
                      ns: 'tools',
                    })}</li>
                    <li>${t('templates.split.rangePanel.tips.1', {
                      ns: 'tools',
                    })}</li>
                    <li>${t('templates.split.rangePanel.tips.2', {
                      ns: 'tools',
                    })}</li>
                </ul>
            </div>
            <p class="mb-2 font-medium text-white">${t(
              'templates.split.rangePanel.totalPages',
              { ns: 'tools' }
            )} <span id="total-pages"></span></p>
            <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.split.rangePanel.inputLabel',
              { ns: 'tools' }
            )}</label>
            <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
              'templates.split.rangePanel.placeholder',
              { ns: 'tools' }
            )}">
        </div>

        <div id="even-odd-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.split.evenOddPanel.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <p class="text-xs text-gray-400 mt-1">${t(
                  'templates.split.evenOddPanel.description',
                  { ns: 'tools' }
                )}</p>
            </div>
            <div class="flex gap-4">
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="odd" checked class="hidden">
                    <span class="font-semibold text-white">${t(
                      'templates.split.evenOddPanel.oddOption',
                      { ns: 'tools' }
                    )}</span>
                </label>
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="even" class="hidden">
                    <span class="font-semibold text-white">${t(
                      'templates.split.evenOddPanel.evenOption',
                      { ns: 'tools' }
                    )}</span>
                </label>
            </div>
        </div>
        
        <div id="visual-select-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.split.visualPanel.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <p class="text-xs text-gray-400 mt-1">${t(
                  'templates.split.visualPanel.description',
                  { ns: 'tools' }
                )}</p>
            </div>
             <div id="page-selector-grid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[150px]"></div>
        </div>

        <div id="all-pages-panel" class="hidden p-3 bg-gray-900 rounded-lg border border-gray-700">
            <p class="text-sm text-gray-300"><strong class="text-white">${t(
              'templates.split.allPagesPanel.heading',
              { ns: 'tools' }
            )}</strong></p>
            <p class="text-xs text-gray-400 mt-1">${t(
              'templates.split.allPagesPanel.description',
              { ns: 'tools' }
            )}</p>
        </div>

        <div id="bookmarks-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.split.bookmarksPanel.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <p class="text-xs text-gray-400 mt-1">${t(
                  'templates.split.bookmarksPanel.description',
                  { ns: 'tools' }
                )}</p>
            </div>
            <div class="mb-4">
                <label for="bookmark-level" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.split.bookmarksPanel.levelLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="bookmark-level" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="0">${t(
                      'templates.split.bookmarksPanel.options.level0',
                      { ns: 'tools' }
                    )}</option>
                    <option value="1">${t(
                      'templates.split.bookmarksPanel.options.level1',
                      { ns: 'tools' }
                    )}</option>
                    <option value="2">${t(
                      'templates.split.bookmarksPanel.options.level2',
                      { ns: 'tools' }
                    )}</option>
                    <option value="3">${t(
                      'templates.split.bookmarksPanel.options.level3',
                      { ns: 'tools' }
                    )}</option>
                    <option value="all" selected>${t(
                      'templates.split.bookmarksPanel.options.all',
                      { ns: 'tools' }
                    )}</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.split.bookmarksPanel.helper',
                  { ns: 'tools' }
                )}</p>
            </div>
        </div>

        <div id="n-times-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">${t(
                  'templates.split.nTimesPanel.heading',
                  { ns: 'tools' }
                )}</strong></p>
                <p class="text-xs text-gray-400 mt-1">${t(
                  'templates.split.nTimesPanel.description',
                  { ns: 'tools' }
                )}</p>
            </div>
            <div class="mb-4">
                <label for="split-n-value" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.split.nTimesPanel.label',
                  { ns: 'tools' }
                )}</label>
                <input type="number" id="split-n-value" min="1" value="5" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.split.nTimesPanel.inputHelper',
                  { ns: 'tools' }
                )}</p>
            </div>
            <div id="n-times-warning" class="hidden p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg mb-3">
                <p class="text-sm text-yellow-200"><strong>${t(
                  'templates.split.nTimesPanel.warningLabel',
                  { ns: 'tools' }
                )}</strong> <span id="n-times-warning-text"></span></p>
            </div>
        </div>
        
        <div id="zip-option-wrapper" class="hidden mt-4">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                <input type="checkbox" id="download-as-zip" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                ${t('templates.split.zipOption', { ns: 'tools' })}
            </label>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.split.submit',
          { ns: 'tools' }
        )}</button>

    </div>
`,
  encrypt: () => `
  <h2 class="text-2xl font-bold text-white mb-4">${t('templates.encrypt.title', {
    ns: 'tools',
  })}</h2>
  <p class="mb-6 text-gray-400">${t('templates.encrypt.description', {
    ns: 'tools',
  })}</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="encrypt-options" class="hidden space-y-4 mt-6">
      <div>
          <label for="user-password-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
            'templates.encrypt.inputs.userLabel',
            { ns: 'tools' }
          )}</label>
          <input required type="password" id="user-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
            'templates.encrypt.inputs.userPlaceholder',
            { ns: 'tools' }
          )}">
          <p class="text-xs text-gray-500 mt-1">${t(
            'templates.encrypt.inputs.userHelper',
            { ns: 'tools' }
          )}</p>
      </div>
      <div>
          <label for="owner-password-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
            'templates.encrypt.inputs.ownerLabel',
            { ns: 'tools' }
          )}</label>
          <input type="password" id="owner-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
            'templates.encrypt.inputs.ownerPlaceholder',
            { ns: 'tools' }
          )}">
          <p class="text-xs text-gray-500 mt-1">${t(
            'templates.encrypt.inputs.ownerHelper',
            { ns: 'tools' }
          )}</p>
      </div>

      <!-- Restriction checkboxes (shown when owner password is entered) -->
      <div id="restriction-options" class="hidden p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 class="font-semibold text-base mb-2 text-white">${t(
          'templates.encrypt.restrictions.heading',
          { ns: 'tools' }
        )}</h3>
        <p class="text-sm text-gray-400 mb-3">${t(
          'templates.encrypt.restrictions.description',
          { ns: 'tools' }
        )}</p>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify" checked>
            <span>${t('templates.encrypt.restrictions.options.modify', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-extract" checked>
            <span>${t('templates.encrypt.restrictions.options.extract', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-print" checked>
            <span>${t('templates.encrypt.restrictions.options.print', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-accessibility">
            <span>${t(
              'templates.encrypt.restrictions.options.accessibility',
              { ns: 'tools' }
            )}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-annotate">
            <span>${t('templates.encrypt.restrictions.options.annotate', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-assemble">
            <span>${t('templates.encrypt.restrictions.options.assemble', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-form">
            <span>${t('templates.encrypt.restrictions.options.form', {
              ns: 'tools',
            })}</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify-other">
            <span>${t(
              'templates.encrypt.restrictions.options.modifyOther',
              { ns: 'tools' }
            )}</span>
          </label>
        </div>
      </div>

      <div class="p-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">${t(
            'templates.encrypt.securityCallout.title',
            { ns: 'tools' }
          )}</h3>
          <p class="text-sm text-gray-300">${t(
            'templates.encrypt.securityCallout.body',
            { ns: 'tools' }
          )}</p>
      </div>
      <div class="p-4 bg-green-900/20 border border-green-500/30 text-green-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">${t(
            'templates.encrypt.qualityCallout.title',
            { ns: 'tools' }
          )}</h3>
          <p class="text-sm text-gray-300">${t(
            'templates.encrypt.qualityCallout.body',
            { ns: 'tools' }
          )}</p>
      </div>
      <button id="process-btn" class="btn-gradient w-full mt-6">${t(
        'templates.encrypt.submit',
        { ns: 'tools' }
      )}</button>
  </div>
`,
  decrypt: () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.decrypt.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.decrypt.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="decrypt-options" class="hidden space-y-4 mt-6">
            <div>
                <label for="password-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.decrypt.passwordLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="password" id="password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                  'templates.decrypt.passwordPlaceholder',
                  { ns: 'tools' }
                )}">
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">${t(
              'templates.decrypt.submit',
              { ns: 'tools' }
            )}</button>
        </div>
        <canvas id="pdf-canvas" class="hidden"></canvas>
    `,
  organize: () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.organize.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.organize.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="page-organizer" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.organize.submit',
          { ns: 'tools' }
        )}</button>
    `,

  rotate: () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.rotate.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.rotate.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        
        <div id="rotate-all-controls" class="hidden my-6">
            <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-gray-400 mb-3 text-center">${t(
                  'templates.rotate.bulkHeading',
                  { ns: 'tools' }
                )}</h3>
                <div class="flex justify-center gap-4">
                    <button id="rotate-all-left-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-ccw" class="mr-2 h-4 w-4"></i>
                        ${t('templates.rotate.buttons.rotateLeft', { ns: 'tools' })}
                    </button>
                    <button id="rotate-all-right-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-cw" class="mr-2 h-4 w-4"></i>
                        ${t('templates.rotate.buttons.rotateRight', { ns: 'tools' })}
                    </button>
                </div>
            </div>
        </div>
        <div id="page-rotator" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.rotate.submit', {
          ns: 'tools',
        })}</button>
    `,

  'add-page-numbers': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.addPageNumbers.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.addPageNumbers.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="pagenum-options" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
                <label for="position" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.addPageNumbers.positionLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="position" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="bottom-center">${t(
                      'templates.addPageNumbers.positionOptions.bottomCenter',
                      { ns: 'tools' }
                    )}</option>
                    <option value="bottom-left">${t(
                      'templates.addPageNumbers.positionOptions.bottomLeft',
                      { ns: 'tools' }
                    )}</option>
                    <option value="bottom-right">${t(
                      'templates.addPageNumbers.positionOptions.bottomRight',
                      { ns: 'tools' }
                    )}</option>
                    <option value="top-center">${t(
                      'templates.addPageNumbers.positionOptions.topCenter',
                      { ns: 'tools' }
                    )}</option>
                    <option value="top-left">${t(
                      'templates.addPageNumbers.positionOptions.topLeft',
                      { ns: 'tools' }
                    )}</option>
                    <option value="top-right">${t(
                      'templates.addPageNumbers.positionOptions.topRight',
                      { ns: 'tools' }
                    )}</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.addPageNumbers.fontSizeLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="number-format" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.addPageNumbers.formatLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="number-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="default">${t(
                      'templates.addPageNumbers.formatOptions.default',
                      { ns: 'tools' }
                    )}</option>
                    <option value="page_x_of_y">${t(
                      'templates.addPageNumbers.formatOptions.pageXofY',
                      { ns: 'tools' }
                    )}</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.addPageNumbers.colorLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.addPageNumbers.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-jpg': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToJpg.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToJpg.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="jpg-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="jpg-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.pdfToJpg.qualityLabel',
                  { ns: 'tools' }
                )}</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="jpg-quality" min="0.1" max="1.0" step="0.1" value="0.9" class="flex-1">
                    <span id="jpg-quality-value" class="text-white font-medium w-16 text-right">${t(
                      'templates.imageToPdf.qualityValue',
                      { ns: 'tools', defaultValue: '90%' }
                    )}</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.pdfToJpg.qualityNote',
                  { ns: 'tools' }
                )}</p>
            </div>
            <p class="mb-4 text-white text-center">${t(
              'templates.pdfToJpg.helper',
              { ns: 'tools' }
            )}</p>
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.pdfToJpg.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'jpg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.jpgToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.jpgToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="jpg-to-pdf-options" class="hidden mt-6">
            <div class="mb-4">
                <label for="jpg-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.jpgToPdf.qualityLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="jpg-pdf-quality" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="high">${t(
                      'templates.jpgToPdf.qualityOptions.high',
                      { ns: 'tools' }
                    )}</option>
                    <option value="medium" selected>${t(
                      'templates.jpgToPdf.qualityOptions.medium',
                      { ns: 'tools' }
                    )}</option>
                    <option value="low">${t(
                      'templates.jpgToPdf.qualityOptions.low',
                      { ns: 'tools' }
                    )}</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.jpgToPdf.qualityNote',
                  { ns: 'tools' }
                )}</p>
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.jpgToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'scan-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.scanToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.scanToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ accept: 'image/*' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.scanToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,

  crop: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.crop.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.crop.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="crop-editor" class="hidden">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div id="page-nav" class="flex items-center gap-2"></div>
            <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="zoom-controls" class="flex items-center gap-2">
                <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="${t(
                  'templates.crop.zoomTitles.out',
                  { ns: 'tools' }
                )}"><i data-lucide="zoom-out" class="w-5 h-5"></i></button>
                <button id="fit-page-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="${t(
                  'templates.crop.zoomTitles.fit',
                  { ns: 'tools' }
                )}"><i data-lucide="minimize" class="w-5 h-5"></i></button>
                <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="${t(
                  'templates.crop.zoomTitles.in',
                  { ns: 'tools' }
                )}"><i data-lucide="zoom-in" class="w-5 h-5"></i></button>
            </div>
             <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="crop-controls" class="flex items-center gap-2">
                 <button id="clear-crop-btn" class="btn bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="${t(
                   'templates.crop.actions.clearPage.tooltip',
                   { ns: 'tools' }
                 )}">${t('templates.crop.actions.clearPage.label', { ns: 'tools' })}</button>
                 <button id="clear-all-crops-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="${t(
                   'templates.crop.actions.clearAll.tooltip',
                   { ns: 'tools' }
                 )}">${t('templates.crop.actions.clearAll.label', { ns: 'tools' })}</button>
            </div>
        </div>
        <div id="canvas-container" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600" style="height: 70vh;">
            <canvas id="canvas-editor" class="mx-auto cursor-crosshair"></canvas>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.crop.submit', {
          ns: 'tools',
        })}</button>
    </div>
`,
  compress: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.compress.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.compress.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ multiple: true, showControls: true })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="compress-options" class="hidden mt-6 space-y-6">
        <div>
            <label for="compression-level" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.compress.levelLabel',
              { ns: 'tools' }
            )}</label>
            <select id="compression-level" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="balanced">${t(
                  'templates.compress.levelOptions.balanced',
                  { ns: 'tools' }
                )}</option>
                <option value="high-quality">${t(
                  'templates.compress.levelOptions.highQuality',
                  { ns: 'tools' }
                )}</option>
                <option value="small-size">${t(
                  'templates.compress.levelOptions.smallSize',
                  { ns: 'tools' }
                )}</option>
                <option value="extreme">${t(
                  'templates.compress.levelOptions.extreme',
                  { ns: 'tools' }
                )}</option>
            </select>
        </div>

        <div>
            <label for="compression-algorithm" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.compress.algorithmLabel',
              { ns: 'tools' }
            )}</label>
            <select id="compression-algorithm" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="vector">${t(
                  'templates.compress.algorithmOptions.vector',
                  { ns: 'tools' }
                )}</option>
                <option value="photon">${t(
                  'templates.compress.algorithmOptions.photon',
                  { ns: 'tools' }
                )}</option>
            </select>
            <p class="mt-2 text-xs text-gray-400">
                ${t('templates.compress.algorithmHelper', { ns: 'tools' })}
            </p>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-4" disabled>${t(
          'templates.compress.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,
  'pdf-to-greyscale': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t(
          'templates.pdfToGreyscale.title',
          { ns: 'tools' }
        )}</h2>
        <p class="mb-6 text-gray-400">${t(
          'templates.pdfToGreyscale.description',
          { ns: 'tools' }
        )}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.pdfToGreyscale.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-zip': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t(
          'templates.pdfToZip.title',
          { ns: 'tools' }
        )}</h2>
        <p class="mb-6 text-gray-400">${t(
          'templates.pdfToZip.description',
          { ns: 'tools' }
        )}</p>
        ${createFileInputHTML({ multiple: true, showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.pdfToZip.submit',
          { ns: 'tools' }
        )}</button>
    `,

  'edit-metadata': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.editMetadata.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.editMetadata.description', {
      ns: 'tools',
    })}</p>
    
    <div class="p-3 mb-6 bg-gray-900 border border-yellow-500/30 text-yellow-200/80 rounded-lg text-sm flex items-start gap-3">
        <i data-lucide="info" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div>
            <strong class="font-semibold text-yellow-200">${t(
              'templates.editMetadata.importantHeading',
              { ns: 'tools' }
            )}</strong>
            ${t('templates.editMetadata.importantBody', { ns: 'tools' })}
        </div>
    </div>

    ${createFileInputHTML()}
    
    <div id="metadata-form" class="hidden mt-6 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="meta-title" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.title',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-title" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-author" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.author',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-author" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-subject" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.subject',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-subject" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-keywords" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.keywords',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-keywords" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-creator" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.creator',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-creator" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-producer" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.producer',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="meta-producer" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-creation-date" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.creationDate',
                  { ns: 'tools' }
                )}</label>
                <input type="datetime-local" id="meta-creation-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-mod-date" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.editMetadata.fields.modDate',
                  { ns: 'tools' }
                )}</label>
                <input type="datetime-local" id="meta-mod-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>

        <div id="custom-metadata-container" class="space-y-3 pt-4 border-t border-gray-700">
             <h3 class="text-lg font-semibold text-white">${t('templates.editMetadata.actions.title', {
               ns: 'tools',
             })}</h3>
             <p class="text-sm text-gray-400 -mt-2">${t('templates.editMetadata.actions.note', {
               ns: 'tools',
             })}</p>
        </div>
        <button id="add-custom-meta-btn" class="btn border border-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            <i data-lucide="plus"></i> ${t('templates.editMetadata.actions.addField', {
              ns: 'tools',
            })}
        </button>
        
    </div>

    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.editMetadata.actions.submit',
      { ns: 'tools' }
    )}</button>
`,

  'remove-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.removeMetadata.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.removeMetadata.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">${t(
          'templates.removeMetadata.submit',
          { ns: 'tools' }
        )}</button>
    `,
  flatten: () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.flattenPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.flattenPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div class="hidden mt-6 space-y-3" id="flatten-info">
            <h3 class="text-sm font-semibold text-gray-300">${t('templates.flattenPdf.infoHeading', {
              ns: 'tools',
            })}</h3>
            <ul class="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>${t('templates.flattenPdf.infoItems.0', { ns: 'tools' })}</li>
              <li>${t('templates.flattenPdf.infoItems.1', { ns: 'tools' })}</li>
              <li>${t('templates.flattenPdf.infoItems.2', { ns: 'tools' })}</li>
            </ul>
        </div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">${t(
          'templates.flattenPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-png': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToPng.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToPng.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="png-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="png-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.pdfToPng.qualityLabel',
                  { ns: 'tools' }
                )}</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="png-quality" min="1.0" max="4.0" step="0.5" value="2.0" class="flex-1">
                    <span id="png-quality-value" class="text-white font-medium w-16 text-right">2.0x</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.pdfToPng.qualityNote',
                  { ns: 'tools' }
                )}</p>
            </div>
            <p class="mb-4 text-white text-center">${t('templates.pdfToPng.helper', {
              ns: 'tools',
            })}</p>
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.pdfToPng.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'png-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pngToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pngToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/png', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="png-to-pdf-options" class="hidden mt-6">
            <div class="mb-4">
                <label for="png-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.pngToPdf.qualityLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="png-pdf-quality" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="high">${t(
                      'templates.pngToPdf.qualityOptions.high',
                      { ns: 'tools' }
                    )}</option>
                    <option value="medium" selected>${t(
                      'templates.pngToPdf.qualityOptions.medium',
                      { ns: 'tools' }
                    )}</option>
                    <option value="low">${t(
                      'templates.pngToPdf.qualityOptions.low',
                      { ns: 'tools' }
                    )}</option>
                </select>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.pngToPdf.qualityNote',
                  { ns: 'tools' }
                )}</p>
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.pngToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-webp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToWebp.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToWebp.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="webp-preview" class="hidden mt-6">
            <div class="mb-4">
                <label for="webp-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.pdfToWebp.qualityLabel',
                  { ns: 'tools' }
                )}</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="webp-quality" min="0.1" max="1.0" step="0.1" value="0.9" class="flex-1">
                    <span id="webp-quality-value" class="text-white font-medium w-16 text-right">${t(
                      'templates.imageToPdf.qualityValue',
                      { ns: 'tools', defaultValue: '90%' }
                    )}</span>
                </div>
                <p class="mt-1 text-xs text-gray-400">${t(
                  'templates.pdfToWebp.qualityNote',
                  { ns: 'tools' }
                )}</p>
            </div>
            <p class="mb-4 text-white text-center">${t(
              'templates.pdfToWebp.helper',
              { ns: 'tools' }
            )}</p>
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.pdfToWebp.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'webp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.webpToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.webpToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/webp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.webpToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  edit: () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfEditor.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfEditor.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="embed-pdf-wrapper" class="hidden mt-6 w-full h-[75vh] border border-gray-600 rounded-lg">
            <div id="embed-pdf-container" class="w-full h-full"></div>
        </div>
    `,
  'delete-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.deletePages.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.deletePages.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="delete-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">${t('templates.deletePages.total', {
              ns: 'tools',
            })} <span id="total-pages"></span></p>
            <label for="pages-to-delete" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.deletePages.inputLabel',
              { ns: 'tools' }
            )}</label>
            <input type="text" id="pages-to-delete" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="${t(
              'templates.deletePages.placeholder',
              { ns: 'tools' }
            )}">
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.deletePages.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'add-blank-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.addBlankPage.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.addBlankPage.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="blank-page-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">${t('templates.addBlankPage.total', {
              ns: 'tools',
            })} <span id="total-pages"></span></p>
            <label for="page-number" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.addBlankPage.afterLabel',
              { ns: 'tools' }
            )}</label>
            <input type="number" id="page-number" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="${t(
              'templates.addBlankPage.afterPlaceholder',
              { ns: 'tools' }
            )}">
            <label for="page-count" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.addBlankPage.countLabel',
              { ns: 'tools' }
            )}</label>
            <input type="number" id="page-count" min="1" value="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="${t(
              'templates.addBlankPage.countPlaceholder',
              { ns: 'tools' }
            )}">
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.addBlankPage.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'extract-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.extractPages.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.extractPages.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="extract-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">${t('templates.extractPages.total', {
              ns: 'tools',
            })} <span id="total-pages"></span></p>
            <label for="pages-to-extract" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.extractPages.inputLabel',
              { ns: 'tools' }
            )}</label>
            <input type="text" id="pages-to-extract" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="${t(
              'templates.extractPages.placeholder',
              { ns: 'tools' }
            )}">
            <button id="process-btn" class="btn-gradient w-full">${t(
              'templates.extractPages.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,

  'add-watermark': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.watermark.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.watermark.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="watermark-options" class="hidden mt-6 space-y-4">
        <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="text" checked class="hidden">
                <span class="font-semibold text-white">${t('templates.watermark.mode.text', {
                  ns: 'tools',
                })}</span>
            </label>
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="image" class="hidden">
                <span class="font-semibold text-white">${t('templates.watermark.mode.image', {
                  ns: 'tools',
                })}</span>
            </label>
        </div>

        <div id="text-watermark-options">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="watermark-text" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.watermark.textOptions.label',
                      { ns: 'tools' }
                    )}</label>
                    <input type="text" id="watermark-text" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                      'templates.watermark.textOptions.placeholder',
                      { ns: 'tools' }
                    )}">
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.watermark.textOptions.fontSize',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="font-size" value="72" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.watermark.textOptions.textColor',
                      { ns: 'tools' }
                    )}</label>
                    <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
                <div>
                    <label for="opacity-text" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.watermark.textOptions.opacity',
                      { ns: 'tools' }
                    )} (<span id="opacity-value-text">0.3</span>)</label>
                    <input type="range" id="opacity-text" value="0.3" min="0" max="1" step="0.1" class="w-full">
                </div>
            </div>
            <div class="mt-4">
                <label for="angle-text" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.watermark.textOptions.angle',
                  { ns: 'tools' }
                )} (<span id="angle-value-text">0</span>°)</label>
                <input type="range" id="angle-text" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

        <div id="image-watermark-options" class="hidden space-y-4">
            <div>
                <label for="image-watermark-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.watermark.imageOptions.label',
                  { ns: 'tools' }
                )}</label>
                <input type="file" id="image-watermark-input" accept="image/png, image/jpeg" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
            </div>
            <div>
                <label for="opacity-image" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.watermark.imageOptions.opacity',
                  { ns: 'tools' }
                )} (<span id="opacity-value-image">0.3</span>)</label>
                <input type="range" id="opacity-image" value="0.3" min="0" max="1" step="0.1" class="w-full">
            </div>
            <div>
                <label for="angle-image" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.watermark.imageOptions.angle',
                  { ns: 'tools' }
                )} (<span id="angle-value-image">0</span>°)</label>
                <input type="range" id="angle-image" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.watermark.submit',
      { ns: 'tools' }
    )}</button>
`,

  'add-header-footer': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.headerFooter.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.headerFooter.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="header-footer-options" class="hidden mt-6 space-y-4">
        
        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">${t(
              'templates.headerFooter.formatting',
              { ns: 'tools' }
            )}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.headerFooter.pageRange.label',
                      { ns: 'tools' }
                    )}</label>
                    <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                      'templates.headerFooter.pageRange.placeholder',
                      { ns: 'tools' }
                    )}">
                    <p class="text-xs text-gray-400 mt-1">${t(
                      'templates.headerFooter.pageRange.total',
                      { ns: 'tools' }
                    )} <span id="total-pages">0</span></p>
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.headerFooter.fontSize',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="font-size" value="10" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="font-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.headerFooter.fontColor',
                      { ns: 'tools' }
                    )}</label>
                    <input type="color" id="font-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="header-left" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.headers.left',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="header-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-center" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.headers.center',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="header-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-right" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.headers.right',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="header-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="footer-left" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.footers.left',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="footer-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-center" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.footers.center',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="footer-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-right" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.headerFooter.footers.right',
                  { ns: 'tools' }
                )}</label>
                <input type="text" id="footer-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.headerFooter.submit',
      { ns: 'tools' }
    )}</button>
`,

  'image-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.imageToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.imageToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg,image/png,image/webp', showControls: true })}
        <ul id="image-list" class="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        </ul>
        <div id="image-to-pdf-options" class="hidden mt-6">
          <div class="mb-4">
            <label for="image-pdf-quality" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.imageToPdf.qualityLabel',
              { ns: 'tools' }
            )}</label>
            <div class="flex items-center gap-4">
              <input type="range" id="image-pdf-quality" min="0.3" max="1.0" step="0.1" value="0.9" class="flex-1">
              <span id="image-pdf-quality-value" class="text-white font-medium w-16 text-right">${t(
                'templates.imageToPdf.qualityValue',
                { ns: 'tools', defaultValue: '90%' }
              )}</span>
            </div>
            <p class="mt-1 text-xs text-gray-400">${t(
              'templates.imageToPdf.qualityNote',
              { ns: 'tools' }
            )}</p>
          </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.imageToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,

  'change-permissions': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.changePermissions.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.changePermissions.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="permissions-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="current-password" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.changePermissions.currentPasswordLabel',
              { ns: 'tools' }
            )}</label>
            <input type="password" id="current-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
              'templates.changePermissions.currentPasswordPlaceholder',
              { ns: 'tools' }
            )}">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="new-user-password" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.changePermissions.newUserLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="password" id="new-user-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                  'templates.changePermissions.newUserPlaceholder',
                  { ns: 'tools' }
                )}">
            </div>
            <div>
                <label for="new-owner-password" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.changePermissions.newOwnerLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="password" id="new-owner-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                  'templates.changePermissions.newOwnerPlaceholder',
                  { ns: 'tools' }
                )}">
            </div>
        </div>

        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
            <h3 class="font-semibold text-base mb-2">${t(
              'templates.changePermissions.infoHeading',
              { ns: 'tools' }
            )}</h3>
            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>${t('templates.changePermissions.infoItems.0', { ns: 'tools' })}</li>
                <li>${t('templates.changePermissions.infoItems.1', { ns: 'tools' })}</li>
                <li>${t('templates.changePermissions.infoItems.2', { ns: 'tools' })}</li>
                <li>${t('templates.changePermissions.infoItems.3', { ns: 'tools' })}</li>
            </ul>
        </div>
        
        <fieldset class="border border-gray-600 p-4 rounded-lg">
            <legend class="px-2 text-sm font-medium text-gray-300">${t(
              'templates.changePermissions.legend',
              { ns: 'tools' }
            )}</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-printing" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.print', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-copying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.copy', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-modifying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.modify', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-annotating" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.annotate', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-filling-forms" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.fillForms', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-document-assembly" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.assemble', { ns: 'tools' })}
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-page-extraction" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    ${t('templates.changePermissions.permissions.extract', { ns: 'tools' })}
                </label>
            </div>
        </fieldset>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.changePermissions.submit',
      { ns: 'tools' }
    )}</button>
`,

  'pdf-to-markdown': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToMarkdown.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToMarkdown.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ accept: '.pdf' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div class="hidden mt-4 p-3 bg-gray-900 border border-yellow-500/30 text-yellow-200 rounded-lg" id="quality-note">
            <p class="text-sm text-gray-400">${t('templates.pdfToMarkdown.note', {
              ns: 'tools',
            })}</p>
        </div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
          'templates.pdfToMarkdown.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'txt-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.txtToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.txtToPdf.description', {
          ns: 'tools',
        })}</p>
        
        <div class="mb-4">
            <div class="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
                <button id="txt-mode-upload-btn" class="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md">${t(
                  'templates.txtToPdf.tabs.upload',
                  { ns: 'tools' }
                )}</button>
                <button id="txt-mode-text-btn" class="flex-1 btn bg-gray-700 text-gray-300 font-semibold py-2 rounded-md">${t(
                  'templates.txtToPdf.tabs.text',
                  { ns: 'tools' }
                )}</button>
            </div>
            
            <div id="txt-upload-panel">
                ${createFileInputHTML({ multiple: true, accept: 'text/plain,.txt', showControls: true })}
                <div id="file-display-area" class="mt-4 space-y-2"></div>
            </div>
            
            <div id="txt-text-panel" class="hidden">
                <textarea id="text-input" rows="12" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" placeholder="${t(
                  'templates.txtToPdf.textareaPlaceholder',
                  { ns: 'tools' }
                )}"></textarea>
            </div>
        </div>
        
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label for="font-family" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.txtToPdf.form.fontFamily',
                  { ns: 'tools' }
                )}</label>
                <select id="font-family" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="Helvetica">Helvetica</option>
                    <option value="TimesRoman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.txtToPdf.form.fontSize',
                  { ns: 'tools' }
                )}</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="page-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.txtToPdf.form.pageSize',
                  { ns: 'tools' }
                )}</label>
                <select id="page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="A4">A4</option>
                    <option value="Letter">Carta</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.txtToPdf.form.textColor',
                  { ns: 'tools' }
                )}</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.txtToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'invert-colors': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.invertColors.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.invertColors.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
          'templates.invertColors.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'view-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.viewMetadata.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.viewMetadata.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="metadata-results" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">${t(
          'templates.viewMetadata.resultsPlaceholder',
          { ns: 'tools' }
        )}</div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
          'templates.viewMetadata.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'reverse-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.reversePages.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.reversePages.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
          'templates.reversePages.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'md-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.mdToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.mdToPdf.description', {
          ns: 'tools',
        })}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label for="page-format" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.mdToPdf.options.pageFormat',
                  { ns: 'tools' }
                )}</label>
                <select id="page-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="a4">A4</option>
                    <option value="letter">Carta</option>
                </select>
            </div>
            <div>
                <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.mdToPdf.options.orientation',
                  { ns: 'tools' }
                )}</label>
                <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="portrait">Retrato</option>
                    <option value="landscape">Paisagem</option>
                </select>
            </div>
            <div>
                <label for="margin-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.mdToPdf.options.margins',
                  { ns: 'tools' }
                )}</label>
                <select id="margin-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="normal">Normal</option>
                    <option value="narrow">Estreita</option>
                    <option value="wide">Larga</option>
                </select>
            </div>
        </div>
        <div class="h-[50vh]">
            <label for="md-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.mdToPdf.editorLabel',
              { ns: 'tools' }
            )}</label>
            <textarea id="md-input" class="w-full h-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 font-mono resize-none" placeholder="${t(
              'templates.mdToPdf.editorPlaceholder',
              { ns: 'tools' }
            )}"></textarea>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.mdToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'svg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.svgToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.svgToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/svg+xml', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.svgToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'bmp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.bmpToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.bmpToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/bmp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.bmpToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'heic-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.heicToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.heicToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: '.heic,.heif', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.heicToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'tiff-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.tiffToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.tiffToPdf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/tiff', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.tiffToPdf.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-bmp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToBmp.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToBmp.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.pdfToBmp.submit',
          { ns: 'tools' }
        )}</button>
    `,
  'pdf-to-tiff': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pdfToTiff.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pdfToTiff.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.pdfToTiff.submit',
          { ns: 'tools' }
        )}</button>
    `,

  'split-in-half': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.splitInHalf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.splitInHalf.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="split-half-options" class="hidden mt-6">
            <label for="split-type" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.splitInHalf.typeLabel',
              { ns: 'tools' }
            )}</label>
            <select id="split-type" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6">
                <option value="vertical">${t('templates.splitInHalf.options.vertical', {
                  ns: 'tools',
                })}</option>
                <option value="horizontal">${t('templates.splitInHalf.options.horizontal', {
                  ns: 'tools',
                })}</option>
            </select>

            <button id="process-btn" class="btn-gradient w-full mt-6">${t(
              'templates.splitInHalf.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,
  'page-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.pageDimensions.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.pageDimensions.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="dimensions-results" class="hidden mt-6">
            <div class="flex justify-end mb-4">
                <label for="units-select" class="text-sm font-medium text-gray-300 self-center mr-3">${t(
                  'templates.pageDimensions.unitsLabel',
                  { ns: 'tools' }
                )}</label>
                <select id="units-select" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                    <option value="pt" selected>${t('templates.pageDimensions.units.pt', {
                      ns: 'tools',
                    })}</option>
                    <option value="in">${t('templates.pageDimensions.units.in', {
                      ns: 'tools',
                    })}</option>
                    <option value="mm">${t('templates.pageDimensions.units.mm', {
                      ns: 'tools',
                    })}</option>
                    <option value="px">${t('templates.pageDimensions.units.px', {
                      ns: 'tools',
                    })}</option>
                </select>
            </div>
            <div class="overflow-x-auto rounded-lg border border-gray-700">
                <table class="min-w-full divide-y divide-gray-700 text-sm text-left">
                    <thead class="bg-gray-900">
                        <tr>
                            <th class="px-4 py-3 font-medium text-white">${t(
                              'templates.pageDimensions.tableHeaders.page',
                              { ns: 'tools' }
                            )}</th>
                            <th class="px-4 py-3 font-medium text-white">${t(
                              'templates.pageDimensions.tableHeaders.dimensions',
                              { ns: 'tools' }
                            )}</th>
                            <th class="px-4 py-3 font-medium text-white">${t(
                              'templates.pageDimensions.tableHeaders.size',
                              { ns: 'tools' }
                            )}</th>
                            <th class="px-4 py-3 font-medium text-white">${t(
                              'templates.pageDimensions.tableHeaders.orientation',
                              { ns: 'tools' }
                            )}</th>
                        </tr>
                    </thead>
                    <tbody id="dimensions-table-body" class="divide-y divide-gray-700">
                        </tbody>
                </table>
            </div>
        </div>
    `,

  'n-up': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.nUp.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.nUp.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="n-up-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="pages-per-sheet" class="block mb-2 text-sm font-medium text-gray-300">${t('templates.nUp.pagesPerSheet', {
                      ns: 'tools',
                    })}</label>
                    <select id="pages-per-sheet" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="2">2 páginas (2-up)</option>
                        <option value="4" selected>4 páginas (2x2)</option>
                        <option value="9">9 páginas (3x3)</option>
                        <option value="16">16 páginas (4x4)</option>
                    </select>
                </div>
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">${t('templates.nUp.outputPageSize', {
                      ns: 'tools',
                    })}</label>
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
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">${t('templates.nUp.orientationLabel', {
                      ns: 'tools',
                    })}</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>Automática</option>
                        <option value="portrait">Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
                <div class="flex items-end pb-1">
                     <label class="flex items-center gap-2 text-sm font-medium text-gray-300">${t(
                       'templates.nUp.marginLabel',
                       { ns: 'tools' }
                     )}
                        <input type="checkbox" id="add-margins" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    </label>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="spacing-value" class="block mb-2 text-sm font-medium text-gray-300">${t('templates.nUp.spacingLabel', {
                      ns: 'tools',
                    })}</label>
                    <input type="number" id="spacing-value" value="4" min="0" step="0.5" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="margin-value" class="block mb-2 text-sm font-medium text-gray-300">${t('templates.nUp.marginLabel', {
                      ns: 'tools',
                    })}</label>
                    <input type="number" id="margin-value" value="6" min="0" step="0.5" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.nUp.submit', {
          ns: 'tools',
        })}</button>
    `,

  'duplicate-organize': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.duplicateOrganize.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-3 text-gray-400">${t('templates.duplicateOrganize.description', {
          ns: 'tools',
        })}</p>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
            <span class="inline-flex items-center gap-2">
                <i data-lucide="copy-plus" class="inline-block w-4 h-4 text-green-400"></i>
                ${t('templates.duplicateOrganize.legend.duplicate', { ns: 'tools' })}
            </span>
            <span class="inline-flex items-center gap-2">
                <i data-lucide="x-circle" class="inline-block w-4 h-4 text-red-400"></i>
                ${t('templates.duplicateOrganize.legend.delete', { ns: 'tools' })}
            </span>
        </div>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="page-manager-options" class="hidden mt-6">
             <div id="page-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6">
                </div>
             <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.duplicateOrganize.submit', {
               ns: 'tools',
             })}</button>
        </div>
    `,

  'combine-single-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.combineSinglePage.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.combineSinglePage.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="combine-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="page-spacing" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.combineSinglePage.spacingLabel',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="page-spacing" value="18" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.combineSinglePage.backgroundLabel',
                      { ns: 'tools' }
                    )}</label>
                    <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
            <div>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="add-separator" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    ${t('templates.combineSinglePage.separatorLabel', { ns: 'tools' })}
                </label>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.combineSinglePage.submit', {
              ns: 'tools',
            })}</button>
        </div>
    `,

  'fix-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.fixDimensions.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.fixDimensions.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="fix-dimensions-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="target-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.fixDimensions.targetSize.label',
                      { ns: 'tools' }
                    )}</label>
                    <select id="target-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="Tabloid">Tabloid</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                        <option value="Custom">${t('templates.fixDimensions.targetSize.custom', {
                          ns: 'tools',
                        })}</option>
                    </select>
                </div>
                <div>
                    <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.fixDimensions.orientation.label',
                      { ns: 'tools' }
                    )}</label>
                    <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="portrait" selected>${t(
                          'templates.fixDimensions.orientation.options.portrait',
                          { ns: 'tools' }
                        )}</option>
                        <option value="landscape">${t('templates.fixDimensions.orientation.options.landscape', {
                          ns: 'tools',
                        })}</option>
                    </select>
                </div>
            </div>

            <div id="custom-size-wrapper" class="hidden p-4 rounded-lg bg-gray-900 border border-gray-700 grid grid-cols-3 gap-3">
                <div>
                    <label for="custom-width" class="block mb-2 text-xs font-medium text-gray-300">${t(
                      'templates.fixDimensions.customSize.width',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="custom-width" value="8.5" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-height" class="block mb-2 text-xs font-medium text-gray-300">${t(
                      'templates.fixDimensions.customSize.height',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="custom-height" value="11" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-units" class="block mb-2 text-xs font-medium text-gray-300">${t(
                      'templates.fixDimensions.customSize.units.label',
                      { ns: 'tools' }
                    )}</label>
                    <select id="custom-units" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                        <option value="in">${t('templates.fixDimensions.customSize.units.options.in', {
                          ns: 'tools',
                        })}</option>
                        <option value="mm">${t('templates.fixDimensions.customSize.units.options.mm', {
                          ns: 'tools',
                        })}</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.fixDimensions.scaling.label',
                  { ns: 'tools' }
                )}</label>
                <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        <div>
                            <span class="font-semibold text-white">${t('templates.fixDimensions.scaling.fit.title', {
                              ns: 'tools',
                            })}</span>
                            <p class="text-xs text-gray-400">${t(
                              'templates.fixDimensions.scaling.fit.description',
                              { ns: 'tools' }
                            )}</p>
                        </div>
                    </label>
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                         <div>
                            <span class="font-semibold text-white">${t('templates.fixDimensions.scaling.fill.title', {
                              ns: 'tools',
                            })}</span>
                            <p class="text-xs text-gray-400">${t(
                              'templates.fixDimensions.scaling.fill.description',
                              { ns: 'tools' }
                            )}</p>
                        </div>
                    </label>
                </div>
            </div>

             <div>
                <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.fixDimensions.backgroundLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>

            <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.fixDimensions.submit', {
              ns: 'tools',
            })}</button>
        </div>
    `,

  'change-background-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.changeBackgroundColor.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.changeBackgroundColor.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="change-background-color-options" class="hidden mt-6">
            <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.changeBackgroundColor.colorLabel',
              { ns: 'tools' }
            )}</label>
            <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            <button id="process-btn" class="btn-gradient w-full mt-6">${t(
              'templates.changeBackgroundColor.submit',
              { ns: 'tools' }
            )}</button>
        </div>
    `,

  'change-text-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.changeTextColor.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.changeTextColor.description', {
          ns: 'tools',
        })}</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="text-color-options" class="hidden mt-6 space-y-4">
            <div>
                <label for="text-color-input" class="block mb-2 text-sm font-medium text-gray-300">${t(
                  'templates.changeTextColor.colorLabel',
                  { ns: 'tools' }
                )}</label>
                <input type="color" id="text-color-input" value="#FF0000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">${t(
                      'templates.changeTextColor.originalPreview',
                      { ns: 'tools' }
                    )}</h3>
                    <canvas id="original-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">${t(
                      'templates.changeTextColor.processedPreview',
                      { ns: 'tools' }
                    )}</h3>
                    <canvas id="text-color-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">${t('templates.changeTextColor.submit', {
              ns: 'tools',
            })}</button>
        </div>
    `,

  'compare-pdfs': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.comparePdfs.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.comparePdfs.description', {
          ns: 'tools',
        })}</p>
        
        <div id="compare-upload-area" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="drop-zone-1" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-1" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-scan" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">${t(
                      'templates.comparePdfs.dropzones.original',
                      { ns: 'tools' }
                    )}</span></p>
                </div>
                <input id="file-input-1" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
            <div id="drop-zone-2" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-2" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-diff" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">${t(
                      'templates.comparePdfs.dropzones.revised',
                      { ns: 'tools' }
                    )}</span></p>
                </div>
                <input id="file-input-2" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
        </div>

        <div id="compare-viewer" class="hidden mt-6">
            <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <button id="prev-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
                <span class="text-white font-medium">${t('templates.comparePdfs.pageIndicator', {
                  ns: 'tools',
                  current: '<span id="current-page-display-compare">1</span>',
                  total: '<span id="total-pages-display-compare">1</span>',
                })}</span>
                <button id="next-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div class="bg-gray-700 p-1 rounded-md flex gap-1">
                    <button id="view-mode-overlay" class="btn bg-indigo-600 px-3 py-1 rounded text-sm font-semibold">${t(
                      'templates.comparePdfs.viewModes.overlay',
                      { ns: 'tools' }
                    )}</button>
                    <button id="view-mode-side" class="btn px-3 py-1 rounded text-sm font-semibold">${t(
                      'templates.comparePdfs.viewModes.sideBySide',
                      { ns: 'tools' }
                    )}</button>
                </div>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div id="overlay-controls" class="flex items-center gap-2">
                    <button id="flicker-btn" class="btn bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm font-semibold">${t(
                      'templates.comparePdfs.controls.flicker',
                      { ns: 'tools' }
                    )}</button>
                    <label for="opacity-slider" class="text-sm font-medium text-gray-300">${t(
                      'templates.comparePdfs.controls.opacity',
                      { ns: 'tools' }
                    )}</label>
                    <input type="range" id="opacity-slider" min="0" max="1" step="0.05" value="0.5" class="w-24">
                </div>
                <div id="side-by-side-controls" class="hidden flex items-center gap-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
                        <input type="checkbox" id="sync-scroll-toggle" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        ${t('templates.comparePdfs.controls.syncScroll', { ns: 'tools' })}
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
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.ocrPdf.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.ocrPdf.description', {
      ns: 'tools',
    })}</p>
    
    <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
        <p class="text-sm text-gray-300"><strong class="text-white">${t(
          'templates.ocrPdf.info.heading',
          { ns: 'tools' }
        )}</strong></p>
        <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
            <li><strong class="text-white">${t('templates.ocrPdf.info.items.textExtraction.title', {
              ns: 'tools',
            })}:</strong> ${t('templates.ocrPdf.info.items.textExtraction.description', {
              ns: 'tools',
            })}</li>
            <li><strong class="text-white">${t('templates.ocrPdf.info.items.searchablePdf.title', {
              ns: 'tools',
            })}:</strong> ${t('templates.ocrPdf.info.items.searchablePdf.description', {
              ns: 'tools',
            })}</li>
            <li><strong class="text-white">${t('templates.ocrPdf.info.items.characterFilter.title', {
              ns: 'tools',
            })}:</strong> ${t('templates.ocrPdf.info.items.characterFilter.description', {
              ns: 'tools',
            })}</li>
            <li><strong class="text-white">${t('templates.ocrPdf.info.items.multiLanguage.title', {
              ns: 'tools',
            })}:</strong> ${t('templates.ocrPdf.info.items.multiLanguage.description', {
              ns: 'tools',
            })}</li>
        </ul>
    </div>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="ocr-options" class="hidden mt-6 space-y-4">
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-300">${t(
              'templates.ocrPdf.languageSelect.label',
              { ns: 'tools' }
            )}</label>
            <div class="relative">
                <input type="text" id="lang-search" class="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-2.5 mb-2" placeholder="${t(
                  'templates.ocrPdf.languageSelect.placeholder',
                  { ns: 'tools' }
                )}">
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
             <p class="text-xs text-gray-500 mt-1">${t('templates.ocrPdf.languageSelect.selectedLabel', {
               ns: 'tools',
             })} <span id="selected-langs-display" class="font-semibold">${t(
               'templates.ocrPdf.languageSelect.noneSelected',
               { ns: 'tools' }
             )}</span></p>
        </div>
        
        <!-- Advanced settings section -->
        <details class="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <summary class="text-sm font-medium text-gray-300 cursor-pointer flex items-center justify-between">
                <span>${t('templates.ocrPdf.advanced.summary', { ns: 'tools' })}</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform details-icon"></i>
            </summary>
            <div class="mt-4 space-y-4">
                <div>
                    <label for="ocr-resolution" class="block mb-1 text-xs font-medium text-gray-400">${t(
                      'templates.ocrPdf.advanced.resolution.label',
                      { ns: 'tools' }
                    )}</label>
                    <select id="ocr-resolution" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                        <option value="2.0">${t('templates.ocrPdf.advanced.resolution.options.standard', {
                          ns: 'tools',
                        })}</option>
                        <option value="3.0" selected>${t('templates.ocrPdf.advanced.resolution.options.high', {
                          ns: 'tools',
                        })}</option>
                        <option value="4.0">${t('templates.ocrPdf.advanced.resolution.options.ultra', {
                          ns: 'tools',
                        })}</option>
                    </select>
                </div>
                <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" id="ocr-binarize" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                    ${t('templates.ocrPdf.advanced.binarize', { ns: 'tools' })}
                </label>
                
                <div>
                    <label for="whitelist-preset" class="block mb-1 text-xs font-medium text-gray-400">${t(
                      'templates.ocrPdf.advanced.whitelistPreset.label',
                      { ns: 'tools' }
                    )}</label>
                    <select id="whitelist-preset" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm mb-2">
                        <option value="">${t('templates.ocrPdf.advanced.whitelistPreset.options.none', {
                          ns: 'tools',
                        })}</option>
                        <option value="alphanumeric">${t(
                          'templates.ocrPdf.advanced.whitelistPreset.options.alphanumeric',
                          { ns: 'tools' }
                        )}</option>
                        <option value="numbers-currency">${t(
                          'templates.ocrPdf.advanced.whitelistPreset.options.numbersCurrency',
                          { ns: 'tools' }
                        )}</option>
                        <option value="letters-only">${t(
                          'templates.ocrPdf.advanced.whitelistPreset.options.lettersOnly',
                          { ns: 'tools' }
                        )}</option>
                        <option value="numbers-only">${t(
                          'templates.ocrPdf.advanced.whitelistPreset.options.numbersOnly',
                          { ns: 'tools' }
                        )}</option>
                        <option value="invoice">${t('templates.ocrPdf.advanced.whitelistPreset.options.invoice', {
                          ns: 'tools',
                        })}</option>
                        <option value="forms">${t('templates.ocrPdf.advanced.whitelistPreset.options.forms', {
                          ns: 'tools',
                        })}</option>
                        <option value="custom">${t('templates.ocrPdf.advanced.whitelistPreset.options.custom', {
                          ns: 'tools',
                        })}</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">${t('templates.ocrPdf.advanced.whitelistInput.helper', {
                      ns: 'tools',
                    })}</p>
                </div>
                
                <div>
                    <label for="ocr-whitelist" class="block mb-1 text-xs font-medium text-gray-400">${t(
                      'templates.ocrPdf.advanced.whitelistInput.label',
                      { ns: 'tools' }
                    )}</label>
                    <input type="text" id="ocr-whitelist" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm" placeholder="${t(
                      'templates.ocrPdf.advanced.whitelistInput.placeholder',
                      { ns: 'tools' }
                    )}">
                    <p class="text-xs text-gray-500 mt-1">${t('templates.ocrPdf.advanced.whitelistInput.helper', {
                      ns: 'tools',
                    })}</p>
                </div>
            </div>
        </details>
        
        <button id="process-btn" class="btn-gradient w-full disabled:opacity-50" disabled>${t(
          'templates.ocrPdf.actions.start',
          { ns: 'tools' }
        )}</button>
    </div>

    <div id="ocr-progress" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p id="progress-status" class="text-white mb-2">${t('templates.ocrPdf.actions.progress', {
          ns: 'tools',
        })}</p>
        <div class="w-full bg-gray-700 rounded-full h-4">
            <div id="progress-bar" class="bg-indigo-600 h-4 rounded-full transition-width duration-300" style="width: 0%"></div>
        </div>
        <pre id="progress-log" class="mt-4 text-xs text-gray-400 max-h-32 overflow-y-auto bg-black p-2 rounded-md"></pre>
    </div>

    <div id="ocr-results" class="hidden mt-6">
        <h3 class="text-xl font-bold text-white mb-2">${t('templates.ocrPdf.actions.resultsTitle', {
          ns: 'tools',
        })}</h3>
        <p class="mb-4 text-gray-400">${t('templates.ocrPdf.actions.resultsDescription', {
          ns: 'tools',
        })}</p>
        <div class="relative">
            <textarea id="ocr-text-output" rows="10" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" readonly></textarea>
            <button id="copy-text-btn" class="absolute top-2 right-2 btn bg-gray-700 hover:bg-gray-600 p-2 rounded-md" title="${t(
              'templates.ocrPdf.actions.copyTooltip',
              { ns: 'tools' }
            )}">
                <i data-lucide="clipboard-copy" class="w-4 h-4 text-gray-300"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button id="download-txt-btn" class="btn w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600">${t(
              'templates.ocrPdf.actions.downloadTxt',
              { ns: 'tools' }
            )}</button>
            <button id="download-searchable-pdf" class="btn w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700">${t(
              'templates.ocrPdf.actions.downloadPdf',
              { ns: 'tools' }
            )}</button>
        </div>
    </div>
`,

  'word-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${t('templates.wordToPdf.title', {
          ns: 'tools',
        })}</h2>
        <p class="mb-6 text-gray-400">${t('templates.wordToPdf.description', {
          ns: 'tools',
        })}</p>
        
        <div id="file-input-wrapper">
             <div class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-text" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400">${t('templates.wordToPdf.uploader.instructions', {
                      ns: 'tools',
                    })}</p>
                    <p class="text-xs text-gray-500">${t('templates.wordToPdf.uploader.hint', {
                      ns: 'tools',
                    })}</p>
                </div>
                <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </div>
        </div>
        
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>${t('templates.wordToPdf.submit', {
          ns: 'tools',
        })}</button>
    `,

  'sign-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.signPdf.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.signPdf.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    
    <div id="signature-editor" class="hidden mt-6">
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
            <div class="flex border-b border-gray-700 mb-4">
                <button id="draw-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-indigo-500 text-white">${t(
                  'templates.signPdf.tabs.draw',
                  { ns: 'tools' }
                )}</button>
                <button id="type-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">${t(
                  'templates.signPdf.tabs.type',
                  { ns: 'tools' }
                )}</button>
                <button id="upload-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">${t(
                  'templates.signPdf.tabs.upload',
                  { ns: 'tools' }
                )}</button>
            </div>
            
            <div id="draw-panel">
                <canvas id="signature-draw-canvas" class="bg-white rounded-md cursor-crosshair w-full" height="150"></canvas>
                
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-4 sm:gap-2">
                    <div class="flex items-center gap-2">
                        <label for="signature-color" class="text-sm font-medium text-gray-300">${t(
                          'templates.signPdf.drawPanel.colorLabel',
                          { ns: 'tools' }
                        )}</label>
                        <input type="color" id="signature-color" value="#22c55e" class="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="clear-draw-btn" class="btn hover:bg-gray-600 text-sm flex-grow sm:flex-grow-0">${t(
                          'templates.signPdf.drawPanel.clear',
                          { ns: 'tools' }
                        )}</button>
                        <button id="save-draw-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg flex-grow sm:flex-grow-0">${t(
                          'templates.signPdf.drawPanel.save',
                          { ns: 'tools' }
                        )}</button>
                    </div>
                </div>
            </div>

            <div id="type-panel" class="hidden">
                <input type="text" id="signature-text-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="${t(
                  'templates.signPdf.typePanel.placeholder',
                  { ns: 'tools' }
                )}">
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label for="font-family-select" class="block mb-1 text-xs font-medium text-gray-400">${t(
                          'templates.signPdf.typePanel.fontLabel',
                          { ns: 'tools' }
                        )}</label>
                        <select id="font-family-select" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                            <option value="'Great Vibes', cursive">${t(
                              'templates.signPdf.typePanel.fontOptions.signature',
                              { ns: 'tools' }
                            )}</option>
                            <option value="'Kalam', cursive">${t(
                              'templates.signPdf.typePanel.fontOptions.handwriting',
                              { ns: 'tools' }
                            )}</option>
                            <option value="'Dancing Script', cursive">${t(
                              'templates.signPdf.typePanel.fontOptions.calligraphy',
                              { ns: 'tools' }
                            )}</option>
                            <option value="'Lato', sans-serif">${t(
                              'templates.signPdf.typePanel.fontOptions.regular',
                              { ns: 'tools' }
                            )}</option>
                            <option value="'Merriweather', serif">${t(
                              'templates.signPdf.typePanel.fontOptions.formal',
                              { ns: 'tools' }
                            )}</option>
                        </select>
                    </div>
                     <div>
                        <label for="font-size-slider" class="block mb-1 text-xs font-medium text-gray-400">${t(
                          'templates.signPdf.typePanel.sizeLabel',
                          {
                            ns: 'tools',
                            value: '<span id="font-size-value">48</span>',
                          }
                        )}</label>
                        <input type="range" id="font-size-slider" min="24" max="72" value="32" class="w-full">
                    </div>
                    <div>
                        <label for="font-color-picker" class="block mb-1 text-xs font-medium text-gray-400">${t(
                          'templates.signPdf.typePanel.colorLabel',
                          { ns: 'tools' }
                        )}</label>
                        <input type="color" id="font-color-picker" value="#22c55e" class="w-full h-[38px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                </div>

                <div id="font-preview" class="p-4 h-[80px] bg-transparent rounded-md flex items-center justify-center text-4xl" style="font-family: 'Great Vibes', cursive; font-size: 32px; color: #22c55e;">${t(
                  'templates.signPdf.typePanel.previewPlaceholder',
                  { ns: 'tools' }
                )}</div>
                 
                <div class="flex justify-end mt-4">
                    <button id="save-type-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg">${t(
                      'templates.signPdf.typePanel.save',
                      { ns: 'tools' }
                    )}</button>
                </div>
            </div>

            <div id="upload-panel" class="hidden">
                <input type="file" id="signature-upload-input" accept="image/png" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                <p class="text-xs text-gray-500 mt-2">${t('templates.signPdf.uploadPanel.note', {
                  ns: 'tools',
                })}</p>
            </div>
            
            <hr class="border-gray-700 my-4">
            <h4 class="text-md font-semibold text-white mb-2">${t(
              'templates.signPdf.savedSignatures.heading',
              { ns: 'tools' }
            )}</h4>
            <div id="saved-signatures-container" class="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-md min-h-[50px]">
                <p class="text-xs text-gray-500 text-center w-full">${t(
                  'templates.signPdf.savedSignatures.helper',
                  { ns: 'tools' }
                )}</p>
            </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <button id="prev-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
            <span class="text-white font-medium">${t('templates.signPdf.viewer.pageIndicator', {
              ns: 'tools',
              current: '<span id="current-page-display-sign">1</span>',
              total: '<span id="total-pages-display-sign">1</span>',
            })}</span>
            <button id="next-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-out"></i></button>
            <button id="fit-width-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="minimize"></i></button>
            <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-in"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="undo-btn" class="btn p-2 rounded-full" title="${t(
              'templates.signPdf.viewer.undoTooltip',
              { ns: 'tools' }
            )}"><i data-lucide="undo-2"></i></button>
        </div>

        <div id="canvas-container-sign" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 h-[60vh] md:h-[80vh]">
            <canvas id="canvas-sign" class="mx-auto"></canvas>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.signPdf.submit',
      { ns: 'tools' }
    )}</button>
`,

  'remove-annotations': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.removeAnnotations.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.removeAnnotations.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-annotations-options" class="hidden mt-6 space-y-6">
        <div>
            <h3 class="text-lg font-semibold text-white mb-2">${t(
              'templates.removeAnnotations.pageSelection.heading',
              { ns: 'tools' }
            )}</h3>
            <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="all" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">${t(
                      'templates.removeAnnotations.pageSelection.all',
                      { ns: 'tools' }
                    )}</span>
                </label>
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="specific" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">${t(
                      'templates.removeAnnotations.pageSelection.specific',
                      { ns: 'tools' }
                    )}</span>
                </label>
            </div>
            <div id="page-range-wrapper" class="hidden mt-2">
                 <input type="text" id="page-range-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                   'templates.removeAnnotations.pageSelection.placeholder',
                   { ns: 'tools' }
                 )}">
                 <p class="text-xs text-gray-400 mt-1">${t(
                   'templates.removeAnnotations.pageSelection.helper',
                   { ns: 'tools', total: '<span id="total-pages"></span>' }
                 )}</p>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold text-white mb-2">${t(
              'templates.removeAnnotations.annotationSelection.heading',
              { ns: 'tools' }
            )}</h3>
            <div class="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div class="border-b border-gray-700 pb-2">
                    <label class="flex items-center gap-2 font-semibold text-white cursor-pointer">
                        <input type="checkbox" id="select-all-annotations" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                        ${t('templates.removeAnnotations.annotationSelection.selectAll', {
                          ns: 'tools',
                        })}
                    </label>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Highlight"> ${t(
                      'templates.removeAnnotations.annotations.highlight',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="StrikeOut"> ${t(
                      'templates.removeAnnotations.annotations.strikeOut',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Underline"> ${t(
                      'templates.removeAnnotations.annotations.underline',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Ink"> ${t(
                      'templates.removeAnnotations.annotations.ink',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Polygon"> ${t(
                      'templates.removeAnnotations.annotations.polygon',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Square"> ${t(
                      'templates.removeAnnotations.annotations.square',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Circle"> ${t(
                      'templates.removeAnnotations.annotations.circle',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Line"> ${t(
                      'templates.removeAnnotations.annotations.line',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="PolyLine"> ${t(
                      'templates.removeAnnotations.annotations.polyLine',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Link"> ${t(
                      'templates.removeAnnotations.annotations.link',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Text"> ${t(
                      'templates.removeAnnotations.annotations.text',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FreeText"> ${t(
                      'templates.removeAnnotations.annotations.freeText',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Popup"> ${t(
                      'templates.removeAnnotations.annotations.popup',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Squiggly"> ${t(
                      'templates.removeAnnotations.annotations.squiggly',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Stamp"> ${t(
                      'templates.removeAnnotations.annotations.stamp',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Caret"> ${t(
                      'templates.removeAnnotations.annotations.caret',
                      { ns: 'tools' }
                    )}</label>
                    <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FileAttachment"> ${t(
                      'templates.removeAnnotations.annotations.fileAttachment',
                      { ns: 'tools' }
                    )}</label>    
                </div>
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${t(
      'templates.removeAnnotations.submit',
      { ns: 'tools' }
    )}</button>
`,

  cropper: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.cropper.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.cropper.description', {
      ns: 'tools',
    })}</p>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="cropper-ui-container" class="hidden mt-6">
        
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
            <p class="text-sm text-gray-300"><strong class="text-white">${t(
              'templates.cropper.infoHeading',
              { ns: 'tools' }
            )}</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li><strong class="text-white">${t(
                  'templates.cropper.infoItems.preview.title',
                  { ns: 'tools' }
                )}:</strong> ${t('templates.cropper.infoItems.preview.description', {
                  ns: 'tools',
                })}</li>
                <li><strong class="text-white">${t(
                  'templates.cropper.infoItems.nonDestructive.title',
                  { ns: 'tools' }
                )}:</strong> ${t('templates.cropper.infoItems.nonDestructive.description', {
                  ns: 'tools',
                })}</li>
                <li><strong class="text-white">${t(
                  'templates.cropper.infoItems.destructive.title',
                  { ns: 'tools' }
                )}:</strong> ${t('templates.cropper.infoItems.destructive.description', {
                  ns: 'tools',
                })}</li>
            </ul>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div class="flex items-center gap-2">
                 <button id="prev-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <span id="page-info" class="text-white font-medium">${t(
                  'templates.cropper.controls.pageIndicator',
                  { ns: 'tools', current: 0, total: 0 }
                )}</span>
                <button id="next-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
            </div>
            
             <div class="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="destructive-crop-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    ${t('templates.cropper.controls.destructive', { ns: 'tools' })}
                </label>
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="apply-to-all-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    ${t('templates.cropper.controls.applyToAll', { ns: 'tools' })}
                </label>
            </div>
        </div>
        
        <div id="status" class="text-center italic text-gray-400 mb-4">${t('templates.cropper.status', {
          ns: 'tools',
        })}</div>
        <div id="cropper-container" class="w-full relative overflow-hidden flex items-center justify-center bg-gray-900 rounded-lg border border-gray-600 min-h-[500px]"></div>
        
        <button id="crop-button" class="btn-gradient w-full mt-6" disabled>${t(
          'templates.cropper.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  'form-filler': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.formFiller.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.formFiller.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="form-filler-options" class="hidden mt-6">
        <div class="flex flex-col lg:flex-row gap-4 h-[80vh]">
            
            <!-- Sidebar for form fields -->
            <div class="w-full lg:w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 flex-shrink-0">
                <div id="form-fields-container" class="space-y-4">
                    <div class="p-4 text-center text-gray-400">
                        <p>${t('templates.formFiller.emptyState', { ns: 'tools' })}</p>
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
                        ${t('templates.formFiller.viewer.pageIndicator', {
                          ns: 'tools',
                          current: '<span id="current-page-display">1</span>',
                          total: '<span id="total-pages-display">1</span>',
                        })}
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
        
        <button id="process-btn" class="btn-gradient w-full mt-6 hidden">${t(
          'templates.formFiller.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  posterize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.posterize.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.posterize.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="posterize-options" class="hidden mt-6 space-y-6">

        <div class="space-y-2">
             <label class="block text-sm font-medium text-gray-300">${t(
               'templates.posterize.previewLabel',
               {
                 ns: 'tools',
                 current: '<span id="current-preview-page">1</span>',
                 total: '<span id="total-preview-pages">1</span>',
               }
             )}</label>
            <div id="posterize-preview-container" class="relative w-full max-w-xl mx-auto bg-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                <button id="prev-preview-page" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-left"></i></button>
                <canvas id="posterize-preview-canvas" class="w-full h-auto rounded-md"></canvas>
                <button id="next-preview-page" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-right"></i></button>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">${t('templates.posterize.gridHeading', {
              ns: 'tools',
            })}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="posterize-rows" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.rowsLabel',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="posterize-rows" value="1" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="posterize-cols" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.colsLabel',
                      { ns: 'tools' }
                    )}</label>
                    <input type="number" id="posterize-cols" value="2" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">${t(
              'templates.posterize.outputHeading',
              { ns: 'tools' }
            )}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.pageSizeLabel',
                      { ns: 'tools' }
                    )}</label>
                    <select id="output-page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                    </select>
                </div>
                <div>
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.orientationLabel',
                      { ns: 'tools' }
                    )}</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>${t(
                          'templates.posterize.orientationOptions.auto',
                          { ns: 'tools' }
                        )}</option>
                        <option value="portrait">${t('templates.posterize.orientationOptions.portrait', {
                          ns: 'tools',
                        })}</option>
                        <option value="landscape">${t('templates.posterize.orientationOptions.landscape', {
                          ns: 'tools',
                        })}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">${t(
              'templates.posterize.advancedHeading',
              { ns: 'tools' }
            )}</h3>
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.scalingLabel',
                      { ns: 'tools' }
                    )}</label>
                    <div class="flex gap-4 p-2 rounded-lg bg-gray-800">
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                            <div>
                                <span class="font-semibold text-white">${t(
                                  'templates.posterize.scalingOptions.fitTitle',
                                  { ns: 'tools' }
                                )}</span>
                                <p class="text-xs text-gray-400">${t(
                                  'templates.posterize.scalingOptions.fitDescription',
                                  { ns: 'tools' }
                                )}</p>
                            </div>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                             <div>
                                <span class="font-semibold text-white">${t(
                                  'templates.posterize.scalingOptions.fillTitle',
                                  { ns: 'tools' }
                                )}</span>
                                <p class="text-xs text-gray-400">${t(
                                  'templates.posterize.scalingOptions.fillDescription',
                                  { ns: 'tools' }
                                )}</p>
                            </div>
                        </label>
                    </div>
                </div>
                 <div>
                    <label for="overlap" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.overlapLabel',
                      { ns: 'tools' }
                    )}</label>
                    <div class="flex items-center gap-2">
                        <input type="number" id="overlap" value="0" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <select id="overlap-units" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                            <option value="pt">${t('templates.posterize.overlapUnits.pt', {
                              ns: 'tools',
                            })}</option>
                            <option value="in">${t('templates.posterize.overlapUnits.in', {
                              ns: 'tools',
                            })}</option>
                            <option value="mm">${t('templates.posterize.overlapUnits.mm', {
                              ns: 'tools',
                            })}</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">${t(
                      'templates.posterize.pageRange.label',
                      { ns: 'tools' }
                    )}</label>
                    <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
                      'templates.posterize.pageRange.placeholder',
                      { ns: 'tools' }
                    )}">
                    <p class="text-xs text-gray-400 mt-1">${t(
                      'templates.posterize.pageRange.helper',
                      {
                        ns: 'tools',
                        total: '<span id="total-pages">0</span>',
                      }
                    )}</p>
                </div>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>${t(
          'templates.posterize.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  'remove-blank-pages': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.removeBlankPages.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.removeBlankPages.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-blank-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="sensitivity-slider" class="block mb-2 text-sm font-medium text-gray-300">
                ${t('templates.removeBlankPages.sensitivityLabel', {
                  ns: 'tools',
                  value: '<span id="sensitivity-value">99</span>',
                })}
            </label>
            <input type="range" id="sensitivity-slider" min="80" max="100" value="99" class="w-full">
            <p class="text-xs text-gray-400 mt-1">${t(
              'templates.removeBlankPages.sensitivityHelper',
              { ns: 'tools' }
            )}</p>
        </div>
        
        <div id="analysis-preview" class="hidden p-4 bg-gray-900 border border-gray-700 rounded-lg">
             <h3 class="text-lg font-semibold text-white mb-2">${t(
               'templates.removeBlankPages.analysisHeading',
               { ns: 'tools' }
             )}</h3>
             <p id="analysis-text" class="text-gray-300"></p>
             <div id="removed-pages-thumbnails" class="mt-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2"></div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.removeBlankPages.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  'alternate-merge': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.alternateMerge.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.alternateMerge.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
    
    <div id="alternate-merge-options" class="hidden mt-6">
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p class="text-sm text-gray-300"><strong class="text-white">${t(
              'templates.alternateMerge.infoHeading',
              { ns: 'tools' }
            )}</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li>${t('templates.alternateMerge.infoItems.0', { ns: 'tools' })}</li>
                <li>${t('templates.alternateMerge.infoItems.1', { ns: 'tools' })}</li>
            </ul>
        </div>
        <ul id="alternate-file-list" class="space-y-2"></ul>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>${t(
          'templates.alternateMerge.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  linearize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.linearize.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.linearize.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })} 
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>${t(
      'templates.linearize.submit',
      { ns: 'tools' }
    )}</button> 
  `,
  'add-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.addAttachments.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.addAttachments.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ accept: 'application/pdf' })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="attachment-options" class="hidden mt-8">
      <h3 class="text-lg font-semibold text-white mb-3">${t(
        'templates.addAttachments.secondaryTitle',
        { ns: 'tools' }
      )}</h3>
      <p class="mb-4 text-gray-400">${t('templates.addAttachments.secondaryDescription', {
        ns: 'tools',
      })}</p>
      
      <label for="attachment-files-input" class="w-full flex justify-center items-center px-6 py-10 bg-gray-900 text-gray-400 rounded-lg border-2 border-dashed border-gray-600 hover:bg-gray-800 hover:border-gray-500 cursor-pointer transition-colors">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span class="mt-2 block text-sm font-medium">${t(
            'templates.addAttachments.dropLabel',
            { ns: 'tools' }
          )}</span>
          <span class="mt-1 block text-xs">${t('templates.addAttachments.dropHint', {
            ns: 'tools',
          })}</span>
        </div>
        <input id="attachment-files-input" name="attachment-files" type="file" class="sr-only" multiple>
      </label>

      <div id="attachment-file-list" class="mt-4 space-y-2"></div>

      <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>${t(
        'templates.addAttachments.submit',
        { ns: 'tools' }
      )}</button>
    </div>
  `,
  'extract-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.extractAttachments.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.extractAttachments.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <button id="process-btn" class="btn-gradient w-full mt-6">${t(
      'templates.extractAttachments.submit',
      { ns: 'tools' }
    )}</button>
  `,
  'edit-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.editAttachments.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.editAttachments.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML({ accept: 'application/pdf' })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="edit-attachments-options" class="hidden mt-6">
      <div id="attachments-list" class="space-y-3 mb-4"></div>
      <button id="process-btn" class="btn-gradient w-full mt-6">${t(
        'templates.editAttachments.submit',
        { ns: 'tools' }
      )}</button>
    </div>
  `,

  'sanitize-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${t('templates.sanitizePdf.title', {
      ns: 'tools',
    })}</h2>
    <p class="mb-6 text-gray-400">${t('templates.sanitizePdf.description', {
      ns: 'tools',
    })}</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="sanitize-pdf-options" class="hidden mt-6 space-y-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <h3 class="text-lg font-semibold text-white mb-3">${t(
          'templates.sanitizePdf.optionsHeading',
          { ns: 'tools' }
        )}</h3>
    <div class="text-sm text-gray-300">
            ${t('templates.sanitizePdf.warning', { ns: 'tools' })}
    </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">${t(
              'templates.sanitizePdf.sections.security',
              { ns: 'tools' }
            )}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="flatten-forms" name="sanitizeOption" value="flatten-forms" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.flattenForms', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-metadata" name="sanitizeOption" value="metadata" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.metadata', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-annotations" name="sanitizeOption" value="annotations" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.annotations', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-javascript" name="sanitizeOption" value="javascript" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.javascript', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-embedded-files" name="sanitizeOption" value="embeddedFiles" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.attachments', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-layers" name="sanitizeOption" value="layers" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.layers', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-links" name="sanitizeOption" value="links" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.links', {
                      ns: 'tools',
                    })}</span>
                </label>
            </div>
        </div>

        <div>
            <h4 class="text-sm font-semibold text-gray-400 mb-2">${t(
              'templates.sanitizePdf.sections.additional',
              { ns: 'tools' }
            )}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-structure-tree" name="sanitizeOption" value="structure" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.structure', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-markinfo" name="sanitizeOption" value="markinfo" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">${t('templates.sanitizePdf.options.markinfo', {
                      ns: 'tools',
                    })}</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-fonts" name="sanitizeOption" value="fonts" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white text-sm">${t('templates.sanitizePdf.options.fonts', {
                      ns: 'tools',
                    })}</span>
                </label>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">${t(
          'templates.sanitizePdf.submit',
          { ns: 'tools' }
        )}</button>
    </div>
`,

  'remove-restrictions': () => `
  <h2 class="text-2xl font-bold text-white mb-4">${t('templates.removeRestrictions.title', {
    ns: 'tools',
  })}</h2>
  <p class="mb-6 text-gray-400">${t('templates.removeRestrictions.description', {
    ns: 'tools',
  })}</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="remove-restrictions-options" class="hidden space-y-4 mt-6">
        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">${t('templates.removeRestrictions.info.heading', {
            ns: 'tools',
          })}</h3>
          <p class="text-sm text-gray-300 mb-2">${t('templates.removeRestrictions.info.body', {
            ns: 'tools',
          })}</p>
          <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
            <li>${t('templates.removeRestrictions.info.items.0', { ns: 'tools' })}</li>
            <li>${t('templates.removeRestrictions.info.items.1', { ns: 'tools' })}</li>
            <li>${t('templates.removeRestrictions.info.items.2', { ns: 'tools' })}</li>
            <li>${t('templates.removeRestrictions.info.items.3', { ns: 'tools' })}</li>
          </ul>
      </div>

      <div>
          <label for="owner-password-remove" class="block mb-2 text-sm font-medium text-gray-300">${t(
            'templates.removeRestrictions.ownerPassword.label',
            { ns: 'tools' }
          )}</label>
          <input type="password" id="owner-password-remove" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="${t(
            'templates.removeRestrictions.ownerPassword.placeholder',
            { ns: 'tools' }
          )}">
          <p class="text-xs text-gray-500 mt-1">${t('templates.removeRestrictions.ownerPassword.helper', {
            ns: 'tools',
          })}</p>
      </div>

<div class="p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg">
  <h3 class="font-semibold text-base mb-2">${t('templates.removeRestrictions.warning.heading', {
    ns: 'tools',
  })}</h3>
  <p class="text-sm text-gray-300 mb-2">${t('templates.removeRestrictions.warning.description', {
    ns: 'tools',
  })}</p>
  <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
    <li>${t('templates.removeRestrictions.warning.items.0', { ns: 'tools' })}</li>
    <li>${t('templates.removeRestrictions.warning.items.1', { ns: 'tools' })}</li>
    <li>${t('templates.removeRestrictions.warning.items.2', { ns: 'tools' })}</li>
    <li>${t('templates.removeRestrictions.warning.items.3', { ns: 'tools' })}</li>
    <li>${t('templates.removeRestrictions.warning.items.4', { ns: 'tools' })}</li>
    <li class="font-semibold">${t('templates.removeRestrictions.warning.items.5', {
      ns: 'tools',
    })}</li>
  </ul>
  <p class="text-sm text-gray-300 mt-3 font-semibold">
    ${t('templates.removeRestrictions.warning.footnote', { ns: 'tools' })}
  </p>
</div>
      <button id="process-btn" class="btn-gradient w-full mt-6">${t(
        'templates.removeRestrictions.submit',
        { ns: 'tools' }
      )}</button>
  </div>
`,
};
