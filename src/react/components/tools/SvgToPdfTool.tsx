import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const SvgToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('svg-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.svgToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.svgToPdf.description')}
      </p>

      <FileInput multiple accept="image/svg+xml" showControls />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.svgToPdf.submit')}
      </button>
    </div>
  );
};
