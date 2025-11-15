import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const RemoveMetadataTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('remove-metadata');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.removeMetadata.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.removeMetadata.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <button id="process-btn" className="hidden mt-6 btn-gradient w-full">
        {t('templates.removeMetadata.submit')}
      </button>
    </div>
  );
};
