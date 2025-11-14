import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';

export async function decrypt() {
  const file = state.files[0];
  const password = (
    document.getElementById('password-input') as HTMLInputElement
  )?.value;

  if (!password) {
    showAlert('Entrada obrigatória', 'Informe a senha do PDF.');
    return;
  }

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader('Inicializando descriptografia...');
    qpdf = await initializeQpdf();

    showLoader('Lendo o PDF criptografado...');
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader('Descriptografando PDF...');

    const args = [inputPath, '--password=' + password, '--decrypt', outputPath];

    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('qpdf execution error:', qpdfError);

      if (
        qpdfError.message?.includes('invalid password') ||
        qpdfError.message?.includes('password')
      ) {
        throw new Error('INVALID_PASSWORD');
      }
      throw qpdfError;
    }

    showLoader('Preparando download...');
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (outputFile.length === 0) {
      throw new Error('A descriptografia resultou em um arquivo vazio.');
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `unlocked-${file.name}`);

    hideLoader();
    showAlert(
      'Sucesso',
      'PDF descriptografado com sucesso! O download foi iniciado.'
    );
  } catch (error: any) {
    console.error('Error during PDF decryption:', error);
    hideLoader();

    if (error.message === 'INVALID_PASSWORD') {
      showAlert(
        'Senha incorreta',
        'A senha informada está errada. Tente novamente.'
      );
    } else if (error.message?.includes('password')) {
      showAlert(
        'Erro de senha',
        'Não foi possível descriptografar o PDF com a senha fornecida.'
      );
    } else {
      showAlert(
        'Falha na descriptografia',
        `Ocorreu um erro: ${error.message || 'A senha pode estar incorreta ou o arquivo está corrompido.'}`
      );
    }
  } finally {
    try {
      if (qpdf?.FS) {
        try {
          qpdf.FS.unlink(inputPath);
        } catch (e) {
          console.warn('Failed to unlink input file:', e);
        }
        try {
          qpdf.FS.unlink(outputPath);
        } catch (e) {
          console.warn('Failed to unlink output file:', e);
        }
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup WASM FS:', cleanupError);
    }
  }
}
