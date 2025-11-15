import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const CropTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('crop');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.crop.title')}
      </h2>
      <p className="mb-6 text-gray-400">{t('templates.crop.description')}</p>

      <FileInput />

      <div id="crop-editor" className="hidden">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <div id="page-nav" className="flex items-center gap-2"></div>
          <div className="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
          <div id="zoom-controls" className="flex items-center gap-2">
            <button
              id="zoom-out-btn"
              className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              title={t('templates.crop.zoomTitles.out') ?? ''}
            >
              <i data-lucide="zoom-out" className="w-5 h-5"></i>
            </button>
            <button
              id="fit-page-btn"
              className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              title={t('templates.crop.zoomTitles.fit') ?? ''}
            >
              <i data-lucide="minimize" className="w-5 h-5"></i>
            </button>
            <button
              id="zoom-in-btn"
              className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
              title={t('templates.crop.zoomTitles.in') ?? ''}
            >
              <i data-lucide="zoom-in" className="w-5 h-5"></i>
            </button>
          </div>
          <div className="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
          <div id="crop-controls" className="flex items-center gap-2">
            <button
              id="clear-crop-btn"
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              title={t('templates.crop.actions.clearPage.tooltip') ?? ''}
            >
              {t('templates.crop.actions.clearPage.label')}
            </button>
            <button
              id="clear-all-crops-btn"
              className="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              title={t('templates.crop.actions.clearAll.tooltip') ?? ''}
            >
              {t('templates.crop.actions.clearAll.label')}
            </button>
          </div>
        </div>

        <div
          id="canvas-container"
          className="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600"
          style={{ height: '70vh' }}
        >
          <canvas id="canvas-editor" className="mx-auto cursor-crosshair"></canvas>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.crop.submit')}
        </button>
      </div>
    </div>
  );
};
