import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { getReactToolComponent } from '../bridge/reactToolRegistry.ts';
import { state, resetState } from '../../js/state.js';
import { ToolBreadcrumb } from '../components/navigation/ToolBreadcrumb.tsx';

export const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useTranslation(['tools']);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [toolId]);

  useEffect(() => {
    resetState();
    state.activeTool = toolId;
    createIcons({ icons });
    return () => {
      resetState();
    };
  }, [toolId]);

  if (!toolId) {
    return <Navigate to="/" replace />;
  }

  const ToolComponent = getReactToolComponent(toolId);

  return (
    <div className="w-full mx-auto max-w-6xl mt-4 space-y-4">
      <ToolBreadcrumb toolId={toolId} className="mb-2" />
      {ToolComponent ? <ToolComponent /> : <Navigate to="/" replace />}
    </div>
  );
};
