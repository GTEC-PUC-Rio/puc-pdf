import { useEffect } from 'react';

import {
  setupTableOfContentsPage,
  teardownTableOfContentsPage,
} from '../../../js/logic/table-of-contents.js';

export const TableOfContentsTool = () => {
  useEffect(() => {
    setupTableOfContentsPage();
    return () => teardownTableOfContentsPage();
  }, []);

  return (
    <section id="uploader" className="py-2">
      <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-gray-200 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Gerar sumário automático</h2>
        <p className="text-gray-400 mb-6">
          Envie um PDF com marcadores para gerar uma página de sumário pronta para impressão.
        </p>

        <div
          id="drop-zone"
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <i data-lucide="upload-cloud" className="w-10 h-10 mb-3 text-gray-400"></i>
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Clique para selecionar um arquivo</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500">Apenas um arquivo PDF</p>
            <p className="text-xs text-gray-500">Seus arquivos nunca saem do seu dispositivo.</p>
          </div>
          <input
            type="file"
            id="file-input"
            accept=".pdf"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div id="file-display-area" className="mt-4 hidden"></div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="toc-title">
              Título do sumário
            </label>
            <input
              type="text"
              id="toc-title"
              defaultValue="Sumário"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sumário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="font-size">
              Tamanho da fonte
            </label>
            <select
              id="font-size"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="12"
            >
              {[10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 30, 36, 42, 48, 60, 72].map((size) => (
                <option key={size} value={size}>
                  {size}pt
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="font-family">
              Família tipográfica
            </label>
            <select
              id="font-family"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="4"
            >
              <option value="0">Times Roman</option>
              <option value="1">Times Bold</option>
              <option value="2">Times Italic</option>
              <option value="3">Times Bold Italic</option>
              <option value="4">Helvetica</option>
              <option value="5">Helvetica Bold</option>
              <option value="6">Helvetica Oblique</option>
              <option value="7">Helvetica Bold Oblique</option>
              <option value="8">Courier</option>
              <option value="9">Courier Bold</option>
              <option value="10">Courier Oblique</option>
              <option value="11">Courier Bold Oblique</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="add-bookmark"
              defaultChecked
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="add-bookmark" className="text-sm text-gray-300">
              Adicionar marcador para a página do sumário
            </label>
          </div>
        </div>

        <button id="generate-btn" className="btn-gradient w-full mt-6" disabled>
          <span id="generate-btn-text">Gerar sumário</span>
        </button>

        <div id="status-message" className="mt-4 hidden p-3 rounded-lg text-sm"></div>
      </div>
    </section>
  );
};
