import { beforeAll, afterEach, afterAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { initI18n, i18next } from '@/i18n/index';
import { ToolPage } from '@/react/pages/ToolPage';

const renderRoute = (initialEntry: string) =>
  render(
    <I18nextProvider i18n={i18next}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/" element={<div data-testid="grid-placeholder">Grid</div>} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );

describe('Declarative tool routes', () => {
  beforeAll(async () => {
    await initI18n();
    if (!window.scrollTo) {
      window.scrollTo = () => undefined;
    }
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders the encrypt tool when navigating directly to /tool/encrypt', () => {
    renderRoute('/tool/encrypt');

    expect(screen.getByRole('heading', { name: /proteger pdf/i })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /voltar às ferramentas/i })
    ).toBeTruthy();
  });

  it('loads advanced editors such as sign-pdf directly', () => {
    renderRoute('/tool/sign-pdf');

    expect(screen.getByRole('heading', { name: /assinar pdf/i })).toBeTruthy();
    expect(screen.getByText(/suas assinaturas salvas/i)).toBeTruthy();
  });

  it('supports legacy tools mounted via wrappers such as bookmark-pdf', async () => {
    renderRoute('/tool/bookmark-pdf');

    const bookmark = await screen.findByTestId('bookmark-tool');
    expect(bookmark).toBeTruthy();
  });

  it('renders the PDF → JSON converter directly', () => {
    renderRoute('/tool/pdf-to-json');

    expect(screen.getByRole('heading', { name: /converter pdf em json/i })).toBeTruthy();
    expect(screen.getByText(/converter para json/i)).toBeTruthy();
  });

  it('renders the JSON → PDF converter directly', () => {
    renderRoute('/tool/json-to-pdf');

    expect(screen.getByRole('heading', { name: /converter json em pdf/i })).toBeTruthy();
    expect(screen.getByText(/converter para pdf/i)).toBeTruthy();
  });

  it('navigates back to the grid when the tool id is unknown', async () => {
    renderRoute('/tool/does-not-exist');

    const grid = await screen.findByTestId('grid-placeholder');
    expect(grid).toBeTruthy();
  });
});
