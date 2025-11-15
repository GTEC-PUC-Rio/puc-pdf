import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const FixDimensionsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    const logic = toolLogic['fix-dimensions'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }
    setupFileInputHandler('fix-dimensions');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.fixDimensions.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.fixDimensions.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="fix-dimensions-options" className="hidden mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="target-size"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.fixDimensions.targetSize.label')}
            </label>
            <select
              id="target-size"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="A4"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="Tabloid">Tabloid</option>
              <option value="A3">A3</option>
              <option value="A5">A5</option>
              <option value="Custom">
                {t('templates.fixDimensions.targetSize.custom')}
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="orientation"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.fixDimensions.orientation.label')}
            </label>
            <select
              id="orientation"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="portrait"
            >
              <option value="portrait">
                {t('templates.fixDimensions.orientation.options.portrait')}
              </option>
              <option value="landscape">
                {t('templates.fixDimensions.orientation.options.landscape')}
              </option>
            </select>
          </div>
        </div>

        <div
          id="custom-size-wrapper"
          className="hidden p-4 rounded-lg bg-gray-900 border border-gray-700 grid grid-cols-3 gap-3"
        >
          <div>
            <label
              htmlFor="custom-width"
              className="block mb-2 text-xs font-medium text-gray-300"
            >
              {t('templates.fixDimensions.customSize.width')}
            </label>
            <input
              type="number"
              id="custom-width"
              defaultValue={8.5}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
            />
          </div>
          <div>
            <label
              htmlFor="custom-height"
              className="block mb-2 text-xs font-medium text-gray-300"
            >
              {t('templates.fixDimensions.customSize.height')}
            </label>
            <input
              type="number"
              id="custom-height"
              defaultValue={11}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2"
            />
          </div>
          <div>
            <label
              htmlFor="custom-units"
              className="block mb-2 text-xs font-medium text-gray-300"
            >
              {t('templates.fixDimensions.customSize.units.label')}
            </label>
            <select
              id="custom-units"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
            >
              <option value="in">
                {t('templates.fixDimensions.customSize.units.options.in')}
              </option>
              <option value="mm">
                {t('templates.fixDimensions.customSize.units.options.mm')}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            {t('templates.fixDimensions.scaling.label')}
          </label>
          <div className="flex gap-4 p-2 rounded-lg bg-gray-900">
            <label className="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="scaling-mode"
                value="fit"
                defaultChecked
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-white">
                  {t('templates.fixDimensions.scaling.fit.title')}
                </span>
                <p className="text-xs text-gray-400">
                  {t('templates.fixDimensions.scaling.fit.description')}
                </p>
              </div>
            </label>
            <label className="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="scaling-mode"
                value="fill"
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-white">
                  {t('templates.fixDimensions.scaling.fill.title')}
                </span>
                <p className="text-xs text-gray-400">
                  {t('templates.fixDimensions.scaling.fill.description')}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="background-color"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.fixDimensions.backgroundLabel')}
          </label>
          <input
            type="color"
            id="background-color"
            defaultValue="#FFFFFF"
            className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
          />
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.fixDimensions.submit')}
        </button>
      </div>
    </div>
  );
};
