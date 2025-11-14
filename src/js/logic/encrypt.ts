import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';

export async function encrypt() {
  const file = state.files[0];
  const userPassword =
    (document.getElementById('user-password-input') as HTMLInputElement)
      ?.value || '';
  const ownerPasswordInput =
    (document.getElementById('owner-password-input') as HTMLInputElement)
      ?.value || '';

  if (!userPassword) {
    showAlert('Entrada obrigatória', 'Informe a senha de usuário.');
    return;
  }

  const ownerPassword = ownerPasswordInput || userPassword;
  const hasDistinctOwnerPassword = ownerPasswordInput !== '';

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader('Inicializando criptografia...');
    qpdf = await initializeQpdf();

    showLoader('Lendo o PDF...');
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader('Criptografando PDF com AES de 256 bits...');

    const args = [inputPath, '--encrypt', userPassword, ownerPassword, '256'];

    // Only add restrictions if a distinct owner password was provided
    if (hasDistinctOwnerPassword) {
      args.push(
        '--modify=none',
        '--extract=n',
        '--print=none',
        '--accessibility=n',
        '--annotate=n',
        '--assemble=n',
        '--form=n',
        '--modify-other=n'
      );
    }

    args.push('--', outputPath);

    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('qpdf execution error:', qpdfError);
      throw new Error(
        'Falha na criptografia: ' + (qpdfError.message || 'Erro desconhecido')
      );
    }

    showLoader('Preparando download...');
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (!outputFile || outputFile.length === 0) {
      throw new Error('A criptografia resultou em um arquivo vazio.');
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `encrypted-${file.name}`);

    hideLoader();

    let successMessage = 'PDF criptografado com sucesso com AES de 256 bits!';
    if (!hasDistinctOwnerPassword) {
      successMessage +=
        ' Observação: sem uma senha de proprietário distinta, o PDF ficará sem restrições de uso.';
    }

    showAlert('Sucesso', successMessage);
  } catch (error: any) {
    console.error('Error during PDF encryption:', error);
    hideLoader();
    showAlert(
      'Falha na criptografia',
      `Ocorreu um erro: ${error.message || 'O PDF pode estar corrompido.'}`
    );
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
