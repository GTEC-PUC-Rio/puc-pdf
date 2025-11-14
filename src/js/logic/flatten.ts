import { showLoader, hideLoader, showAlert } from '../ui.js';
import { downloadFile } from '../utils/helpers.js';
import { state } from '../state.js';

export function flattenFormsInDoc(pdfDoc) {
  const form = pdfDoc.getForm();
  form.flatten();
}

export async function flatten() {
  if (!state.pdfDoc) {
    showAlert('Erro', 'Nenhum PDF carregado.');
    return;
  }
  showLoader('Achatando PDF...');
  try {
    flattenFormsInDoc(state.pdfDoc);

    const flattenedBytes = await state.pdfDoc.save();
    downloadFile(
      new Blob([flattenedBytes], { type: 'application/pdf' }),
      'flattened.pdf'
    );
  } catch (e) {
    console.error(e);
    if (e.message.includes('getForm')) {
      showAlert(
        'Nenhum formulário',
        'Este PDF não contém campos de formulário para achatar.'
      );
    } else {
      showAlert('Erro', 'Não foi possível achatar o PDF.');
    }
  } finally {
    hideLoader();
  }
}
