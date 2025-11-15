import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const SignPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('sign-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.signPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.signPdf.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="signature-editor" className="hidden mt-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
          <div className="flex border-b border-gray-700 mb-4">
            <button
              id="draw-tab-btn"
              type="button"
              className="flex-1 p-2 text-sm font-semibold border-b-2 border-indigo-500 text-white"
            >
              {t('templates.signPdf.tabs.draw')}
            </button>
            <button
              id="type-tab-btn"
              type="button"
              className="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400"
            >
              {t('templates.signPdf.tabs.type')}
            </button>
            <button
              id="upload-tab-btn"
              type="button"
              className="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400"
            >
              {t('templates.signPdf.tabs.upload')}
            </button>
          </div>

          <div id="draw-panel">
            <canvas
              id="signature-draw-canvas"
              className="bg-white rounded-md cursor-crosshair w-full"
              height={150}
            ></canvas>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-4 sm:gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="signature-color"
                  className="text-sm font-medium text-gray-300"
                >
                  {t('templates.signPdf.drawPanel.colorLabel')}
                </label>
                <input
                  type="color"
                  id="signature-color"
                  defaultValue="#22c55e"
                  className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="clear-draw-btn"
                  type="button"
                  className="btn hover:bg-gray-600 text-sm flex-grow sm:flex-grow-0"
                >
                  {t('templates.signPdf.drawPanel.clear')}
                </button>
                <button
                  id="save-draw-btn"
                  type="button"
                  className="btn-gradient px-4 py-2 text-sm rounded-lg flex-grow sm:flex-grow-0"
                >
                  {t('templates.signPdf.drawPanel.save')}
                </button>
              </div>
            </div>
          </div>

          <div id="type-panel" className="hidden">
            <input
              type="text"
              id="signature-text-input"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4"
              placeholder={t('templates.signPdf.typePanel.placeholder') ?? ''}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor="font-family-select"
                  className="block mb-1 text-xs font-medium text-gray-400"
                >
                  {t('templates.signPdf.typePanel.fontLabel')}
                </label>
                <select
                  id="font-family-select"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                >
                  <option value="'Great Vibes', cursive">
                    {t('templates.signPdf.typePanel.fontOptions.signature')}
                  </option>
                  <option value="'Kalam', cursive">
                    {t('templates.signPdf.typePanel.fontOptions.handwriting')}
                  </option>
                  <option value="'Dancing Script', cursive">
                    {t('templates.signPdf.typePanel.fontOptions.calligraphy')}
                  </option>
                  <option value="'Lato', sans-serif">
                    {t('templates.signPdf.typePanel.fontOptions.regular')}
                  </option>
                  <option value="'Merriweather', serif">
                    {t('templates.signPdf.typePanel.fontOptions.formal')}
                  </option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="font-size-slider"
                  className="block mb-1 text-xs font-medium text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: t('templates.signPdf.typePanel.sizeLabel', {
                      value: '<span id="font-size-value">48</span>',
                    }) as string,
                  }}
                ></label>
                <input
                  type="range"
                  id="font-size-slider"
                  min={24}
                  max={72}
                  defaultValue={32}
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="font-color-picker"
                  className="block mb-1 text-xs font-medium text-gray-400"
                >
                  {t('templates.signPdf.typePanel.colorLabel')}
                </label>
                <input
                  type="color"
                  id="font-color-picker"
                  defaultValue="#22c55e"
                  className="w-full h-[38px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
                />
              </div>
            </div>

            <div
              id="font-preview"
              className="p-4 h-[80px] bg-transparent rounded-md flex items-center justify-center text-4xl"
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '32px',
                color: '#22c55e',
              }}
            >
              {t('templates.signPdf.typePanel.previewPlaceholder')}
            </div>

            <div className="flex justify-end mt-4">
              <button
                id="save-type-btn"
                type="button"
                className="btn-gradient px-4 py-2 text-sm rounded-lg"
              >
                {t('templates.signPdf.typePanel.save')}
              </button>
            </div>
          </div>

          <div id="upload-panel" className="hidden">
            <input
              type="file"
              id="signature-upload-input"
              accept="image/png"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            <p className="text-xs text-gray-500 mt-2">
              {t('templates.signPdf.uploadPanel.note')}
            </p>
          </div>

          <hr className="border-gray-700 my-4" />
          <h4 className="text-md font-semibold text-white mb-2">
            {t('templates.signPdf.savedSignatures.heading')}
          </h4>
          <div
            id="saved-signatures-container"
            className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-md min-h-[50px]"
          >
            <p className="text-xs text-gray-500 text-center w-full">
              {t('templates.signPdf.savedSignatures.helper')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <button
            id="prev-page-sign"
            type="button"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            <i data-lucide="chevron-left"></i>
          </button>
          <span
            className="text-white font-medium"
            dangerouslySetInnerHTML={{
              __html: t('templates.signPdf.viewer.pageIndicator', {
                current: '<span id="current-page-display-sign">1</span>',
                total: '<span id="total-pages-display-sign">1</span>',
              }) as string,
            }}
          ></span>
          <button
            id="next-page-sign"
            type="button"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            <i data-lucide="chevron-right"></i>
          </button>
          <div className="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
          <button
            id="zoom-out-btn"
            type="button"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <i data-lucide="zoom-out"></i>
          </button>
          <button
            id="fit-width-btn"
            type="button"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <i data-lucide="minimize"></i>
          </button>
          <button
            id="zoom-in-btn"
            type="button"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <i data-lucide="zoom-in"></i>
          </button>
          <div className="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
          <button
            id="undo-btn"
            type="button"
            title={t('templates.signPdf.viewer.undoTooltip') ?? ''}
            className="btn p-2 rounded-full"
          >
            <i data-lucide="undo-2"></i>
          </button>
        </div>

        <div
          id="canvas-container-sign"
          className="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 h-[60vh] md:h-[80vh]"
        >
          <canvas id="canvas-sign" className="mx-auto"></canvas>
        </div>
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.signPdf.submit')}
      </button>
    </div>
  );
};
