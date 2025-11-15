import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const CompressTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('compress');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.compress.title')}
      </h2>
      <p className="mb-6 text-gray-400">{t('templates.compress.description')}</p>

      <FileInput multiple showControls />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="compress-options" className="hidden mt-6 space-y-6">
        <div>
          <label
            htmlFor="compression-level"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.compress.levelLabel')}
          </label>
          <select
            id="compression-level"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="balanced">
              {t('templates.compress.levelOptions.balanced')}
            </option>
            <option value="high-quality">
              {t('templates.compress.levelOptions.highQuality')}
            </option>
            <option value="small-size">
              {t('templates.compress.levelOptions.smallSize')}
            </option>
            <option value="extreme">
              {t('templates.compress.levelOptions.extreme')}
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="compression-algorithm"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.compress.algorithmLabel')}
          </label>
          <select
            id="compression-algorithm"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="vector">
              {t('templates.compress.algorithmOptions.vector')}
            </option>
            <option value="photon">
              {t('templates.compress.algorithmOptions.photon')}
            </option>
          </select>
          <p className="mt-2 text-xs text-gray-400">
            {t('templates.compress.algorithmHelper')}
          </p>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-4" disabled>
          {t('templates.compress.submit')}
        </button>
      </div>
    </div>
  );
};
