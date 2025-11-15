import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const PageDimensionsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('page-dimensions');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.pageDimensions.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.pageDimensions.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="dimensions-results" className="hidden mt-6">
        <div className="flex justify-end mb-4">
          <label
            htmlFor="units-select"
            className="text-sm font-medium text-gray-300 self-center mr-3"
          >
            {t('templates.pageDimensions.unitsLabel')}
          </label>
          <select
            id="units-select"
            className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
          >
            <option value="pt">{t('templates.pageDimensions.units.pt')}</option>
            <option value="in">{t('templates.pageDimensions.units.in')}</option>
            <option value="mm">{t('templates.pageDimensions.units.mm')}</option>
            <option value="px">{t('templates.pageDimensions.units.px')}</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700 text-sm text-left">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium text-white">
                  {t('templates.pageDimensions.tableHeaders.page')}
                </th>
                <th className="px-4 py-3 font-medium text-white">
                  {t('templates.pageDimensions.tableHeaders.dimensions')}
                </th>
              </tr>
            </thead>
            <tbody id="dimensions-body" className="divide-y divide-gray-700">
              {t('templates.pageDimensions.resultsPlaceholder')}
            </tbody>
          </table>
        </div>
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.pageDimensions.submit')}
      </button>
    </div>
  );
};
