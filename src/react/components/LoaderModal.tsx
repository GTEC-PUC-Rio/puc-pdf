import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface LoaderModalProps {
  visible: boolean;
  text: string;
}

export const LoaderModal = ({ visible, text }: LoaderModalProps) => {
  const { t } = useTranslation('alerts');

  if (!visible) {
    return null;
  }

  const message = text || t('loading', { defaultValue: 'Processando...' });

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center gap-4 border border-gray-700 shadow-xl">
        <div className="solid-spinner"></div>
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>,
    document.body
  );
};
