import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { i18next } from '../i18n/index.js';
import { AppLayout } from './layouts/AppLayout.tsx';
import { StaticLayout } from './components/static/StaticLayout.tsx';
import { AboutPage } from './components/static/AboutPage.tsx';
import { ContactPage } from './components/static/ContactPage.tsx';
import { FaqPage } from './components/static/FaqPage.tsx';
import { PrivacyPage } from './components/static/PrivacyPage.tsx';
import { TermsPage } from './components/static/TermsPage.tsx';
import { GridPage } from './pages/GridPage.tsx';
import { ToolPage } from './pages/ToolPage.tsx';

const StaticRoute = ({ children }: { children: React.ReactNode }) => (
  <StaticLayout>{children}</StaticLayout>
);

const PlaceholderPage = ({ title }: { title: string }) => (
  <StaticLayout>
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-400">
        Esta página será migrada para React em breve. Por enquanto, use a versão legada.
      </p>
    </div>
  </StaticLayout>
);

export const RootRouter = () => (
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <BrowserRouter basename={import.meta.env.BASE_URL ?? '/'}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<GridPage />} />
            <Route path="/tool/:toolId" element={<ToolPage />} />
          </Route>
          <Route
            path="/about"
            element={
              <StaticRoute>
                <AboutPage />
              </StaticRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <StaticRoute>
                <ContactPage />
              </StaticRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <StaticRoute>
                <FaqPage />
              </StaticRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <StaticRoute>
                <PrivacyPage />
              </StaticRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <StaticRoute>
                <TermsPage />
              </StaticRoute>
            }
          />

          <Route path="/pdf-to-json" element={<Navigate to="/tool/pdf-to-json" replace />} />
          <Route path="/json-to-pdf" element={<Navigate to="/tool/json-to-pdf" replace />} />
          <Route path="/multi-tool" element={<Navigate to="/tool/multi-tool" replace />} />
          <Route path="/bookmark" element={<Navigate to="/tool/bookmark-pdf" replace />} />

          <Route path="/table-of-contents" element={<Navigate to="/tool/table-of-contents" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
);
