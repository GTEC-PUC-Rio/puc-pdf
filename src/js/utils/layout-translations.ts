import { t } from '../../i18n/index.js';

const setTextContent = (elementId: string, value: string) => {
  const element = document.getElementById(elementId);
  if (element && typeof value === 'string') {
    element.textContent = value;
  }
};

export const applyLayoutTranslations = () => {
  setTextContent('nav-brand', t('nav.brand'));
  setTextContent('nav-tagline', t('nav.tagline'));
  setTextContent('footer-brand', t('nav.brand'));
  setTextContent('footer-code-link', t('footer.codeLink'));
  setTextContent(
    'footer-credit-label',
    `${t('footer.creditLabel', { defaultValue: 'Baseado em' })} `
  );
  setTextContent(
    'footer-credit-link',
    t('footer.creditLink', { defaultValue: 'BentoPDF' })
  );
  setTextContent('footer-follow-title', t('footer.followUs'));
  setTextContent('preview-title', t('preview.title'));
  setTextContent('preview-download-btn', t('preview.download'));
  setTextContent('preview-close-btn', t('preview.close'));
  setTextContent('close-tool-btn-label', t('nav.closeButton'));
};
