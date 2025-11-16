import { useTranslation } from 'react-i18next';

import { MaintenanceNotice } from '../shared/MaintenanceNotice.tsx';

export const SignPdfMaintenanceTool = () => {
  const { t } = useTranslation('tools');

  return (
    <MaintenanceNotice
      title={t('templates.signPdf.maintenance.title')}
      description={t('templates.signPdf.maintenance.description')}
    />
  );
};
