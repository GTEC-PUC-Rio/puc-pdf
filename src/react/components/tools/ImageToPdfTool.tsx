import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ImageToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('image-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.imageToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.imageToPdf.description')}
      </p>

      <FileInput
        multiple
        accept="image/jpeg,image/png,image/webp"
        showControls
      />

      <ul
        id="image-list"
        className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
      ></ul>

      <div id="image-to-pdf-options" className="hidden mt-6">
        <div className="mb-4">
          <label
            htmlFor="image-pdf-quality"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.imageToPdf.qualityLabel')}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="image-pdf-quality"
              min="0.3"
              max="1.0"
              step="0.1"
              defaultValue="0.9"
              className="flex-1"
            />
            <span
              id="image-pdf-quality-value"
              className="text-white font-medium w-16 text-right"
            >
              {t('templates.imageToPdf.qualityValue', { defaultValue: '90%' })}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {t('templates.imageToPdf.qualityNote')}
          </p>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.imageToPdf.submit')}
      </button>
    </div>
  );
};
