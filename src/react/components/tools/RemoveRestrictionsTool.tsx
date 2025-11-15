import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const RemoveRestrictionsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('remove-restrictions');
  }, []);

  const infoItems = [
    'templates.removeRestrictions.info.items.0',
    'templates.removeRestrictions.info.items.1',
    'templates.removeRestrictions.info.items.2',
    'templates.removeRestrictions.info.items.3',
  ];

  const warningItems = [
    'templates.removeRestrictions.warning.items.0',
    'templates.removeRestrictions.warning.items.1',
    'templates.removeRestrictions.warning.items.2',
    'templates.removeRestrictions.warning.items.3',
    'templates.removeRestrictions.warning.items.4',
    'templates.removeRestrictions.warning.items.5',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.removeRestrictions.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.removeRestrictions.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="remove-restrictions-options" className="hidden space-y-4 mt-6">
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            {t('templates.removeRestrictions.info.heading')}
          </h3>
          <p className="text-sm text-gray-300 mb-2">
            {t('templates.removeRestrictions.info.body')}
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
            {infoItems.map((item) => (
              <li key={item}>{t(item)}</li>
            ))}
          </ul>
        </div>

        <div>
          <label
            htmlFor="owner-password-remove"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.removeRestrictions.ownerPassword.label')}
          </label>
          <input
            type="password"
            id="owner-password-remove"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={
              t('templates.removeRestrictions.ownerPassword.placeholder') ?? ''
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('templates.removeRestrictions.ownerPassword.helper')}
          </p>
        </div>

        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            {t('templates.removeRestrictions.warning.heading')}
          </h3>
          <p className="text-sm text-gray-300 mb-2">
            {t('templates.removeRestrictions.warning.description')}
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
            {warningItems.map((item, index) => (
              <li
                key={item}
                className={index === warningItems.length - 1 ? 'font-semibold' : ''}
              >
                {t(item)}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-300 mt-3 font-semibold">
            {t('templates.removeRestrictions.warning.footnote')}
          </p>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.removeRestrictions.submit')}
        </button>
      </div>
    </div>
  );
};
