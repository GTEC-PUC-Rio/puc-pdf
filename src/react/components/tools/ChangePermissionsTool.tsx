import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const ChangePermissionsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('change-permissions');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.changePermissions.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.changePermissions.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="permissions-options" className="hidden mt-6 space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.changePermissions.currentPasswordLabel')}
          </label>
          <input
            type="password"
            id="current-password"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={
              t('templates.changePermissions.currentPasswordPlaceholder') ?? ''
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="new-user-password"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.changePermissions.newUserLabel')}
            </label>
            <input
              type="password"
              id="new-user-password"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              placeholder={
                t('templates.changePermissions.newUserPlaceholder') ?? ''
              }
            />
          </div>
          <div>
            <label
              htmlFor="new-owner-password"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.changePermissions.newOwnerLabel')}
            </label>
            <input
              type="password"
              id="new-owner-password"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              placeholder={
                t('templates.changePermissions.newOwnerPlaceholder') ?? ''
              }
            />
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" id="allow-print" defaultChecked />
            <span>{t('templates.changePermissions.flags.print')}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" id="allow-modify" defaultChecked />
            <span>{t('templates.changePermissions.flags.modify')}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" id="allow-copy" defaultChecked />
            <span>{t('templates.changePermissions.flags.copy')}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" id="allow-annotate" defaultChecked />
            <span>{t('templates.changePermissions.flags.annotate')}</span>
          </label>
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.changePermissions.submit')}
      </button>
    </div>
  );
};
