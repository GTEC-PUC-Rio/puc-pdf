import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoaderModal } from '../components/LoaderModal.tsx';
import { AlertModal } from '../components/AlertModal.tsx';
import {
  registerLoaderBridge,
  unregisterLoaderBridge,
  registerAlertBridge,
  unregisterAlertBridge,
  hideAlertOverlay,
} from '../bridge/uiBridge.ts';
import type {
  LoaderOverlayState,
  AlertOverlayState,
} from '../bridge/uiBridge.ts';

export const AppLayout = () => {
  const { t } = useTranslation(['alerts']);
  const [loaderState, setLoaderState] = useState<LoaderOverlayState>({
    visible: false,
    text: '',
  });
  const [alertState, setAlertState] = useState<AlertOverlayState>({
    visible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    registerLoaderBridge(setLoaderState);
    registerAlertBridge(setAlertState);
    return () => {
      unregisterLoaderBridge();
      unregisterAlertBridge();
    };
  }, []);

  return (
    <>
      <div className="min-h-screen container mx-auto">
        <Outlet />
      </div>
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
