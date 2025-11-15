import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const BmpToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('bmp-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.bmpToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.bmpToPdf.description')}
      </p>

      <FileInput multiple accept="image/bmp" showControls />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.bmpToPdf.submit')}
      </button>
    </div>
  );
};
