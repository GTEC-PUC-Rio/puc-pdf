import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const EditTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('edit');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.pdfEditor.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.pdfEditor.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div
        id="embed-pdf-wrapper"
        className="hidden mt-6 w-full h-[75vh] border border-gray-600 rounded-lg"
      >
        <div id="embed-pdf-container" className="w-full h-full"></div>
      </div>
    </div>
  );
};
