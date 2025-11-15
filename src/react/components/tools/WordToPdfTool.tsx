import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const WordToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('word-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.wordToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.wordToPdf.description')}
      </p>

      <div id="file-input-wrapper">
        <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <i data-lucide="file-text" className="w-10 h-10 mb-3 text-gray-400"></i>
            <p className="mb-2 text-sm text-gray-400">
              {t('templates.wordToPdf.uploader.instructions')}
            </p>
            <p className="text-xs text-gray-500">
              {t('templates.wordToPdf.uploader.hint')}
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
      </div>

      <div id="file-display-area" className="mt-4 space-y-2"></div>
      <button id="process-btn" className="btn-gradient w-full mt-6" disabled>
        {t('templates.wordToPdf.submit')}
      </button>
    </div>
  );
};
