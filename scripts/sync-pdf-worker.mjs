import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const candidates = [
  '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
  '../node_modules/pdfjs-dist/build/pdf.worker.min.js',
  '../node_modules/pdfjs-dist/build/pdf.worker.js',
].map((relative) => resolve(__dirname, relative));
const source = candidates.find((file) => existsSync(file));
const target = resolve(__dirname, '../public/pdf.worker.js');

if (!source) {
  console.warn('[sync-pdf-worker] Nenhum worker encontrado em:', candidates.join(', '));
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[sync-pdf-worker] Copiado ${source} → ${target}`);
