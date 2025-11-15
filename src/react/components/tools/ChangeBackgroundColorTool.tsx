import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ChangeBackgroundColorTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('change-background-color');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.changeBackgroundColor.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.changeBackgroundColor.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="change-background-color-options" className="hidden mt-6">
        <label
          htmlFor="background-color"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.changeBackgroundColor.colorLabel')}
        </label>
        <input
          type="color"
          id="background-color"
          defaultValue="#FFFFFF"
          className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
        />

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.changeBackgroundColor.submit')}
        </button>
      </div>
    </div>
  );
};
