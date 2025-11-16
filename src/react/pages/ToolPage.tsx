import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createIcons, icons } from 'lucide';

import { getReactToolComponent } from '../bridge/reactToolRegistry.ts';
import { state, resetState } from '../../js/state.js';
import { ToolBreadcrumb } from '../components/navigation/ToolBreadcrumb.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { protectedTools } from '../utils/protectedTools.ts';
import { Button, Surface } from '../ui/index.ts';

export const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { t } = useTranslation(['tools']);
  const { isAuthenticated, login, loading: authLoading, error: authError } = useAuth();

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
  const requiresAuth = toolId ? protectedTools.has(toolId) : false;
  const handleLogin = () => {
    if (toolId) {
      void login(`/tool/${toolId}`);
    } else {
      void login('/');
    }
  };

  if (requiresAuth && authLoading) {
    return (
      <div className="w-full mx-auto max-w-6xl mt-4 space-y-4">
        <ToolBreadcrumb toolId={toolId} className="mb-2" />
        <Surface padding="lg" elevation="md" className="text-white">
          {t('auth.loading', {
            ns: 'tools',
            defaultValue: 'Carregando sessão...',
          })}
        </Surface>
      </div>
    );
  }

  if (requiresAuth && !isAuthenticated) {
    return (
      <div className="w-full mx-auto max-w-6xl mt-4 space-y-4">
        <ToolBreadcrumb toolId={toolId} className="mb-2" />
      <Surface padding="lg" elevation="md" className="text-white">
        <h2 className="text-2xl font-bold mb-2">
          {t('auth.requiredTitle', {
            ns: 'tools',
            defaultValue: 'Login obrigatório',
          })}
        </h2>
          <p className="text-gray-300 mb-4">
            {t('auth.requiredMessage', {
              ns: 'tools',
              defaultValue:
                'Esta ferramenta exige autenticação. Faça login para continuar.',
            })}
          </p>
          {authError && <p className="text-sm text-red-300 mb-4">{authError}</p>}
          <Button onClick={handleLogin}>
            {t('auth.loginCta', {
              ns: 'tools',
              defaultValue: 'Fazer login',
            })}
          </Button>
        </Surface>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-6xl mt-4 space-y-4">
      <ToolBreadcrumb toolId={toolId} className="mb-2" />
      {ToolComponent ? <ToolComponent /> : <Navigate to="/" replace />}
    </div>
  );
};
