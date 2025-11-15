import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const CombineSinglePageTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('combine-single-page');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.combineSinglePage.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.combineSinglePage.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="combine-options" className="hidden mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="page-spacing"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.combineSinglePage.spacingLabel')}
            </label>
            <input
              type="number"
              id="page-spacing"
              defaultValue={18}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="background-color"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.combineSinglePage.backgroundLabel')}
            </label>
            <input
              type="color"
              id="background-color"
              defaultValue="#FFFFFF"
              className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
            />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <input
              type="checkbox"
              id="add-separator"
              className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
            />
            {t('templates.combineSinglePage.separatorLabel')}
          </label>
        </div>
        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.combineSinglePage.submit')}
        </button>
      </div>
    </div>
  );
};
