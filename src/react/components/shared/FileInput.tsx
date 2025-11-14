import { useTranslation } from 'react-i18next';

interface FileInputProps {
  multiple?: boolean;
  accept?: string;
  showControls?: boolean;
}

export const FileInput = ({
  multiple = false,
  accept = 'application/pdf',
  showControls = false,
}: FileInputProps) => {
  const { t } = useTranslation('common');
  const multiHint = t('upload.multiHint');
  const singleHint = t('upload.singleHint');

  return (
    <>
      <div
        id="drop-zone"
        className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <i data-lucide="upload-cloud" className="w-10 h-10 mb-3 text-gray-400"></i>
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">{t('upload.ctaPrimary')}</span>{' '}
            {t('upload.ctaSecondary')}
          </p>
          <p className="text-xs text-gray-500">
            {multiple ? multiHint : singleHint}
          </p>
          <p className="text-xs text-gray-500">{t('upload.privacy')}</p>
        </div>
        <input
          id="file-input"
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          multiple={multiple}
          accept={accept}
        />
      </div>

      {showControls && (
        <div id="file-controls" className="hidden mt-4 flex gap-3">
          <button
            id="add-more-btn"
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            type="button"
          >
            <i data-lucide="plus"></i> {t('upload.addMore')}
          </button>
          <button
            id="clear-files-btn"
            className="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            type="button"
          >
            <i data-lucide="x"></i> {t('upload.clearAll')}
          </button>
        </div>
      )}
    </>
  );
};
