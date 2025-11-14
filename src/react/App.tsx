import { useEffect, useMemo, useRef, useState } from 'react';
import { createIcons, icons } from 'lucide';
import { useTranslation } from 'react-i18next';

import { categories } from '../js/config/tools.js';
import { setupToolInterface } from '../js/handlers/toolSelectionHandler.js';
import { withBasePath } from '../js/utils/base-path.js';
import { LoaderModal } from './components/LoaderModal.tsx';
import { AlertModal } from './components/AlertModal.tsx';
import {
  registerLoaderBridge,
  unregisterLoaderBridge,
  registerAlertBridge,
  unregisterAlertBridge,
  registerViewBridge,
  unregisterViewBridge,
  registerReactToolBridge,
  unregisterReactToolBridge,
  hideAlertOverlay,
} from './bridge/uiBridge.ts';
import type {
  LoaderOverlayState,
  AlertOverlayState,
  AppView,
} from './bridge/uiBridge.ts';
import { switchView } from '../js/ui.ts';
import { getReactToolComponent } from './bridge/reactToolRegistry.ts';

type Tool = (typeof categories)[number]['tools'][number];

const ToolCard = ({ tool }: { tool: Tool }) => {
  const handleClick = () => {
    if (!tool.href) {
      setupToolInterface(tool.id);
    }
  };

  const CardContent = (
    <>
      <i data-lucide={tool.icon} className="w-10 h-10 mb-3 text-indigo-400"></i>
      <h3 className="font-semibold text-white">{tool.name}</h3>
      {tool.subtitle && (
        <p className="text-xs text-gray-400 mt-1 px-2">{tool.subtitle}</p>
      )}
    </>
  );

  if (tool.href) {
    return (
      <a
        href={withBasePath(tool.href)}
        className="tool-card block bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition duration-200"
        rel="noopener noreferrer"
      >
        {CardContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="tool-card bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition duration-200 w-full"
      onClick={handleClick}
    >
      {CardContent}
    </button>
  );
};

const ToolInterfaceShell = ({
  isVisible,
  backLabel,
  reactToolId,
}: {
  isVisible: boolean;
  backLabel: string;
  reactToolId: string | null;
}) => {
  const ToolComponent = reactToolId ? getReactToolComponent(reactToolId) : null;

  return (
    <div
      id="tool-interface"
      className={`${
        isVisible ? '' : 'hidden'
      } w-full max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700`}
    >
      <button
        id="back-to-grid"
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 font-semibold"
        type="button"
        onClick={() => switchView('grid')}
      >
        <i data-lucide="arrow-left" className="cursor-pointer"></i>
        <span className="cursor-pointer">{backLabel}</span>
      </button>
      {ToolComponent ? <ToolComponent /> : <div id="tool-content"></div>}
    </div>
  );
};

export const App = () => {
  const { t } = useTranslation(['common', 'tools', 'alerts']);
  const [searchTerm, setSearchTerm] = useState('');
  const [loaderState, setLoaderState] = useState<LoaderOverlayState>({
    visible: false,
    text: '',
  });
  const [alertState, setAlertState] = useState<AlertOverlayState>({
    visible: false,
    title: '',
    message: '',
  });
  const [activeView, setActiveView] = useState<AppView>('grid');
  const [reactToolId, setReactToolId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;

    return categories
      .map((category) => ({
        ...category,
        tools: category.tools.filter((tool) => {
          const title = tool.name.toLowerCase();
          const subtitle = tool.subtitle?.toLowerCase() || '';
          return title.includes(term) || subtitle.includes(term);
        }),
      }))
      .filter((category) => category.tools.length > 0);
  }, [searchTerm]);

  useEffect(() => {
    createIcons({ icons });
  }, [filteredCategories, activeView]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isMac = navigator.userAgent.toUpperCase().includes('MAC');
      const isCtrlK = e.ctrlKey && key === 'k';
      const isCmdK = isMac && e.metaKey && key === 'k';

      if (isCtrlK || isCmdK) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const shortcutLabel = navigator.userAgent.toUpperCase().includes('MAC')
    ? '⌘ + K'
    : 'Ctrl + K';

  useEffect(() => {
    registerLoaderBridge(setLoaderState);
    registerAlertBridge(setAlertState);
    registerViewBridge(setActiveView);
    registerReactToolBridge(setReactToolId);

    return () => {
      unregisterLoaderBridge();
      unregisterAlertBridge();
      unregisterViewBridge();
      unregisterReactToolBridge();
    };
  }, []);

  return (
    <>
      <div id="grid-view" className={activeView === 'grid' ? '' : 'hidden'}>
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('grid.title', {
              ns: 'tools',
              defaultValue: 'Ferramentas de PDF',
            })}
          </h1>
          <p className="text-gray-400">
            {t('grid.subtitle', {
              ns: 'tools',
              defaultValue: 'Selecione uma ferramenta para começar.',
            })}
          </p>
        </header>

        <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <i data-lucide="search" className="w-5 h-5 text-gray-400"></i>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!isMobile && (
              <span className="absolute inset-y-0 right-0 flex items-center rounded-lg pr-2">
                <kbd className="bg-gray-800 px-1 rounded-lg">
                  {shortcutLabel}
                </kbd>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name} className="category-group col-span-full">
              <h2 className="text-xl font-bold text-indigo-400 mb-4 mt-8 first:mt-0">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.id ?? tool.href} tool={tool} />
                ))}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-center text-gray-400">
              {t('grid.noResults', {
                ns: 'tools',
                defaultValue: 'Nenhuma ferramenta encontrada.',
              })}
            </p>
          )}
        </div>
      </div>

      <ToolInterfaceShell
        isVisible={activeView === 'tool'}
        backLabel={t('cta.backToTools', {
          ns: 'tools',
          defaultValue: 'Voltar às ferramentas',
        })}
        reactToolId={reactToolId}
      />

      <LoaderModal visible={loaderState.visible} text={loaderState.text} />
      <AlertModal
        visible={alertState.visible}
        title={
          alertState.title ||
          t('defaultTitle', { ns: 'alerts', defaultValue: 'Alerta' })
        }
        message={
          alertState.message ||
          t('defaultMessage', {
            ns: 'alerts',
            defaultValue: 'Esta é uma mensagem de alerta.',
          })
        }
        onClose={() => hideAlertOverlay()}
      />
    </>
  );
};
