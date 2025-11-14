import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const RotateTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('rotate');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.rotate.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.rotate.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="rotate-all-controls" className="hidden my-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 text-center">
            {t('templates.rotate.bulkHeading')}
          </h3>
          <div className="flex justify-center gap-4">
            <button
              id="rotate-all-left-btn"
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95"
            >
              <i data-lucide="rotate-ccw" className="mr-2 h-4 w-4"></i>
              {t('templates.rotate.buttons.rotateLeft')}
            </button>
            <button
              id="rotate-all-right-btn"
              type="button"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95"
            >
              <i data-lucide="rotate-cw" className="mr-2 h-4 w-4"></i>
              {t('templates.rotate.buttons.rotateRight')}
            </button>
          </div>
        </div>
      </div>

      <div
        id="page-rotator"
        className="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"
      ></div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.rotate.submit')}
      </button>
    </div>
  );
};
