import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const AddHeaderFooterTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('add-header-footer');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.headerFooter.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.headerFooter.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="header-footer-options" className="hidden mt-6 space-y-4">
        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            {t('templates.headerFooter.formatting')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="page-range"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.headerFooter.pageRange.label')}
              </label>
              <input
                type="text"
                id="page-range"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
                placeholder={t('templates.headerFooter.pageRange.placeholder') ?? ''}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t('templates.headerFooter.pageRange.total')}{' '}
                <span id="total-pages">0</span>
              </p>
            </div>
            <div>
              <label
                htmlFor="font-size"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.headerFooter.fontSize')}
              </label>
              <input
                type="number"
                id="font-size"
                defaultValue={10}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="font-color"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.headerFooter.fontColor')}
              </label>
              <input
                type="color"
                id="font-color"
                defaultValue="#000000"
                className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="header-left"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.headers.left')}
            </label>
            <input
              type="text"
              id="header-left"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="header-center"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.headers.center')}
            </label>
            <input
              type="text"
              id="header-center"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="header-right"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.headers.right')}
            </label>
            <input
              type="text"
              id="header-right"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="footer-left"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.footers.left')}
            </label>
            <input
              type="text"
              id="footer-left"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="footer-center"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.footers.center')}
            </label>
            <input
              type="text"
              id="footer-center"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="footer-right"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.headerFooter.footers.right')}
            </label>
            <input
              type="text"
              id="footer-right"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
          </div>
        </div>
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.headerFooter.submit')}
      </button>
    </div>
  );
};
