import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const FlattenTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('flatten');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.flattenPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.flattenPdf.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="flatten-info" className="hidden mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-300">
          {t('templates.flattenPdf.infoHeading')}
        </h3>
        <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
          <li>{t('templates.flattenPdf.infoItems.0')}</li>
          <li>{t('templates.flattenPdf.infoItems.1')}</li>
          <li>{t('templates.flattenPdf.infoItems.2')}</li>
        </ul>
      </div>

      <button id="process-btn" className="hidden mt-6 btn-gradient w-full">
        {t('templates.flattenPdf.submit')}
      </button>
    </div>
  );
};
