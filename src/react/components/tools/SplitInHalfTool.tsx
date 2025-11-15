import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const SplitInHalfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('split-in-half');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.splitInHalf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.splitInHalf.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="split-half-options" className="hidden mt-6">
        <label
          htmlFor="split-type"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.splitInHalf.typeLabel')}
        </label>
        <select
          id="split-type"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6"
          defaultValue="vertical"
        >
          <option value="vertical">
            {t('templates.splitInHalf.options.vertical')}
          </option>
          <option value="horizontal">
            {t('templates.splitInHalf.options.horizontal')}
          </option>
        </select>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.splitInHalf.submit')}
        </button>
      </div>
    </div>
  );
};
