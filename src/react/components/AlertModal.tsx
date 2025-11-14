import { createPortal } from 'react-dom';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const AlertModal = ({
  visible,
  title,
  message,
  onClose,
}: AlertModalProps) => {
  if (!visible) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 max-w-sm w-full p-6 rounded-lg border border-gray-700 shadow-xl text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {title || 'Alerta'}
        </h3>
        <p className="text-gray-300 mb-6 whitespace-pre-line">
          {message || 'Esta é uma mensagem de alerta.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700"
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
};
