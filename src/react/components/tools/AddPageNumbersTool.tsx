import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const AddPageNumbersTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('add-page-numbers');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.addPageNumbers.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.addPageNumbers.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div
        id="pagenum-options"
        className="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
      >
        <div>
          <label
            htmlFor="position"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.addPageNumbers.positionLabel')}
          </label>
          <select
            id="position"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            defaultValue="bottom-center"
          >
            <option value="bottom-center">
              {t('templates.addPageNumbers.positionOptions.bottomCenter')}
            </option>
            <option value="bottom-left">
              {t('templates.addPageNumbers.positionOptions.bottomLeft')}
            </option>
            <option value="bottom-right">
              {t('templates.addPageNumbers.positionOptions.bottomRight')}
            </option>
            <option value="top-center">
              {t('templates.addPageNumbers.positionOptions.topCenter')}
            </option>
            <option value="top-left">
              {t('templates.addPageNumbers.positionOptions.topLeft')}
            </option>
            <option value="top-right">
              {t('templates.addPageNumbers.positionOptions.topRight')}
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="font-size"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.addPageNumbers.fontSizeLabel')}
          </label>
          <input
            type="number"
            id="font-size"
            defaultValue={12}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          />
        </div>
        <div>
          <label
            htmlFor="number-format"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.addPageNumbers.formatLabel')}
          </label>
          <select
            id="number-format"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="default">
              {t('templates.addPageNumbers.formatOptions.default')}
            </option>
            <option value="page_x_of_y">
              {t('templates.addPageNumbers.formatOptions.pageXofY')}
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="text-color"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.addPageNumbers.colorLabel')}
          </label>
          <input
            type="color"
            id="text-color"
            defaultValue="#000000"
            className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
          />
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.addPageNumbers.submit')}
      </button>
    </div>
  );
};
