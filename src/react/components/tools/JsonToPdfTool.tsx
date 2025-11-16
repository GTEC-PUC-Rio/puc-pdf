import { useEffect } from 'react';

import { setupJsonToPdfPage } from '../../../js/logic/json-to-pdf.js';

export const JsonToPdfTool = () => {
  useEffect(() => {
    const teardown = setupJsonToPdfPage();
    return () => {
      if (typeof teardown === 'function') {
        teardown();
      }
    };
  }, []);

  return (
    <section className="py-4">
      <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-gray-200 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Converter JSON em PDF</h2>
        <p className="text-gray-400 mb-6">
          Envie vários arquivos JSON para convertê-los para PDF. Os resultados são baixados automaticamente em um
          arquivo ZIP.
        </p>
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-6">
          <p className="text-yellow-200 text-sm">
            <strong>Atenção:</strong> Somente JSON gerados pela ferramenta de conversão PDF → JSON são aceitos. Arquivos
            originados de outros sistemas podem falhar.
          </p>
        </div>

        <div className="upload-section mb-6">
          <div className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i data-lucide="upload-cloud" className="w-10 h-10 mb-3 text-gray-400"></i>
              <p className="mb-2 text-sm text-gray-300">
                <span className="font-semibold">Clique para selecionar arquivos</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">Aceita múltiplos arquivos JSON</p>
              <p className="text-xs text-gray-500">Seus arquivos nunca saem do seu dispositivo.</p>
            </div>
            <input
              type="file"
              id="jsonFiles"
              accept="application/json"
              multiple
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div id="fileList" className="mt-4 hidden"></div>

          <button id="convertBtn" className="btn-gradient w-full mt-6" disabled>
            Converter para PDF
          </button>
        </div>

        <div id="status-message" className="mt-4 hidden p-3 rounded-lg text-sm"></div>
      </div>
    </section>
  );
};
