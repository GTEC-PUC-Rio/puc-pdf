import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const AddAttachmentsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('add-attachments');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.addAttachments.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.addAttachments.description')}
      </p>

      <FileInput accept="application/pdf" />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="attachment-options" className="hidden mt-8">
        <h3 className="text-lg font-semibold text-white mb-3">
          {t('templates.addAttachments.secondaryTitle')}
        </h3>
        <p className="mb-4 text-gray-400">
          {t('templates.addAttachments.secondaryDescription')}
        </p>

        <label
          htmlFor="attachment-files-input"
          className="w-full flex justify-center items-center px-6 py-10 bg-gray-900 text-gray-400 rounded-lg border-2 border-dashed border-gray-600 hover:bg-gray-800 hover:border-gray-500 cursor-pointer transition-colors"
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="mt-2 block text-sm font-medium">
              {t('templates.addAttachments.dropLabel')}
            </span>
            <span className="mt-1 block text-xs">
              {t('templates.addAttachments.dropHint')}
            </span>
          </div>
          <input
            id="attachment-files-input"
            name="attachment-files"
            type="file"
            className="sr-only"
            multiple
          />
        </label>

        <div id="attachment-file-list" className="mt-4 space-y-2"></div>

        <button id="process-btn" className="hidden btn-gradient w-full mt-6" disabled>
          {t('templates.addAttachments.submit')}
        </button>
      </div>
    </div>
  );
};
