import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ViewMetadataTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('view-metadata');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.viewMetadata.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.viewMetadata.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div
        id="metadata-results"
        className="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg"
      >
        {t('templates.viewMetadata.resultsPlaceholder')}
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.viewMetadata.submit')}
      </button>
    </div>
  );
};
