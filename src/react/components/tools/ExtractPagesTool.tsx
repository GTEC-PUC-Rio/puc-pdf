import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ExtractPagesTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('extract-pages');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.extractPages.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.extractPages.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="extract-options" className="hidden mt-6">
        <p className="mb-2 font-medium text-white">
          {t('templates.extractPages.total')} <span id="total-pages"></span>
        </p>
        <label
          htmlFor="pages-to-extract"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.extractPages.inputLabel')}
        </label>
        <input
          type="text"
          id="pages-to-extract"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6"
          placeholder={t('templates.extractPages.placeholder') ?? ''}
        />
        <button id="process-btn" className="btn-gradient w-full">
          {t('templates.extractPages.submit')}
        </button>
      </div>
    </div>
  );
};
