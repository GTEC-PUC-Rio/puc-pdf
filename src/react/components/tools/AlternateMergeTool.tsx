import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const AlternateMergeTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('alternate-merge');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.alternateMerge.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.alternateMerge.description')}
      </p>

      <FileInput multiple accept="application/pdf" showControls />

      <div id="alternate-merge-options" className="hidden mt-6">
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
          <p className="text-sm text-gray-300">
            <strong className="text-white">
              {t('templates.alternateMerge.infoHeading')}
            </strong>
          </p>
          <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
            <li>{t('templates.alternateMerge.infoItems.0')}</li>
            <li>{t('templates.alternateMerge.infoItems.1')}</li>
          </ul>
        </div>

        <ul id="alternate-file-list" className="space-y-2"></ul>

        <button id="process-btn" className="btn-gradient w-full mt-6" disabled>
          {t('templates.alternateMerge.submit')}
        </button>
      </div>
    </div>
  );
};
