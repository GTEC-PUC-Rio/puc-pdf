import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIcons, icons } from 'lucide';
import { useTranslation } from 'react-i18next';

import { categories } from '../../js/config/tools.js';
import { Input } from '../ui/index.ts';

type ToolDefinition = (typeof categories)[number]['tools'][number] & {
  href?: string | null;
};

const mapHrefToRoute = (href?: string | null) => {
  if (!href) return null;
  if (href.startsWith('/src/pages/')) {
    const slug = href.replace('/src/pages/', '').replace(/\.html$/, '');
    if (slug === 'pdf-multi-tool') return '/multi-tool';
    return `/${slug}`;
  }
  if (href.endsWith('.html')) {
    const slug = href.replace(/^\//, '').replace(/\.html$/, '');
    return `/${slug}`;
  }
  if (href.startsWith('http')) return href;
  return href;
};

const ToolCard = ({
  tool,
  onSelect,
}: {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
}) => (
  <button
    type="button"
    className="tool-card bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg transition duration-200 w-full"
    onClick={() => onSelect(tool)}
  >
    <i data-lucide={tool.icon} className="w-10 h-10 mb-3 text-indigo-400"></i>
    <h3 className="font-semibold text-white">{tool.name}</h3>
    {tool.subtitle && (
      <p className="text-xs text-gray-400 mt-1 px-2">{tool.subtitle}</p>
    )}
  </button>
);

export const GridPage = () => {
  const { t } = useTranslation(['common', 'tools']);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [filteredCategories]);

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

  const shortcutLabel = navigator.userAgent.toUpperCase().includes('MAC')
    ? '⌘ + K'
    : 'Ctrl + K';

  return (
    <div id="grid-view">
      <div className="my-8 flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <Input
          ref={searchInputRef}
          autoFocus
          autoComplete="off"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<i data-lucide="search" className="w-5 h-5"></i>}
          wrapperClassName="flex-1 w-full"
          className="text-sm"
        />
        <span className="hidden sm:inline-flex text-xs text-slate-400 font-mono px-2 py-1 rounded-lg border border-slate-700">
          {shortcutLabel}
        </span>
      </div>

      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.name} className="category-group col-span-full">
            <h2 className="text-xl font-bold text-indigo-400 mb-4 mt-8 first:mt-0">
              {category.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {category.tools.map((toolItem) => {
                const tool = toolItem as ToolDefinition;
                return (
                  <ToolCard
                    key={tool.id ?? tool.href ?? tool.name}
                    tool={tool}
                    onSelect={(selected) => {
                      if (selected.href) {
                        const route = mapHrefToRoute(selected.href);
                        if (route?.startsWith('/')) {
                          navigate(route);
                          return;
                        }
                        if (route) {
                          window.location.href = route;
                          return;
                        }
                      }
                      if (selected.id) {
                        navigate(`/tool/${selected.id}`);
                      }
                    }}
                  />
                );
              })}
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
  );
};
