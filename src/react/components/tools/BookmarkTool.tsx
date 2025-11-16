import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import legacyBookmarkHtml from '../../../pages/bookmark.html?raw';
import {
  setupBookmarkPage,
  teardownBookmarkPage,
} from '../../../js/logic/bookmark-pdf.js';

const extractBookmarkMarkup = (html: string) => {
  if (typeof window === 'undefined') return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const uploader = doc.getElementById('uploader');
  const app = doc.getElementById('app');
  if (app) {
    app.id = 'bookmark-app';
  }
  const backBtn = doc.getElementById('back-to-tools');
  backBtn?.setAttribute('data-router-nav', 'true');
  backBtn?.classList.add('hidden');
  const modalContainer = doc.getElementById('modal-container');
  return [
    uploader?.outerHTML ?? '',
    app?.outerHTML ?? '',
    modalContainer?.outerHTML ?? '',
  ].join('');
};

export const BookmarkTool = () => {
  const { t } = useTranslation(['tools']);
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    const content = extractBookmarkMarkup(legacyBookmarkHtml);
    setMarkup(content);
  }, []);

  useEffect(() => {
    if (!markup) return undefined;

    let raf = 0;
    let mounted = true;

    const init = () => {
      if (!mounted) return;
      const initialized = setupBookmarkPage();

      if (!initialized) {
        raf = requestAnimationFrame(init);
      }
    };

    raf = requestAnimationFrame(init);

    return () => {
      mounted = false;
      if (raf) cancelAnimationFrame(raf);
      teardownBookmarkPage();
    };
  }, [markup]);

  if (!markup) {
    return null;
  }

  const title = t('templates.bookmark.title', {
    defaultValue: 'Editar marcadores',
  });

  return (
    <div
      data-testid="bookmark-tool"
      className="legacy-bookmark bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700 mt-8"
    >
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
};
