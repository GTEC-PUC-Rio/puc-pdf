import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const AddBlankPageTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('add-blank-page');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.addBlankPage.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.addBlankPage.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="blank-page-options" className="hidden mt-6">
        <p className="mb-2 font-medium text-white">
          {t('templates.addBlankPage.total')} <span id="total-pages"></span>
        </p>

        <label
          htmlFor="page-number"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.addBlankPage.afterLabel')}
        </label>
        <input
          type="number"
          id="page-number"
          min={0}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4"
          placeholder={t('templates.addBlankPage.afterPlaceholder') ?? ''}
        />

        <label
          htmlFor="page-count"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.addBlankPage.countLabel')}
        </label>
        <input
          type="number"
          id="page-count"
          min={1}
          defaultValue={1}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6"
          placeholder={t('templates.addBlankPage.countPlaceholder') ?? ''}
        />

        <button id="process-btn" className="btn-gradient w-full">
          {t('templates.addBlankPage.submit')}
        </button>
      </div>
    </div>
  );
};
