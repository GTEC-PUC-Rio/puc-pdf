import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const DecryptTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('decrypt');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.decrypt.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.decrypt.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="decrypt-options" className="hidden space-y-4 mt-6">
        <div>
          <label
            htmlFor="password-input"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.decrypt.passwordLabel')}
          </label>
          <input
            type="password"
            id="password-input"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={t('templates.decrypt.passwordPlaceholder') ?? ''}
          />
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.decrypt.submit')}
        </button>
      </div>

      <canvas id="pdf-canvas" className="hidden"></canvas>
    </div>
  );
};
