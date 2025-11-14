import { dom, switchView, hideAlert } from './ui.js';
import { createIcons, icons } from 'lucide';
import * as pdfjsLib from 'pdfjs-dist';
import '../css/styles.css';
import { pdfWorkerUrl } from './utils/pdfjs-worker.js';
import { initI18n, t } from '../i18n/index.js';
import { mountReactApp } from '../react/main.tsx';
import { applyLayoutTranslations } from './utils/layout-translations.js';

const applyStaticTranslations = () => {
  applyLayoutTranslations();

  const headerTitle =
    document.querySelector<HTMLHeadingElement>('#tools-header h1');
  if (headerTitle) {
    headerTitle.textContent = t('grid.title', { ns: 'tools' });
  }

  const headerSubtitle =
    document.querySelector<HTMLParagraphElement>('#tools-header p');
  if (headerSubtitle) {
    headerSubtitle.textContent = t('grid.subtitle', { ns: 'tools' });
  }

  const backToToolsLabel = document.querySelector<HTMLSpanElement>(
    '#back-to-grid span'
  );
  if (backToToolsLabel) {
    backToToolsLabel.textContent = t('cta.backToTools', { ns: 'tools' });
  }
};

const init = () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const gridView = document.getElementById('grid-view');
  if (gridView) {
    gridView.innerHTML = '';
    mountReactApp(gridView);
  }

  dom.backToGridBtn.addEventListener('click', () => switchView('grid'));
  dom.alertOkBtn.addEventListener('click', hideAlert);

  createIcons({ icons });
  console.log('Compartilhe o PUC PDF com quem precisa de ferramentas privadas!');
};

document.addEventListener('DOMContentLoaded', () => {
  initI18n().then(() => {
    applyStaticTranslations();
    init();
  });
});
