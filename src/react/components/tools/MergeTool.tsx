import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const MergeTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });

    const logic = toolLogic['merge'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }

    setupFileInputHandler('merge');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.merge.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.merge.description')}
      </p>

      <FileInput multiple showControls />

      <div id="merge-options" className="hidden mt-6">
        <div className="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
          <button
            id="file-mode-btn"
            className="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md"
            type="button"
          >
            {t('templates.merge.modeToggle.file')}
          </button>
          <button
            id="page-mode-btn"
            className="flex-1 btn text-gray-300 font-semibold py-2 rounded-md"
            type="button"
          >
            {t('templates.merge.modeToggle.page')}
          </button>
        </div>

        <div id="file-mode-panel">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.merge.fileMode.heading')}
              </strong>
            </p>
            <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
              <li
                dangerouslySetInnerHTML={{
                  __html: t('templates.merge.fileMode.tips.0', {
                    icon: '<i data-lucide="grip-vertical" class="inline-block w-3 h-3"></i>',
                  }),
                }}
              ></li>
              <li>{t('templates.merge.fileMode.tips.1')}</li>
              <li>{t('templates.merge.fileMode.tips.2')}</li>
            </ul>
          </div>
          <ul id="file-list" className="space-y-2"></ul>
        </div>

        <div id="page-mode-panel" className="hidden">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.merge.pageMode.heading')}
              </strong>
            </p>
            <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
              <li>{t('templates.merge.pageMode.tips.0')}</li>
              <li>{t('templates.merge.pageMode.tips.1')}</li>
            </ul>
          </div>
          <div
            id="page-merge-preview"
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[200px]"
          ></div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6" disabled>
          {t('templates.merge.submit', { defaultValue: 'Unir PDFs' })}
        </button>
      </div>
    </div>
  );
};
