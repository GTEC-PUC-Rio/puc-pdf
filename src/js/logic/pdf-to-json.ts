import JSZip from 'jszip';
import {
  downloadFile,
  formatBytes,
  readFileAsArrayBuffer,
} from '../utils/helpers';
import { withBasePath } from '../utils/base-path.js';

type StatusType = 'success' | 'error' | 'info';

export const setupPdfToJsonPage = () => {
  const pdfFilesInput = document.getElementById(
    'pdfFiles'
  ) as HTMLInputElement | null;
  const convertBtn = document.getElementById(
    'convertBtn'
  ) as HTMLButtonElement | null;
  const statusMessage = document.getElementById(
    'status-message'
  ) as HTMLDivElement | null;
  const fileListDiv = document.getElementById(
    'fileList'
  ) as HTMLDivElement | null;

  if (!pdfFilesInput || !convertBtn || !statusMessage || !fileListDiv) {
    console.warn('PDF → JSON UI elements not found.');
    return () => {};
  }

  const worker = new Worker(withBasePath('workers/pdf-to-json.worker.js'));
  let selectedFiles: File[] = [];

  const showStatus = (message: string, type: StatusType = 'info') => {
    statusMessage.textContent = message;
    statusMessage.className = `mt-4 p-3 rounded-lg text-sm ${
      type === 'success'
        ? 'bg-green-900 text-green-200'
        : type === 'error'
          ? 'bg-red-900 text-red-200'
          : 'bg-blue-900 text-blue-200'
    }`;
    statusMessage.classList.remove('hidden');
  };

  const hideStatus = () => statusMessage.classList.add('hidden');

  const updateFileList = () => {
    fileListDiv.innerHTML = '';
    if (selectedFiles.length === 0) {
      fileListDiv.classList.add('hidden');
      return;
    }

    fileListDiv.classList.remove('hidden');
    selectedFiles.forEach((file) => {
      const fileDiv = document.createElement('div');
      fileDiv.className =
        'flex items-center justify-between bg-gray-700 p-3 rounded-lg text-sm mb-2';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'truncate font-medium text-gray-200';
      nameSpan.textContent = file.name;

      const sizeSpan = document.createElement('span');
      sizeSpan.className = 'flex-shrink-0 ml-4 text-gray-400';
      sizeSpan.textContent = formatBytes(file.size);

      fileDiv.append(nameSpan, sizeSpan);
      fileListDiv.appendChild(fileDiv);
    });
  };

  const changeHandler = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFiles = Array.from(target.files);
      convertBtn.disabled = selectedFiles.length === 0;
      updateFileList();

      if (selectedFiles.length === 0) {
        showStatus('Selecione pelo menos 1 arquivo PDF', 'info');
      } else {
        showStatus(
          `${selectedFiles.length} arquivo(s) selecionado(s). Pronto para converter!`,
          'info'
        );
      }
    }
  };

  const convertPDFsToJSON = async () => {
    if (selectedFiles.length === 0) {
      showStatus('Selecione pelo menos 1 arquivo PDF', 'error');
      return;
    }

    try {
      convertBtn.disabled = true;
      showStatus('Lendo arquivos...', 'info');

      const fileBuffers = await Promise.all(
        selectedFiles.map((file) => readFileAsArrayBuffer(file))
      );

      showStatus('Convertendo PDFs para JSON...', 'info');

      worker.postMessage(
        {
          command: 'convert',
          fileBuffers,
          fileNames: selectedFiles.map((f) => f.name),
        },
        fileBuffers as unknown as Transferable[]
      );
    } catch (error) {
      console.error('Error reading files:', error);
      showStatus(
        `❌ Erro ao ler arquivos: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`,
        'error'
      );
      convertBtn.disabled = false;
    }
  };

  worker.onmessage = async (e: MessageEvent) => {
    convertBtn.disabled = false;

    if (e.data.status === 'success') {
      const jsonFiles = e.data.jsonFiles as Array<{
        name: string;
        data: ArrayBuffer;
      }>;

      try {
        showStatus('Criando arquivo ZIP...', 'info');

        const zip = new JSZip();
        jsonFiles.forEach(({ name, data }) => {
          const jsonName = name.replace(/\.pdf$/i, '.json');
          const uint8Array = new Uint8Array(data);
          zip.file(jsonName, uint8Array);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadFile(zipBlob, 'pdfs-to-json.zip');

        showStatus(
          '✅ PDFs convertidos para JSON! Download do ZIP iniciado.',
          'success'
        );

        selectedFiles = [];
        pdfFilesInput.value = '';
        fileListDiv.innerHTML = '';
        fileListDiv.classList.add('hidden');
        convertBtn.disabled = true;

        setTimeout(() => {
          hideStatus();
        }, 3000);
      } catch (error) {
        console.error('Error creating ZIP:', error);
        showStatus(
          `❌ Erro ao criar o ZIP: ${
            error instanceof Error ? error.message : 'Erro desconhecido'
          }`,
          'error'
        );
      }
    } else if (e.data.status === 'error') {
      const errorMessage = e.data.message || 'Erro desconhecido no worker.';
      console.error('Worker Error:', errorMessage);
      showStatus(`❌ Erro no worker: ${errorMessage}`, 'error');
    }
  };

  worker.onerror = (error) => {
    console.error('Worker error:', error);
    showStatus(
      '❌ Erro no worker: consulte o console para mais detalhes.',
      'error'
    );
    convertBtn.disabled = false;
  };

  pdfFilesInput.addEventListener('change', changeHandler);
  convertBtn.addEventListener('click', convertPDFsToJSON);
  showStatus('Selecione arquivos PDF para começar', 'info');

  return () => {
    pdfFilesInput.removeEventListener('change', changeHandler);
    convertBtn.removeEventListener('click', convertPDFsToJSON);
    worker.terminate();
    selectedFiles = [];
    fileListDiv.innerHTML = '';
    fileListDiv.classList.add('hidden');
    convertBtn.disabled = true;
    hideStatus();
  };
};
