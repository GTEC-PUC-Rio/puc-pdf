import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const PdfToJpgTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('pdf-to-jpg');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.pdfToJpg.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.pdfToJpg.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="jpg-preview" className="hidden mt-6">
        <div className="mb-4">
          <label
            htmlFor="jpg-quality"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.pdfToJpg.qualityLabel')}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="jpg-quality"
              min="0.1"
              max="1.0"
              step="0.1"
              defaultValue="0.9"
              className="flex-1"
            />
            <span
              id="jpg-quality-value"
              className="text-white font-medium w-16 text-right"
            >
              {t('templates.imageToPdf.qualityValue', { defaultValue: '90%' })}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {t('templates.pdfToJpg.qualityNote')}
          </p>
        </div>
        <p className="mb-4 text-white text-center">
          {t('templates.pdfToJpg.helper')}
        </p>
        <button id="process-btn" className="btn-gradient w-full">
          {t('templates.pdfToJpg.submit')}
        </button>
      </div>
    </div>
  );
};
