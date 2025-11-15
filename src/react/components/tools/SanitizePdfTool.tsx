import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const SanitizePdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('sanitize-pdf');
  }, []);

  const securityOptions = [
    { id: 'flatten-forms', key: 'flattenForms' },
    { id: 'remove-metadata', key: 'metadata' },
    { id: 'remove-annotations', key: 'annotations' },
    { id: 'remove-javascript', key: 'javascript' },
    { id: 'remove-embedded-files', key: 'attachments' },
    { id: 'remove-layers', key: 'layers' },
    { id: 'remove-links', key: 'links' },
  ];

  const additionalOptions = [
    { id: 'remove-structure-tree', key: 'structure' },
    { id: 'remove-markinfo', key: 'markinfo' },
    { id: 'remove-fonts', key: 'fonts' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.sanitizePdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.sanitizePdf.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div
        id="sanitize-pdf-options"
        className="hidden mt-6 space-y-4 p-4 bg-gray-900 border border-gray-700 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-white mb-3">
          {t('templates.sanitizePdf.optionsHeading')}
        </h3>
        <div className="text-sm text-gray-300">
          {t('templates.sanitizePdf.warning')}
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            {t('templates.sanitizePdf.sections.security')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {securityOptions.map(({ id, key }) => (
              <label
                key={id}
                className="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={id}
                  name="sanitizeOption"
                  value={key}
                  defaultChecked
                  className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <span className="text-white text-sm">
                  {t(`templates.sanitizePdf.options.${key}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">
            {t('templates.sanitizePdf.sections.additional')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {additionalOptions.map(({ id, key }) => (
              <label
                key={id}
                className="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={id}
                  name="sanitizeOption"
                  value={key}
                  className="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <span className="text-white text-sm">
                  {t(`templates.sanitizePdf.options.${key}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.sanitizePdf.submit')}
        </button>
      </div>
    </div>
  );
};
