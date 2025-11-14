import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const DeletePagesTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('delete-pages');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.deletePages.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.deletePages.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="delete-options" className="hidden mt-6">
        <p className="mb-2 font-medium text-white">
          {t('templates.deletePages.total')} <span id="total-pages"></span>
        </p>
        <label
          htmlFor="pages-to-delete"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.deletePages.inputLabel')}
        </label>
        <input
          type="text"
          id="pages-to-delete"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6"
          placeholder={t('templates.deletePages.placeholder') ?? ''}
        />
        <button id="process-btn" className="btn-gradient w-full">
          {t('templates.deletePages.submit')}
        </button>
      </div>
    </div>
  );
};
