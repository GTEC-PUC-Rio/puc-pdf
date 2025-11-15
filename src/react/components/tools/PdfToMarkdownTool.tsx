import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const PdfToMarkdownTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('pdf-to-markdown');
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.pdfToMarkdown.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.pdfToMarkdown.description')}
      </p>

      <FileInput accept=".pdf" />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div
        id="quality-note"
        className="hidden mt-4 p-3 bg-gray-900 border border-yellow-500/30 text-yellow-200 rounded-lg"
      >
        <p className="text-sm text-gray-400">
          {t('templates.pdfToMarkdown.note')}
        </p>
      </div>

      <button id="process-btn" className="hidden btn-gradient w-full mt-6">
        {t('templates.pdfToMarkdown.submit')}
      </button>
    </div>
  );
};
