import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';
import { toolLogic } from '../../../js/logic/index.js';

export const TxtToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    const logic = toolLogic['txt-to-pdf'];
    if (logic && typeof logic.setup === 'function') {
      logic.setup();
    }
    setupFileInputHandler('txt-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.txtToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.txtToPdf.description')}
      </p>

      <div className="mb-4">
        <div className="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
          <button
            id="txt-mode-upload-btn"
            type="button"
            className="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md"
          >
            {t('templates.txtToPdf.tabs.upload')}
          </button>
          <button
            id="txt-mode-text-btn"
            type="button"
            className="flex-1 btn bg-gray-700 text-gray-300 font-semibold py-2 rounded-md"
          >
            {t('templates.txtToPdf.tabs.text')}
          </button>
        </div>

        <div id="txt-upload-panel">
          <FileInput
            multiple
            accept="text/plain,.txt"
            showControls
          />
          <div id="file-display-area" className="mt-4 space-y-2"></div>
        </div>

        <div id="txt-text-panel" className="hidden">
          <textarea
            id="text-input"
            rows={12}
            className="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans"
            placeholder={t('templates.txtToPdf.textareaPlaceholder') ?? ''}
          ></textarea>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="font-family"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.txtToPdf.form.fontFamily')}
          </label>
          <select
            id="font-family"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="TimesRoman">Times New Roman</option>
            <option value="Courier">Courier</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="font-size"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.txtToPdf.form.fontSize')}
          </label>
          <input
            type="number"
            id="font-size"
            defaultValue={12}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          />
        </div>
        <div>
          <label
            htmlFor="page-size"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.txtToPdf.form.pageSize')}
          </label>
          <select
            id="page-size"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="A4">A4</option>
            <option value="Letter">Carta</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="text-color"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.txtToPdf.form.textColor')}
          </label>
          <input
            type="color"
            id="text-color"
            defaultValue="#000000"
            className="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer"
          />
        </div>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.txtToPdf.submit')}
      </button>
    </div>
  );
};
