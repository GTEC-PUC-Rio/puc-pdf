import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import legacyMultiToolHtml from '../../../pages/pdf-multi-tool.html?raw';
import {
  setupPdfMultiToolPage,
  teardownPdfMultiToolPage,
} from '../../../js/logic/pdf-multi-tool.js';

interface ParsedMarkup {
  html: string;
  className: string;
}

const extractMarkup = (): ParsedMarkup => {
  if (typeof window === 'undefined') {
    return { html: '', className: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(legacyMultiToolHtml, 'text/html');
  const mainContainer =
    doc.getElementById('multi-tool-root') ||
    doc.querySelector('div.flex.flex-col');
  const loadingOverlay = doc.getElementById('loading-overlay');
  const modal = doc.getElementById('modal');
  const insertInput = doc.getElementById('insert-pdf-input');

  if (mainContainer) {
    const closeBtn = mainContainer.querySelector('#close-tool-btn');
    closeBtn?.setAttribute('data-router-nav', 'true');
    closeBtn?.classList.add('hidden');
  }

  const parts = [
    mainContainer?.outerHTML ?? '',
    loadingOverlay?.outerHTML ?? '',
    modal?.outerHTML ?? '',
    insertInput?.outerHTML ?? '',
  ];

  return { html: parts.join(''), className: 'legacy-multi-tool' };
};

export const PdfMultiToolTool = () => {
  const { t } = useTranslation(['tools']);
  const [{ html, className }, setMarkup] = useState<ParsedMarkup>({
    html: '',
    className: '',
  });

  useEffect(() => {
    setMarkup(extractMarkup());
  }, []);

  useEffect(() => {
    if (!html) return undefined;

    setupPdfMultiToolPage();
    return () => {
      teardownPdfMultiToolPage();
    };
  }, [html]);

  if (!html) {
    return null;
  }

  const title = t('multiTool.title', {
    ns: 'tools',
    defaultValue: 'Ferramenta completa de PDF',
  });

  return (
    <div
      data-testid="multi-tool"
      className="legacy-multi-tool bg-gray-800 rounded-xl shadow-2xl p-0 border border-gray-700 mt-4"
      aria-label={title}
    >
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </div>
  );
};
