import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const FormFillerTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('form-filler');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.formFiller.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.formFiller.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="form-filler-options" className="hidden mt-6">
        <div className="flex flex-col lg:flex-row gap-4 h-[80vh]">
          <div className="w-full lg:w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 flex-shrink-0">
            <div id="form-fields-container" className="space-y-4">
              <div className="p-4 text-center text-gray-400">
                <p>{t('templates.formFiller.emptyState')}</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col items-center gap-4">
            <div className="flex flex-nowrap items-center justify-center gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <button
                id="prev-page"
                className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                <i data-lucide="chevron-left" className="w-5 h-5"></i>
              </button>
              <span
                className="text-white font-medium"
                dangerouslySetInnerHTML={{
                  __html: t('templates.formFiller.viewer.pageIndicator', {
                    current: '<span id="current-page-display">1</span>',
                    total: '<span id="total-pages-display">1</span>',
                  }) as string,
                }}
              ></span>
              <button
                id="next-page"
                className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                <i data-lucide="chevron-right" className="w-5 h-5"></i>
              </button>
              <button
                id="zoom-out-btn"
                className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <i data-lucide="zoom-out"></i>
              </button>
              <button
                id="zoom-in-btn"
                className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <i data-lucide="zoom-in"></i>
              </button>
            </div>

            <div
              id="pdf-viewer-container"
              className="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 flex-grow"
            >
              <canvas id="pdf-canvas" className="mx-auto max-w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6 hidden">
          {t('templates.formFiller.submit')}
        </button>
      </div>
    </div>
  );
};
