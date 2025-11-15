import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const CropperTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('cropper');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.cropper.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.cropper.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="cropper-ui-container" className="hidden mt-6">
        <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
          <p className="text-sm text-gray-300">
            <strong className="text-white">{t('templates.cropper.infoHeading')}</strong>
          </p>
          <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
            <li>
              <strong className="text-white">
                {t('templates.cropper.infoItems.preview.title')}:
              </strong>{' '}
              {t('templates.cropper.infoItems.preview.description')}
            </li>
            <li>
              <strong className="text-white">
                {t('templates.cropper.infoItems.nonDestructive.title')}:
              </strong>{' '}
              {t('templates.cropper.infoItems.nonDestructive.description')}
            </li>
            <li>
              <strong className="text-white">
                {t('templates.cropper.infoItems.destructive.title')}:
              </strong>{' '}
              {t('templates.cropper.infoItems.destructive.description')}
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <button
              id="prev-page"
              className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              <i data-lucide="chevron-left" className="w-5 h-5"></i>
            </button>
            <span id="page-info" className="text-white font-medium">
              {t('templates.cropper.controls.pageIndicator', { current: 0, total: 0 })}
            </span>
            <button
              id="next-page"
              className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              <i data-lucide="chevron-right" className="w-5 h-5"></i>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                id="destructive-crop-toggle"
                className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              {t('templates.cropper.controls.destructive')}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                id="apply-to-all-toggle"
                className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              {t('templates.cropper.controls.applyToAll')}
            </label>
          </div>
        </div>

        <div id="status" className="text-center italic text-gray-400 mb-4">
          {t('templates.cropper.status')}
        </div>
        <div
          id="cropper-container"
          className="w-full relative overflow-hidden flex items-center justify-center bg-gray-900 rounded-lg border border-gray-600 min-h-[500px]"
        ></div>

        <button id="crop-button" className="btn-gradient w-full mt-6" disabled>
          {t('templates.cropper.submit')}
        </button>
      </div>
    </div>
  );
};
