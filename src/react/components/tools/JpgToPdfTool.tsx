import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const JpgToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('jpg-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.jpgToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.jpgToPdf.description')}
      </p>

      <FileInput multiple accept="image/jpeg" showControls />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="jpg-to-pdf-options" className="hidden mt-6">
        <div className="mb-4">
          <label
            htmlFor="jpg-pdf-quality"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.jpgToPdf.qualityLabel')}
          </label>
          <select
            id="jpg-pdf-quality"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            defaultValue="medium"
          >
            <option value="high">
              {t('templates.jpgToPdf.qualityOptions.high')}
            </option>
            <option value="medium">
              {t('templates.jpgToPdf.qualityOptions.medium')}
            </option>
            <option value="low">
              {t('templates.jpgToPdf.qualityOptions.low')}
            </option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {t('templates.jpgToPdf.qualityNote')}
          </p>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.jpgToPdf.submit')}
      </button>
    </div>
  );
};
