import { ReactNode } from 'react';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MaintenanceNoticeProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export const MaintenanceNotice = ({
  title,
  description,
  icon,
  children,
}: MaintenanceNoticeProps) => {
  const { t } = useTranslation('tools');
  const resolvedTitle = title ?? t('templates.maintenance.title');
  const resolvedDescription =
    description ?? t('templates.maintenance.description');

  return (
    <div className="max-w-3xl mx-auto bg-white/95 border border-dashed border-[var(--primary)] rounded-2xl p-8 text-center space-y-4 shadow-lg">
      <div className="flex justify-center">
        {icon ?? <Wrench className="w-12 h-12 text-[var(--primary)]" />}
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">{resolvedTitle}</h2>
        <p className="text-sm text-slate-600">{resolvedDescription}</p>
      </div>
      {children}
    </div>
  );
};
