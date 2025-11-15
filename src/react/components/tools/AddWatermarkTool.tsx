import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const AddWatermarkTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    const logic = toolLogic['add-watermark'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }
    setupFileInputHandler('add-watermark');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.watermark.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.watermark.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="watermark-options" className="hidden mt-6 space-y-4">
        <div className="flex gap-4 p-2 rounded-lg bg-gray-900">
          <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
            <input
              type="radio"
              name="watermark-type"
              value="text"
              defaultChecked
              className="hidden"
            />
            <span className="font-semibold text-white">
              {t('templates.watermark.mode.text')}
            </span>
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
            <input type="radio" name="watermark-type" value="image" className="hidden" />
            <span className="font-semibold text-white">
              {t('templates.watermark.mode.image')}
            </span>
          </label>
        </div>

        <div id="text-watermark-options">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="watermark-text"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.watermark.textOptions.label')}
              </label>
              <input
                type="text"
                id="watermark-text"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
                placeholder={t('templates.watermark.textOptions.placeholder') ?? ''}
              />
            </div>
            <div>
              <label
                htmlFor="font-size"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.watermark.textOptions.fontSize')}
              </label>
              <input
                type="number"
                id="font-size"
                defaultValue={72}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="text-color"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.watermark.textOptions.textColor')}
              </label>
              <input
                type="color"
                id="text-color"
                defaultValue="#000000"
                className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
              />
            </div>
            <div>
              <label
                htmlFor="opacity-text"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {t('templates.watermark.textOptions.opacity')}{' '}
                (<span id="opacity-value-text">0.3</span>)
              </label>
              <input
                type="range"
                id="opacity-text"
                defaultValue="0.3"
                min="0"
                max="1"
                step="0.1"
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="angle-text"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.watermark.textOptions.angle')} (
              <span id="angle-value-text">0</span>°)
            </label>
            <input
              type="range"
              id="angle-text"
              defaultValue="0"
              min="-180"
              max="180"
              step="1"
              className="w-full"
            />
          </div>
        </div>

        <div id="image-watermark-options" className="hidden space-y-4">
          <div>
            <label
              htmlFor="image-watermark-input"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.watermark.imageOptions.label')}
            </label>
            <input
              type="file"
              id="image-watermark-input"
              accept="image/png, image/jpeg"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
          </div>
          <div>
            <label
              htmlFor="opacity-image"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.watermark.imageOptions.opacity')} (
              <span id="opacity-value-image">0.3</span>)
            </label>
            <input
              type="range"
              id="opacity-image"
              defaultValue="0.3"
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="angle-image"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.watermark.imageOptions.angle')} (
              <span id="angle-value-image">0</span>°)
            </label>
            <input
              type="range"
              id="angle-image"
              defaultValue="0"
              min="-180"
              max="180"
              step="1"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.watermark.submit')}
      </button>
    </div>
  );
};
