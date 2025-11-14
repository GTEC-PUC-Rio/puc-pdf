import { showLoader, hideLoader, showAlert } from '../ui.js';
import { downloadFile, readFileAsArrayBuffer } from '../utils/helpers.js';
import { state } from '../state.js';
import JSZip from 'jszip';

export async function pdfToZip() {
  if (state.files.length === 0) {
    showAlert('Nenhum arquivo', 'Selecione um ou mais PDFs.');
    return;
  }
  showLoader('Criando arquivo ZIP...');
  try {
    const zip = new JSZip();
    for (const file of state.files) {
      const fileBuffer = await readFileAsArrayBuffer(file);
      zip.file(file.name, fileBuffer as ArrayBuffer);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'pdfs.zip');
  } catch (e) {
    console.error(e);
    showAlert('Erro', 'Não foi possível criar o arquivo ZIP.');
  } finally {
    hideLoader();
  }
}
