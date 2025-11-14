import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const SplitTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    createIcons({ icons });

    const logic = toolLogic['split'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }

    setupFileInputHandler('split');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.split.title')}
      </h2>
      <p className="mb-6 text-gray-400">{t('templates.split.description')}</p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="split-options" className="hidden mt-6">
        <label
          htmlFor="split-mode"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.split.modeLabel')}
        </label>
        <select
          id="split-mode"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4"
          defaultValue="range"
        >
          <option value="range">{t('templates.split.modeOptions.range')}</option>
          <option value="even-odd">
            {t('templates.split.modeOptions.evenOdd')}
          </option>
          <option value="all">{t('templates.split.modeOptions.all')}</option>
          <option value="visual">{t('templates.split.modeOptions.visual')}</option>
          <option value="bookmarks">
            {t('templates.split.modeOptions.bookmarks')}
          </option>
          <option value="n-times">
            {t('templates.split.modeOptions.nTimes')}
          </option>
        </select>

        <div id="range-panel">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.split.rangePanel.heading')}
              </strong>
            </p>
            <ul className="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
              <li>{t('templates.split.rangePanel.tips.0')}</li>
              <li>{t('templates.split.rangePanel.tips.1')}</li>
              <li>{t('templates.split.rangePanel.tips.2')}</li>
            </ul>
          </div>
          <p className="mb-2 font-medium text-white">
            {t('templates.split.rangePanel.totalPages')} <span id="total-pages"></span>
          </p>
          <label
            htmlFor="page-range"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.split.rangePanel.inputLabel')}
          </label>
          <input
            type="text"
            id="page-range"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            placeholder={t('templates.split.rangePanel.placeholder') ?? ''}
          />
        </div>

        <div id="even-odd-panel" className="hidden">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.split.evenOddPanel.heading')}
              </strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t('templates.split.evenOddPanel.description')}
            </p>
          </div>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
              <input
                type="radio"
                name="even-odd-choice"
                value="odd"
                defaultChecked
                className="hidden"
              />
              <span className="font-semibold text-white">
                {t('templates.split.evenOddPanel.oddOption')}
              </span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
              <input
                type="radio"
                name="even-odd-choice"
                value="even"
                className="hidden"
              />
              <span className="font-semibold text-white">
                {t('templates.split.evenOddPanel.evenOption')}
              </span>
            </label>
          </div>
        </div>

        <div id="visual-select-panel" className="hidden">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.split.visualPanel.heading')}
              </strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t('templates.split.visualPanel.description')}
            </p>
          </div>
          <div
            id="page-selector-grid"
            className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[150px]"
          ></div>
        </div>

        <div
          id="all-pages-panel"
          className="hidden p-3 bg-gray-900 rounded-lg border border-gray-700"
        >
          <p className="text-sm text-gray-300">
            <strong className="text-white">
              {t('templates.split.allPagesPanel.heading')}
            </strong>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t('templates.split.allPagesPanel.description')}
          </p>
        </div>

        <div id="bookmarks-panel" className="hidden">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.split.bookmarksPanel.heading')}
              </strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t('templates.split.bookmarksPanel.description')}
            </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="bookmark-level"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.split.bookmarksPanel.levelLabel')}
            </label>
            <select
              id="bookmark-level"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              defaultValue="all"
            >
              <option value="0">
                {t('templates.split.bookmarksPanel.options.level0')}
              </option>
              <option value="1">
                {t('templates.split.bookmarksPanel.options.level1')}
              </option>
              <option value="2">
                {t('templates.split.bookmarksPanel.options.level2')}
              </option>
              <option value="3">
                {t('templates.split.bookmarksPanel.options.level3')}
              </option>
              <option value="all">
                {t('templates.split.bookmarksPanel.options.all')}
              </option>
            </select>
            <p className="mt-1 text-xs text-gray-400">
              {t('templates.split.bookmarksPanel.helper')}
            </p>
          </div>
        </div>

        <div id="n-times-panel" className="hidden">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p className="text-sm text-gray-300">
              <strong className="text-white">
                {t('templates.split.nTimesPanel.heading')}
              </strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {t('templates.split.nTimesPanel.description')}
            </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="split-n-value"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              {t('templates.split.nTimesPanel.label')}
            </label>
            <input
              type="number"
              id="split-n-value"
              min={1}
              defaultValue={5}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            />
            <p className="mt-1 text-xs text-gray-400">
              {t('templates.split.nTimesPanel.inputHelper')}
            </p>
          </div>
          <div
            id="n-times-warning"
            className="hidden p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg mb-3"
          >
            <p className="text-sm text-yellow-200">
              <strong>{t('templates.split.nTimesPanel.warningLabel')}</strong>{' '}
              <span id="n-times-warning-text"></span>
            </p>
          </div>
        </div>

        <div id="zip-option-wrapper" className="hidden mt-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <input
              type="checkbox"
              id="download-as-zip"
              className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
            />
            {t('templates.split.zipOption')}
          </label>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.split.submit')}
        </button>
      </div>
    </div>
  );
};
