import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { FileInput } from '../shared/FileInput.tsx';
import { setupFileInputHandler } from '../../../js/handlers/fileHandler.js';

export const RemoveAnnotationsTool = () => {
  const { t } = useTranslation('tools');

  useEffect(() => {
    setupFileInputHandler('remove-annotations');
  }, []);

  const annotationKeys = [
    'highlight',
    'strikeOut',
    'underline',
    'ink',
    'polygon',
    'square',
    'circle',
    'line',
    'polyLine',
    'link',
    'text',
    'freeText',
    'popup',
    'squiggly',
    'stamp',
    'caret',
    'fileAttachment',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">
        {t('templates.removeAnnotations.title')}
      </h2>
      <p className="mb-6 text-gray-400">
        {t('templates.removeAnnotations.description')}
      </p>

      <FileInput />

      <div id="file-display-area" className="mt-4 space-y-2"></div>

      <div id="remove-annotations-options" className="hidden mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('templates.removeAnnotations.pageSelection.heading')}
          </h3>
          <div className="flex gap-4 p-2 rounded-lg bg-gray-900">
            <label className="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="page-scope"
                value="all"
                defaultChecked
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-white">
                {t('templates.removeAnnotations.pageSelection.all')}
              </span>
            </label>
            <label className="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
              <input
                type="radio"
                name="page-scope"
                value="specific"
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-white">
                {t('templates.removeAnnotations.pageSelection.specific')}
              </span>
            </label>
          </div>
          <div id="page-range-wrapper" className="hidden mt-2">
            <input
              type="text"
              id="page-range-input"
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              placeholder={
                t('templates.removeAnnotations.pageSelection.placeholder') ?? ''
              }
            />
            <p
              className="text-xs text-gray-400 mt-1"
              dangerouslySetInnerHTML={{
                __html: t(
                  'templates.removeAnnotations.pageSelection.helper',
                  {
                    total: '<span id="total-pages"></span>',
                  }
                ) as string,
              }}
            ></p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {t('templates.removeAnnotations.annotationSelection.heading')}
          </h3>
          <div className="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="border-b border-gray-700 pb-2">
              <label className="flex items-center gap-2 font-semibold text-white cursor-pointer">
                <input
                  type="checkbox"
                  id="select-all-annotations"
                  className="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600"
                />
                {t('templates.removeAnnotations.annotationSelection.selectAll')}
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2 text-white text-sm">
              {annotationKeys.map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" className="annot-checkbox" value={key} />{' '}
                  {t(`templates.removeAnnotations.annotations.${key}`)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button id="process-btn" className="btn-gradient w-full mt-6">
          {t('templates.removeAnnotations.submit')}
        </button>
      </div>
    </div>
  );
};
