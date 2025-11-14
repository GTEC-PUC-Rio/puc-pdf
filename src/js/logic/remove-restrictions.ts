import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';
import { t } from '../../i18n/index.js';

export async function removeRestrictions() {
  const file = state.files[0];
  const password =
    (document.getElementById('owner-password-remove') as HTMLInputElement)
      ?.value || '';

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader(
      t('alerts.removeRestrictions.initializing', { ns: 'alerts' })
    );
    qpdf = await initializeQpdf();

    showLoader(t('alerts.removeRestrictions.readingPdf', { ns: 'alerts' }));
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader(t('alerts.removeRestrictions.processing', { ns: 'alerts' }));

    const args = [inputPath];

    if (password) {
      args.push(`--password=${password}`);
    }

    args.push('--decrypt', '--remove-restrictions', '--', outputPath);

    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('qpdf execution error:', qpdfError);
      if (
        qpdfError.message?.includes('password') ||
        qpdfError.message?.includes('encrypt')
      ) {
        throw new Error(
          t('alerts.removeRestrictions.passwordRequired', { ns: 'alerts' })
        );
      }

      throw new Error(
        t('alerts.removeRestrictions.genericFailure', {
          ns: 'alerts',
          message:
            qpdfError.message ||
            t('alerts.removeRestrictions.defaultReason', { ns: 'alerts' }),
        })
      );
    }

    showLoader(
      t('alerts.removeRestrictions.preparingDownload', { ns: 'alerts' })
    );
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (!outputFile || outputFile.length === 0) {
      throw new Error(
        t('alerts.removeRestrictions.emptyFile', { ns: 'alerts' })
      );
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `unrestricted-${file.name}`);

    hideLoader();

    showAlert(
      t('alerts.successTitle', { ns: 'alerts' }),
      t('alerts.removeRestrictions.successMessage', { ns: 'alerts' })
    );
  } catch (error: any) {
    console.error('Error during restriction removal:', error);
    hideLoader();
    const reason =
      error?.message ||
      t('alerts.removeRestrictions.defaultReason', { ns: 'alerts' });
    showAlert(
      t('alerts.removeRestrictions.errorTitle', { ns: 'alerts' }),
      t('alerts.removeRestrictions.errorMessage', {
        ns: 'alerts',
        reason,
      })
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
