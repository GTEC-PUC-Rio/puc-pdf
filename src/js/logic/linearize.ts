import createModule from '@neslinesli93/qpdf-wasm';
import { showLoader, hideLoader, showAlert } from '../ui';
import { readFileAsArrayBuffer, downloadFile } from '../utils/helpers';
import { state } from '../state';
import JSZip from 'jszip';
import { withBasePath } from '../utils/base-path.js';

let qpdfInstance: any = null;

async function initializeQpdf() {
  if (qpdfInstance) {
    return qpdfInstance;
  }
  showLoader('Inicializando o mecanismo de otimização...');
  try {
    qpdfInstance = await createModule({
      locateFile: () => withBasePath('qpdf.wasm'),
    });
  } catch (error) {
    console.error('Failed to initialize qpdf-wasm:', error);
    showAlert(
      'Erro de inicialização',
      'Não foi possível carregar o mecanismo de otimização. Atualize a página e tente novamente.'
    );
    throw error;
  } finally {
    hideLoader();
  }
  return qpdfInstance;
}

export async function linearizePdf() {
  // Check if there are files and at least one PDF
  const pdfFiles = state.files.filter(
    (file: File) => file.type === 'application/pdf'
  );
  if (!pdfFiles || pdfFiles.length === 0) {
    showAlert('Nenhum PDF enviado', 'Envie ao menos um arquivo PDF.');
    return;
  }

  showLoader('Otimizando PDFs para visualização rápida...');
  const zip = new JSZip(); // Create a JSZip instance
  let qpdf: any;
  let successCount = 0;
  let errorCount = 0;

  try {
    qpdf = await initializeQpdf();

    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      const inputPath = `/input_${i}.pdf`;
      const outputPath = `/output_${i}.pdf`;

      showLoader(`Otimizando ${file.name} (${i + 1}/${pdfFiles.length})...`);

      try {
        const fileBuffer = await readFileAsArrayBuffer(file);
        const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

        qpdf.FS.writeFile(inputPath, uint8Array);

        const args = [inputPath, '--linearize', outputPath];

        qpdf.callMain(args);

        const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });
        if (!outputFile || outputFile.length === 0) {
          console.error(
            `Linearization resulted in an empty file for ${file.name}.`
          );
          throw new Error(`Falha ao processar ${file.name}.`);
        }

        zip.file(`linearized-${file.name}`, outputFile, { binary: true });
        successCount++;
      } catch (fileError: any) {
        errorCount++;
        console.error(`Failed to linearize ${file.name}:`, fileError);
        // Optionally add an error marker/file to the zip? For now, we just skip.
      } finally {
        // Clean up WASM filesystem for this file
        try {
          if (qpdf?.FS) {
            if (qpdf.FS.analyzePath(inputPath).exists) {
              qpdf.FS.unlink(inputPath);
            }
            if (qpdf.FS.analyzePath(outputPath).exists) {
              qpdf.FS.unlink(outputPath);
            }
          }
        } catch (cleanupError) {
          console.warn(
            `Failed to cleanup WASM FS for ${file.name}:`,
            cleanupError
          );
        }
      }
    }

    if (successCount === 0) {
      throw new Error('Não foi possível linearizar nenhum PDF.');
    }

    showLoader('Gerando arquivo ZIP...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'linearized-pdfs.zip');

    let alertMessage = `${successCount} PDF(s) linearizados com sucesso.`;
    if (errorCount > 0) {
      alertMessage += ` ${errorCount} arquivo(s) falharam.`;
    }
    showAlert('Processo concluído', alertMessage);
  } catch (error: any) {
    console.error('Linearization process error:', error);
    showAlert(
      'Falha na linearização',
      `Ocorreu um erro: ${error.message || 'Erro desconhecido'}.`
    );
  } finally {
    hideLoader();
  }
}
