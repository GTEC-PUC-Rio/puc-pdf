import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const NUpTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    const logic = toolLogic['n-up'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }
    setupFileInputHandler('n-up');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.nUp.title')}
      </h2>
      <p className="mb-6 text-gray-400">{t('templates.nUp.description')}</p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="n-up-options" className="hidden mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pages-per-sheet"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.nUp.pagesPerSheet')}
            </label>
            <select
              id="pages-per-sheet"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="4"
            >
              <option value="2">2 páginas (2-up)</option>
              <option value="4">4 páginas (2x2)</option>
              <option value="9">9 páginas (3x3)</option>
              <option value="16">16 páginas (4x4)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="output-page-size"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.nUp.outputPageSize')}
            </label>
            <select
              id="output-page-size"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="A4"
            >
              <option value="Letter">Letter (8.5 x 11 in)</option>
              <option value="Legal">Legal (8.5 x 14 in)</option>
              <option value="Tabloid">Tabloid (11 x 17 in)</option>
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="A3">A3 (297 x 420 mm)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="output-orientation"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.nUp.orientationLabel')}
            </label>
            <select
              id="output-orientation"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="auto"
            >
              <option value="auto">Automática</option>
              <option value="portrait">Retrato</option>
              <option value="landscape">Paisagem</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              {t('templates.nUp.marginLabel')}
              <input
                type="checkbox"
                id="add-margins"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="spacing-value"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.nUp.spacingLabel')}
            </label>
            <input
              type="number"
              id="spacing-value"
              defaultValue={4}
              min={0}
              step={0.5}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="margin-value"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.nUp.marginLabel')}
            </label>
            <input
              type="number"
              id="margin-value"
              defaultValue={6}
              min={0}
              step={0.5}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.nUp.submit')}
      </button>
    </div>
  );
};
