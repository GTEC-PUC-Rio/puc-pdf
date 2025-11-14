import { createIcons, icons } from 'lucide';
import * as pdfjsLib from 'pdfjs-dist';
import '../css/styles.css';
import { pdfWorkerUrl } from './utils/pdfjs-worker.js';
import { initI18n } from '../i18n/index.js';
import { mountReactApp } from '../react/main.tsx';
import { applyLayoutTranslations } from './utils/layout-translations.js';

const init = () => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const reactRoot = document.getElementById('react-root');
  if (reactRoot) {
    reactRoot.innerHTML = '';
    mountReactApp(reactRoot);
  }

  createIcons({ icons });
  console.log('Compartilhe o PUC PDF com quem precisa de ferramentas privadas!');
};

document.addEventListener('DOMContentLoaded', () => {
  initI18n().then(() => {
    applyLayoutTranslations();
    init();
  });
});
