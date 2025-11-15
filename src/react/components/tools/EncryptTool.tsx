import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

const restrictionCheckboxes = [
  { id: 'restrict-modify', labelKey: 'modify', defaultChecked: true },
  { id: 'restrict-extract', labelKey: 'extract', defaultChecked: true },
  { id: 'restrict-print', labelKey: 'print', defaultChecked: true },
  { id: 'restrict-accessibility', labelKey: 'accessibility', defaultChecked: false },
  { id: 'restrict-annotate', labelKey: 'annotate', defaultChecked: false },
  { id: 'restrict-assemble', labelKey: 'assemble', defaultChecked: false },
  { id: 'restrict-form', labelKey: 'form', defaultChecked: false },
  { id: 'restrict-modify-other', labelKey: 'modifyOther', defaultChecked: false },
];

export const EncryptTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('encrypt');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.encrypt.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.encrypt.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="encrypt-options" className="hidden space-y-4 mt-6">
        <div>
          <label
            htmlFor="user-password-input"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.encrypt.inputs.userLabel')}
          </label>
          <input
            required
            type="password"
            id="user-password-input"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={t('templates.encrypt.inputs.userPlaceholder') ?? ''}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('templates.encrypt.inputs.userHelper')}
          </p>
        </div>

        <div>
          <label
            htmlFor="owner-password-input"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.encrypt.inputs.ownerLabel')}
          </label>
          <input
            type="password"
            id="owner-password-input"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={t('templates.encrypt.inputs.ownerPlaceholder') ?? ''}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('templates.encrypt.inputs.ownerHelper')}
          </p>
        </div>

        <div
          id="restriction-options"
          className="hidden p-4 bg-gray-800 border border-gray-700 rounded-lg"
        >
          <h3 className="font-semibold text-base mb-2 text-white">
            {t('templates.encrypt.restrictions.heading')}
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            {t('templates.encrypt.restrictions.description')}
          </p>

          <div className="space-y-2 text-gray-200 text-sm">
            {restrictionCheckboxes.map(({ id, labelKey, defaultChecked }) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={id}
                  defaultChecked={defaultChecked}
                />
                <span>
                  {t(`templates.encrypt.restrictions.options.${labelKey}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            {t('templates.encrypt.securityCallout.title')}
          </h3>
          <p className="text-sm text-gray-300">
            {t('templates.encrypt.securityCallout.body')}
          </p>
        </div>

        <div className="p-4 bg-green-900/20 border border-green-500/30 text-green-200 rounded-lg">
          <h3 className="font-semibold text-base mb-2">
            {t('templates.encrypt.qualityCallout.title')}
          </h3>
          <p className="text-sm text-gray-300">
            {t('templates.encrypt.qualityCallout.body')}
          </p>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.encrypt.submit')}
        </button>
      </div>
    </div>
  );
};
