import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const EditAttachmentsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('edit-attachments');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.editAttachments.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.editAttachments.description')}
      </p>

      <FileInput accept="application/pdf" />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="edit-attachments-options" className="hidden mt-6">
        <div id="attachments-list" className="space-y-3 mb-4"></div>
        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.editAttachments.submit')}
        </button>
      </div>
    </div>
  );
};
