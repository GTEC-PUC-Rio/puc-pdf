import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ReversePagesTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('reverse-pages');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.reversePages.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.reversePages.description')}
      </p>

      <FileInput
        multiple
        accept="application/pdf"
        showControls
      />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.reversePages.submit')}
      </button>
    </div>
  );
};
