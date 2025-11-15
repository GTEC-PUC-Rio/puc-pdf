import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const PosterizeTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('posterize');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.posterize.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.posterize.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="posterize-options" className="hidden mt-6 space-y-6">
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-300"
            dangerouslySetInnerHTML={{
              __html: t('templates.posterize.previewLabel', {
                current: '<span id="current-preview-page">1</span>',
                total: '<span id="total-preview-pages">1</span>',
              }) as string,
            }}
          ></label>
          <div
            id="posterize-preview-container"
            className="relative w-full max-w-xl mx-auto bg-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center"
          >
            <button
              id="prev-preview-page"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"
            >
              <i data-lucide="chevron-left"></i>
            </button>
            <canvas
              id="posterize-preview-canvas"
              className="w-full h-auto rounded-md"
            ></canvas>
            <button
              id="next-preview-page"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"
            >
              <i data-lucide="chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            {t('templates.posterize.gridHeading')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="posterize-rows"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.posterize.rowsLabel')}
              </label>
              <input
                type="number"
                id="posterize-rows"
                defaultValue={1}
                min={1}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              />
            </div>
            <div>
              <label
                htmlFor="posterize-cols"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.posterize.colsLabel')}
              </label>
              <input
                type="number"
                id="posterize-cols"
                defaultValue={2}
                min={1}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {t('templates.posterize.outputHeading')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="posterize-page-size"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.posterize.pageSizeLabel')}
              </label>
              <select
                id="posterize-page-size"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Tabloid">Tabloid</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="posterize-orientation"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.posterize.orientationLabel')}
              </label>
              <select
                id="posterize-orientation"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              >
                <option value="auto">
                  {t('templates.posterize.orientationOptions.auto')}
                </option>
                <option value="portrait">
                  {t('templates.posterize.orientationOptions.portrait')}
                </option>
                <option value="landscape">
                  {t('templates.posterize.orientationOptions.landscape')}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {t('templates.posterize.advancedHeading')}
          </h3>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {t('templates.posterize.scalingLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-start gap-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="posterize-scaling"
                  value="fit"
                  id="posterize-scaling-fit"
                  defaultChecked
                  className="mt-1 h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-white text-sm">
                    {t('templates.posterize.scalingOptions.fitTitle')}
                  </span>
                  <p className="text-xs text-gray-400">
                    {t('templates.posterize.scalingOptions.fitDescription')}
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="posterize-scaling"
                  value="fill"
                  id="posterize-scaling-fill"
                  className="mt-1 h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-white text-sm">
                    {t('templates.posterize.scalingOptions.fillTitle')}
                  </span>
                  <p className="text-xs text-gray-400">
                    {t('templates.posterize.scalingOptions.fillDescription')}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="posterize-overlap"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.posterize.overlapLabel')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="posterize-overlap"
                defaultValue={0}
                className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              />
              <select
                id="posterize-overlap-units"
                className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              >
                <option value="pt">
                  {t('templates.posterize.overlapUnits.pt')}
                </option>
                <option value="in">
                  {t('templates.posterize.overlapUnits.in')}
                </option>
                <option value="mm">
                  {t('templates.posterize.overlapUnits.mm')}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="posterize-page-range"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.posterize.pageRange.label')}
            </label>
            <input
              id="posterize-page-range"
              type="text"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              placeholder={t('templates.posterize.pageRange.placeholder') ?? ''}
            />
            <p className="text-xs text-gray-400 mt-1">
              {t('templates.posterize.pageRange.helper', {
                total: '<span id="total-pages">0</span>',
              })}
            </p>
          </div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6" disabled>
          {t('templates.posterize.submit')}
        </button>
      </div>
    </div>
  );
};
