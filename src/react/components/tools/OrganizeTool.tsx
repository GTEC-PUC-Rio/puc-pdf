import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const OrganizeTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });

    setupFileInputHandler('organize');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.organize.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.organize.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>
      <div
        id="page-organizer"
        className="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"
      ></div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.organize.submit')}
      </button>
    </div>
  );
};
