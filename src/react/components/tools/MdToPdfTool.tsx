import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const MdToPdfTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('md-to-pdf');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.mdToPdf.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.mdToPdf.description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="page-format"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.mdToPdf.options.pageFormat')}
          </label>
          <select
            id="page-format"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="a4">A4</option>
            <option value="letter">Carta</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="orientation"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.mdToPdf.options.orientation')}
          </label>
          <select
            id="orientation"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="portrait">Retrato</option>
            <option value="landscape">Paisagem</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="margin-size"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            {t('templates.mdToPdf.options.margins')}
          </label>
          <select
            id="margin-size"
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
          >
            <option value="normal">Normal</option>
            <option value="narrow">Estreita</option>
            <option value="wide">Larga</option>
          </select>
        </div>
      </div>

      <div className="h-[50vh]">
        <label
          htmlFor="md-input"
          className="block mb-2 text-sm font-medium text-gray-300"
        >
          {t('templates.mdToPdf.editorLabel')}
        </label>
        <textarea
          id="md-input"
          className="w-full h-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 font-mono resize-none"
          placeholder={t('templates.mdToPdf.editorPlaceholder') ?? ''}
        ></textarea>
      </div>

      <button id="process-btn" className="btn-gradient w-full mt-6">
        {t('templates.mdToPdf.submit')}
      </button>
    </div>
  );
};
