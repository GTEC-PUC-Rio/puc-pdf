import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToolMeta } from '../../utils/toolMeta.ts';

export const ToolBreadcrumb = ({
  toolId,
  fallbackTitle,
  className = '',
}: {
  toolId?: string;
  fallbackTitle?: string;
  className?: string;
}) => {
  const { t } = useTranslation(['tools']);
  const toolName = toolId ? getToolMeta(toolId)?.name : null;
  const title = toolName || fallbackTitle || toolId || '';

  return (
    <nav
      className={`flex items-center text-sm text-gray-400 ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold"
      >
        <i data-lucide="arrow-left" className="w-4 h-4"></i>
        {t('cta.backToTools', {
          defaultValue: 'Voltar às ferramentas',
          ns: 'tools',
        })}
      </Link>
      {title && (
        <span className="ml-3 text-white font-semibold truncate" title={title}>
          {title}
        </span>
      )}
    </nav>
  );
};
