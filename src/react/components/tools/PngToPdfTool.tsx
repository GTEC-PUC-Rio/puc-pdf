import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const PngToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('png-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.pngToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.pngToPdf.description')}
      </p>

      <FileInput multiple accept="image/png" showControls />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="png-to-pdf-options" className="hidden mt-6">
        <div className="mb-4">
          <label
            htmlFor="png-pdf-quality"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.pngToPdf.qualityLabel')}
          </label>
          <select
            id="png-pdf-quality"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            defaultValue="medium"
          >
            <option value="high">
              {t('templates.pngToPdf.qualityOptions.high')}
            </option>
            <option value="medium">
              {t('templates.pngToPdf.qualityOptions.medium')}
            </option>
            <option value="low">
              {t('templates.pngToPdf.qualityOptions.low')}
            </option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {t('templates.pngToPdf.qualityNote')}
          </p>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.pngToPdf.submit')}
      </button>
    </div>
  );
};
