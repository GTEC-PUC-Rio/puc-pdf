import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const DuplicateOrganizeTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('duplicate-organize');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.duplicateOrganize.title')}
      </h2>
      <p className="mb-3 text-gray-400">
        {t('templates.duplicateOrganize.description')}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
        <span className="inline-flex items-center gap-2">
          <i data-lucide="copy-plus" className="inline-block w-4 h-4 text-green-400"></i>
          {t('templates.duplicateOrganize.legend.duplicate')}
        </span>
        <span className="inline-flex items-center gap-2">
          <i data-lucide="x-circle" className="inline-block w-4 h-4 text-red-400"></i>
          {t('templates.duplicateOrganize.legend.delete')}
        </span>
      </div>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="page-manager-options" className="hidden mt-6">
        <div
          id="page-grid"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"
        ></div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.duplicateOrganize.submit')}
        </button>
      </div>
    </div>
  );
};
