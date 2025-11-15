import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { setupOcrTool } from '../../../js/logic/ocr-pdf.js';
import { tesseractLanguages } from '../../../js/config/tesseract-languages.js';

export const OcrPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });
    setupFileInputHandler('ocr-pdf');
    setupOcrTool();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.ocrPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.ocrPdf.description')}
      </p>

      <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
        <p className="text-sm text-gray-300">
          <strong className="text-white">
            {t('templates.ocrPdf.info.heading')}
          </strong>
        </p>
        <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
          <li>
            <strong className="text-white">
              {t('templates.ocrPdf.info.items.textExtraction.title')}
            </strong>
            : {t('templates.ocrPdf.info.items.textExtraction.description')}
          </li>
          <li>
            <strong className="text-white">
              {t('templates.ocrPdf.info.items.searchablePdf.title')}
            </strong>
            : {t('templates.ocrPdf.info.items.searchablePdf.description')}
          </li>
          <li>
            <strong className="text-white">
              {t('templates.ocrPdf.info.items.characterFilter.title')}
            </strong>
            : {t('templates.ocrPdf.info.items.characterFilter.description')}
          </li>
          <li>
            <strong className="text-white">
              {t('templates.ocrPdf.info.items.multiLanguage.title')}
            </strong>
            : {t('templates.ocrPdf.info.items.multiLanguage.description')}
          </li>
        </ul>
      </div>

      <FileInput />
      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="ocr-options" className="hidden mt-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            {t('templates.ocrPdf.languageSelect.label')}
          </label>
          <div className="relative">
            <input
              type="text"
              id="lang-search"
              className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-2.5 mb-2"
              placeholder={t('templates.ocrPdf.languageSelect.placeholder') ?? ''}
            />
            <div
              id="lang-list"
              className="max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-900"
            >
              {Object.entries(tesseractLanguages).map(([code, name]) => (
                <label
                  key={code}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={code}
                    className="lang-checkbox w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('templates.ocrPdf.languageSelect.selectedLabel')}{' '}
            <span id="selected-langs-display" className="font-semibold">
              {t('templates.ocrPdf.languageSelect.noneSelected')}
            </span>
          </p>
        </div>

        <details className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <summary className="text-sm font-medium text-gray-300 cursor-pointer flex items-center justify-between">
            <span>{t('templates.ocrPdf.advanced.summary')}</span>
            <i data-lucide="chevron-down" className="w-4 h-4 transition-transform details-icon"></i>
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="ocr-resolution"
                className="block mb-1 text-xs font-medium text-gray-400"
              >
                {t('templates.ocrPdf.advanced.resolution.label')}
              </label>
              <select
                id="ocr-resolution"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                defaultValue="3.0"
              >
                <option value="2.0">
                  {t('templates.ocrPdf.advanced.resolution.options.standard')}
                </option>
                <option value="3.0">
                  {t('templates.ocrPdf.advanced.resolution.options.high')}
                </option>
                <option value="4.0">
                  {t('templates.ocrPdf.advanced.resolution.options.ultra')}
                </option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                id="ocr-binarize"
                className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600"
              />
              {t('templates.ocrPdf.advanced.binarize')}
            </label>
            <div>
              <label
                htmlFor="whitelist-preset"
                className="block mb-1 text-xs font-medium text-gray-400"
              >
                {t('templates.ocrPdf.advanced.whitelistPreset.label')}
              </label>
              <select
                id="whitelist-preset"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm mb-2"
              >
                <option value="">
                  {t('templates.ocrPdf.advanced.whitelistPreset.options.none')}
                </option>
                <option value="alphanumeric">
                  {t('templates.ocrPdf.advanced.whitelistPreset.options.alphanumeric')}
                </option>
                <option value="numbers-currency">
                  {t('templates.ocrPdf.advanced.whitelistPreset.options.numbersCurrency')}
                </option>
              </select>
              <input
                type="text"
                id="ocr-whitelist"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm"
                placeholder={t('templates.ocrPdf.advanced.whitelistPreset.inputPlaceholder') ?? ''}
              />
            </div>
          </div>
        </details>
      </div>

      <div id="ocr-progress" className="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">
          {t('templates.ocrPdf.progress.processing')}
        </p>
        <progress className="w-full" id="ocr-progress-bar" max="100" value="0"></progress>
      </div>

      <div id="ocr-results" className="hidden mt-6 space-y-4">
        <textarea
          id="ocr-text-output"
          rows={10}
          className="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 font-mono"
        ></textarea>
        <div className="flex flex-wrap gap-3">
          <button id="copy-text-btn" className="btn bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold">
            {t('templates.ocrPdf.actions.copy')}
          </button>
          <button id="download-text-btn" className="btn-gradient px-4 py-2 rounded-lg text-sm font-semibold">
            {t('templates.ocrPdf.actions.download')}
          </button>
        </div>
      </div>
    </div>
  );
};
