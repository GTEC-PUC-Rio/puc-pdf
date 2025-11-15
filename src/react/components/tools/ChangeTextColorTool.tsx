import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ChangeTextColorTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('change-text-color');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.changeTextColor.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.changeTextColor.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="text-color-options" className="hidden mt-6 space-y-4">
        <div>
          <label
            htmlFor="text-color-input"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.changeTextColor.colorLabel')}
          </label>
          <input
            type="color"
            id="text-color-input"
            defaultValue="#FF0000"
            className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">
              {t('templates.changeTextColor.originalPreview')}
            </h3>
            <canvas
              id="original-canvas"
              className="w-full h-auto rounded-lg border-2 border-gray-600"
            ></canvas>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-white mb-2">
              {t('templates.changeTextColor.processedPreview')}
            </h3>
            <canvas
              id="text-color-canvas"
              className="w-full h-auto rounded-lg border-2 border-gray-600"
            ></canvas>
          </div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.changeTextColor.submit')}
        </button>
      </div>
    </div>
  );
};
