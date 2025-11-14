import i18next, { TFunction } from 'i18next';

import common from '../locales/pt-BR/common.json';
import alerts from '../locales/pt-BR/alerts.json';
import tools from '../locales/pt-BR/tools.json';

let initializing: Promise<TFunction> | null = null;

export const initI18n = () => {
  if (i18next.isInitialized) {
    return Promise.resolve(i18next.t.bind(i18next));
  }

  if (!initializing) {
    initializing = i18next.init({
      lng: 'pt-BR',
      fallbackLng: 'pt-BR',
      resources: {
        'pt-BR': {
          common,
          alerts,
          tools,
        },
      },
      ns: ['common', 'alerts', 'tools'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
    });
  }

  return initializing.then(() => i18next.t.bind(i18next));
};

export const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, options);

export { i18next };
