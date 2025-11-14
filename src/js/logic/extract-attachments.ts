import { downloadFile, formatBytes } from '../utils/helpers.js';
import { state } from '../state.js';
import JSZip from 'jszip';
import { withBasePath } from '../utils/base-path.js';

const worker = new Worker(withBasePath('workers/extract-attachments.worker.js'));

interface ExtractAttachmentSuccessResponse {
  status: 'success';
  attachments: Array<{ name: string; data: ArrayBuffer }>;
}

interface ExtractAttachmentErrorResponse {
  status: 'error';
  message: string;
}

type ExtractAttachmentResponse = ExtractAttachmentSuccessResponse | ExtractAttachmentErrorResponse;

export async function extractAttachments() {
  if (state.files.length === 0) {
    showStatus('Nenhum arquivo selecionado.', 'error');
    return;
  }

  document.getElementById('process-btn')?.classList.add('opacity-50', 'cursor-not-allowed');
  document.getElementById('process-btn')?.setAttribute('disabled', 'true');
  
  showStatus('Lendo arquivos (thread principal)...', 'info');

  try {
    const fileBuffers: ArrayBuffer[] = [];
    const fileNames: string[] = [];

    for (const file of state.files) {
      const buffer = await file.arrayBuffer();
      fileBuffers.push(buffer);
      fileNames.push(file.name);
    }

    showStatus(`Extraindo anexos de ${state.files.length} arquivo(s)...`, 'info');

    const message: ExtractAttachmentsMessage = {
      command: 'extract-attachments',
      fileBuffers,
      fileNames,
    };

    const transferables = fileBuffers.map(buf => buf);
    worker.postMessage(message, transferables);

  } catch (error) {
    console.error('Error reading files:', error);
    showStatus(
      `Erro ao ler arquivos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      'error'
    );
    document.getElementById('process-btn')?.classList.remove('opacity-50', 'cursor-not-allowed');
    document.getElementById('process-btn')?.removeAttribute('disabled');
  }
}

worker.onmessage = (e: MessageEvent<ExtractAttachmentResponse>) => {
  document.getElementById('process-btn')?.classList.remove('opacity-50', 'cursor-not-allowed');
  document.getElementById('process-btn')?.removeAttribute('disabled');

  if (e.data.status === 'success') {
    const attachments = e.data.attachments;

    const zip = new JSZip();
    let totalSize = 0;
    
    for (const attachment of attachments) {
      zip.file(attachment.name, new Uint8Array(attachment.data));
      totalSize += attachment.data.byteLength;
    }

    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      downloadFile(zipBlob, 'extracted-attachments.zip');
      showStatus(
        `Extração concluída! ${attachments.length} anexo(s) no ZIP (${formatBytes(totalSize)}). Download iniciado.`,
        'success'
      );

      state.files = [];
      const fileDisplayArea = document.getElementById('file-display-area');
      if (fileDisplayArea) {
        fileDisplayArea.innerHTML = '';
        fileDisplayArea.classList.add('hidden');
      }
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      document.getElementById('process-btn')?.classList.add('opacity-50', 'cursor-not-allowed');
      document.getElementById('process-btn')?.setAttribute('disabled', 'true');
    });
  } else if (e.data.status === 'error') {
    const errorMessage = e.data.message || 'Erro desconhecido no worker.';
    console.error('Worker Error:', errorMessage);
    showStatus(`Erro: ${errorMessage}`, 'error');
  }
};

worker.onerror = (error) => {
  console.error('Worker error:', error);
  showStatus('Ocorreu um erro no worker. Veja os detalhes no console.', 'error');
  document.getElementById('process-btn')?.classList.remove('opacity-50', 'cursor-not-allowed');
  document.getElementById('process-btn')?.removeAttribute('disabled');
};

function showStatus(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const statusMessage = document.getElementById('status-message') as HTMLElement;
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = `mt-4 p-3 rounded-lg text-sm ${
    type === 'success'
      ? 'bg-green-900 text-green-200'
      : type === 'error'
        ? 'bg-red-900 text-red-200'
        : 'bg-blue-900 text-blue-200'
  }`;
  statusMessage.classList.remove('hidden');
}

interface ExtractAttachmentsMessage {
  command: 'extract-attachments';
  fileBuffers: ArrayBuffer[];
  fileNames: string[];
}
