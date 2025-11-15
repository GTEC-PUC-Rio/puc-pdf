import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const RemoveBlankPagesTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('remove-blank-pages');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.removeBlankPages.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.removeBlankPages.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="remove-blank-options" className="hidden mt-6 space-y-4">
        <div>
          <label
            htmlFor="sensitivity-slider"
            className="block mb-2 text-sm font-medium text-gray-300"
            dangerouslySetInnerHTML={{
              __html: t('templates.removeBlankPages.sensitivityLabel', {
                value: '<span id="sensitivity-value">99</span>',
              }) as string,
            }}
          ></label>
          <input
            type="range"
            id="sensitivity-slider"
            min={80}
            max={100}
            defaultValue={99}
            className="w-full"
          />
          <p className="text-xs text-gray-400 mt-1">
            {t('templates.removeBlankPages.sensitivityHelper')}
          </p>
        </div>

        <div
          id="analysis-preview"
          className="hidden p-4 bg-gray-900 border border-gray-700 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('templates.removeBlankPages.analysisHeading')}
          </h3>
          <p id="analysis-text" className="text-gray-300"></p>
          <div
            id="removed-pages-thumbnails"
            className="mt-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2"
          ></div>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.removeBlankPages.submit')}
      </button>
    </div>
  );
};
