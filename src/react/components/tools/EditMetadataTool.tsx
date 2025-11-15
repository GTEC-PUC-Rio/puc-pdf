import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const EditMetadataTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('edit-metadata');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.editMetadata.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.editMetadata.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="metadata-options" className="hidden mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="metadata-title"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.editMetadata.fields.title')}
            </label>
            <input
              type="text"
              id="metadata-title"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="metadata-author"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.editMetadata.fields.author')}
            </label>
            <input
              type="text"
              id="metadata-author"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="metadata-subject"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.editMetadata.fields.subject')}
            </label>
            <input
              type="text"
              id="metadata-subject"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="metadata-keywords"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.editMetadata.fields.keywords')}
            </label>
            <input
              type="text"
              id="metadata-keywords"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.editMetadata.submit')}
      </button>
    </div>
  );
};
