import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { App } from './App.tsx';
import { i18next } from '../i18n/index.js';

export type ReactRootHandle = Root | null;

export const mountReactApp = (container: HTMLElement): ReactRootHandle => {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </StrictMode>
  );

  return root;
};
