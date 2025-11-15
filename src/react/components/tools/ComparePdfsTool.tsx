import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { setupCompareTool } from '../../../js/logic/compare-pdfs.js';

export const ComparePdfsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupCompareTool();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.comparePdfs.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.comparePdfs.description')}
      </p>

      <div
        id="compare-upload-area"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div
          id="drop-zone-1"
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700"
        >
          <div
            id="file-display-1"
            className="flex flex-col items-center justify-center pt-5 pb-6"
          >
            <i data-lucide="file-scan" className="w-10 h-10 mb-3 text-gray-400"></i>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">
                {t('templates.comparePdfs.dropzones.original')}
              </span>
            </p>
          </div>
          <input
            id="file-input-1"
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            accept="application/pdf"
          />
        </div>

        <div
          id="drop-zone-2"
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700"
        >
          <div
            id="file-display-2"
            className="flex flex-col items-center justify-center pt-5 pb-6"
          >
            <i data-lucide="file-diff" className="w-10 h-10 mb-3 text-gray-400"></i>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">
                {t('templates.comparePdfs.dropzones.revised')}
              </span>
            </p>
          </div>
          <input
            id="file-input-2"
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            accept="application/pdf"
          />
        </div>
      </div>

      <div id="compare-viewer" className="hidden mt-6">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
          <button
            id="prev-page-compare"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            type="button"
          >
            <i data-lucide="chevron-left"></i>
          </button>
          <span
            className="text-white font-medium"
            dangerouslySetInnerHTML={{
              __html: t('templates.comparePdfs.pageIndicator', {
                current:
                  '<span id="current-page-display-compare">1</span>',
                total: '<span id="total-pages-display-compare">1</span>',
              }) as string,
            }}
          ></span>
          <button
            id="next-page-compare"
            className="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            type="button"
          >
            <i data-lucide="chevron-right"></i>
          </button>
          <div className="border-l border-gray-600 h-6 mx-2"></div>
          <div className="bg-gray-700 p-1 rounded-md flex gap-1">
            <button
              id="view-mode-overlay"
              type="button"
              className="btn bg-indigo-600 px-3 py-1 rounded text-sm font-semibold"
            >
              {t('templates.comparePdfs.viewModes.overlay')}
            </button>
            <button
              id="view-mode-side"
              type="button"
              className="btn px-3 py-1 rounded text-sm font-semibold"
            >
              {t('templates.comparePdfs.viewModes.sideBySide')}
            </button>
          </div>
          <div className="border-l border-gray-600 h-6 mx-2"></div>
          <div id="overlay-controls" className="flex items-center gap-2">
            <button
              id="flicker-btn"
              type="button"
              className="btn bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm font-semibold"
            >
              {t('templates.comparePdfs.controls.flicker')}
            </button>
            <label
              htmlFor="opacity-slider"
              className="text-sm font-medium text-gray-300"
            >
              {t('templates.comparePdfs.controls.opacity')}
            </label>
            <input
              type="range"
              id="opacity-slider"
              min="0"
              max="1"
              step="0.05"
              defaultValue="0.5"
              className="w-24"
            />
          </div>
          <div id="side-by-side-controls" className="hidden flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                id="sync-scroll-toggle"
                defaultChecked
                className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              {t('templates.comparePdfs.controls.syncScroll')}
            </label>
          </div>
        </div>
        <div id="compare-viewer-wrapper" className="compare-viewer-wrapper overlay-mode">
          <div id="panel-1" className="pdf-panel">
            <canvas id="canvas-compare-1"></canvas>
          </div>
          <div id="panel-2" className="pdf-panel">
            <canvas id="canvas-compare-2"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};
