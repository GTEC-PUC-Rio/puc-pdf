import type { ComponentType } from 'react';
import { MergeTool } from '../components/tools/MergeTool.tsx';
import { BookmarkTool } from '../components/tools/BookmarkTool.tsx';
import { TableOfContentsTool } from '../components/tools/TableOfContentsTool.tsx';
import { SplitTool } from '../components/tools/SplitTool.tsx';
import { OrganizeTool } from '../components/tools/OrganizeTool.tsx';
import { RotateTool } from '../components/tools/RotateTool.tsx';
import { DeletePagesTool } from '../components/tools/DeletePagesTool.tsx';
import { AddBlankPageTool } from '../components/tools/AddBlankPageTool.tsx';
import { ExtractPagesTool } from '../components/tools/ExtractPagesTool.tsx';
import { AddWatermarkTool } from '../components/tools/AddWatermarkTool.tsx';
import { AddHeaderFooterTool } from '../components/tools/AddHeaderFooterTool.tsx';
import { ImageToPdfTool } from '../components/tools/ImageToPdfTool.tsx';
import { ChangePermissionsTool } from '../components/tools/ChangePermissionsTool.tsx';
import { ChangeBackgroundColorTool } from '../components/tools/ChangeBackgroundColorTool.tsx';
import { ChangeTextColorTool } from '../components/tools/ChangeTextColorTool.tsx';
import { CompressTool } from '../components/tools/CompressTool.tsx';
import { EncryptTool } from '../components/tools/EncryptTool.tsx';
import { DecryptTool } from '../components/tools/DecryptTool.tsx';
import { RemoveAnnotationsTool } from '../components/tools/RemoveAnnotationsTool.tsx';
import { FormFillerTool } from '../components/tools/FormFillerTool.tsx';
import { CropTool } from '../components/tools/CropTool.tsx';
import { CropperTool } from '../components/tools/CropperTool.tsx';
import { NUpTool } from '../components/tools/NUpTool.tsx';
import { DuplicateOrganizeTool } from '../components/tools/DuplicateOrganizeTool.tsx';
import { CombineSinglePageTool } from '../components/tools/CombineSinglePageTool.tsx';
import { AlternateMergeTool } from '../components/tools/AlternateMergeTool.tsx';
import { LinearizeTool } from '../components/tools/LinearizeTool.tsx';
import { RemoveBlankPagesTool } from '../components/tools/RemoveBlankPagesTool.tsx';
import { PosterizeTool } from '../components/tools/PosterizeTool.tsx';
import { ComparePdfsTool } from '../components/tools/ComparePdfsTool.tsx';
import { PdfToJpgTool } from '../components/tools/PdfToJpgTool.tsx';
import { PdfToJsonTool } from '../components/tools/PdfToJsonTool.tsx';
import { AddPageNumbersTool } from '../components/tools/AddPageNumbersTool.tsx';
import { JpgToPdfTool } from '../components/tools/JpgToPdfTool.tsx';
import { PdfToPngTool } from '../components/tools/PdfToPngTool.tsx';
import { PdfToWebpTool } from '../components/tools/PdfToWebpTool.tsx';
import { WebpToPdfTool } from '../components/tools/WebpToPdfTool.tsx';
import { PngToPdfTool } from '../components/tools/PngToPdfTool.tsx';
import { PdfToGreyscaleTool } from '../components/tools/PdfToGreyscaleTool.tsx';
import { PdfToZipTool } from '../components/tools/PdfToZipTool.tsx';
import { EditMetadataTool } from '../components/tools/EditMetadataTool.tsx';
import { ViewMetadataTool } from '../components/tools/ViewMetadataTool.tsx';
import { RemoveMetadataTool } from '../components/tools/RemoveMetadataTool.tsx';
import { FlattenTool } from '../components/tools/FlattenTool.tsx';
import { PdfToMarkdownTool } from '../components/tools/PdfToMarkdownTool.tsx';
import { JsonToPdfTool } from '../components/tools/JsonToPdfTool.tsx';
import { TxtToPdfTool } from '../components/tools/TxtToPdfTool.tsx';
import { InvertColorsTool } from '../components/tools/InvertColorsTool.tsx';
import { ReversePagesTool } from '../components/tools/ReversePagesTool.tsx';
import { ScanToPdfTool } from '../components/tools/ScanToPdfTool.tsx';
import { SvgToPdfTool } from '../components/tools/SvgToPdfTool.tsx';
import { BmpToPdfTool } from '../components/tools/BmpToPdfTool.tsx';
import { HeicToPdfTool } from '../components/tools/HeicToPdfTool.tsx';
import { TiffToPdfTool } from '../components/tools/TiffToPdfTool.tsx';
import { MdToPdfTool } from '../components/tools/MdToPdfTool.tsx';
import { PdfToBmpTool } from '../components/tools/PdfToBmpTool.tsx';
import { PdfToTiffTool } from '../components/tools/PdfToTiffTool.tsx';
import { SplitInHalfTool } from '../components/tools/SplitInHalfTool.tsx';
import { PageDimensionsTool } from '../components/tools/PageDimensionsTool.tsx';
import { FixDimensionsTool } from '../components/tools/FixDimensionsTool.tsx';
import { OcrPdfTool } from '../components/tools/OcrPdfTool.tsx';
import { WordToPdfTool } from '../components/tools/WordToPdfTool.tsx';
import { SignPdfMaintenanceTool } from '../components/tools/SignPdfMaintenanceTool.tsx';
import { PdfMultiToolTool } from '../components/tools/PdfMultiToolTool.tsx';
import { RemoveRestrictionsTool } from '../components/tools/RemoveRestrictionsTool.tsx';
import { AddAttachmentsTool } from '../components/tools/AddAttachmentsTool.tsx';
import { ExtractAttachmentsTool } from '../components/tools/ExtractAttachmentsTool.tsx';
import { EditAttachmentsTool } from '../components/tools/EditAttachmentsTool.tsx';
import { EditTool } from '../components/tools/EditTool.tsx';
import { SanitizePdfTool } from '../components/tools/SanitizePdfTool.tsx';

type ToolComponent = ComponentType;

const registry: Record<string, ToolComponent> = {
  'multi-tool': PdfMultiToolTool,
  'bookmark-pdf': BookmarkTool,
  'table-of-contents': TableOfContentsTool,
  merge: MergeTool,
  split: SplitTool,
  organize: OrganizeTool,
  rotate: RotateTool,
  'delete-pages': DeletePagesTool,
  'add-blank-page': AddBlankPageTool,
  'extract-pages': ExtractPagesTool,
  'add-watermark': AddWatermarkTool,
  'add-header-footer': AddHeaderFooterTool,
  'image-to-pdf': ImageToPdfTool,
  encrypt: EncryptTool,
  decrypt: DecryptTool,
  'compress': CompressTool,
  'change-permissions': ChangePermissionsTool,
  crop: CropTool,
  cropper: CropperTool,
  'change-background-color': ChangeBackgroundColorTool,
  'change-text-color': ChangeTextColorTool,
  'remove-annotations': RemoveAnnotationsTool,
  'form-filler': FormFillerTool,
  edit: EditTool,
  'compare-pdfs': ComparePdfsTool,
  'pdf-to-jpg': PdfToJpgTool,
  'pdf-to-json': PdfToJsonTool,
  'add-page-numbers': AddPageNumbersTool,
  'jpg-to-pdf': JpgToPdfTool,
  'pdf-to-png': PdfToPngTool,
  'pdf-to-webp': PdfToWebpTool,
  'webp-to-pdf': WebpToPdfTool,
  'png-to-pdf': PngToPdfTool,
  'pdf-to-greyscale': PdfToGreyscaleTool,
  'pdf-to-zip': PdfToZipTool,
  'edit-metadata': EditMetadataTool,
  'view-metadata': ViewMetadataTool,
  'remove-metadata': RemoveMetadataTool,
  flatten: FlattenTool,
  'pdf-to-markdown': PdfToMarkdownTool,
  'json-to-pdf': JsonToPdfTool,
  'txt-to-pdf': TxtToPdfTool,
  'invert-colors': InvertColorsTool,
  'reverse-pages': ReversePagesTool,
  'scan-to-pdf': ScanToPdfTool,
  'svg-to-pdf': SvgToPdfTool,
  'bmp-to-pdf': BmpToPdfTool,
  'heic-to-pdf': HeicToPdfTool,
  'tiff-to-pdf': TiffToPdfTool,
  'pdf-to-bmp': PdfToBmpTool,
  'pdf-to-tiff': PdfToTiffTool,
  'split-in-half': SplitInHalfTool,
  'n-up': NUpTool,
  'duplicate-organize': DuplicateOrganizeTool,
  'combine-single-page': CombineSinglePageTool,
  'alternate-merge': AlternateMergeTool,
  linearize: LinearizeTool,
  'fix-dimensions': FixDimensionsTool,
  'page-dimensions': PageDimensionsTool,
  'remove-blank-pages': RemoveBlankPagesTool,
  posterize: PosterizeTool,
  'md-to-pdf': MdToPdfTool,
  'ocr-pdf': OcrPdfTool,
  'word-to-pdf': WordToPdfTool,
  'sign-pdf': SignPdfMaintenanceTool,
  'remove-restrictions': RemoveRestrictionsTool,
  'add-attachments': AddAttachmentsTool,
  'extract-attachments': ExtractAttachmentsTool,
  'edit-attachments': EditAttachmentsTool,
  'sanitize-pdf': SanitizePdfTool,
};

export const isReactTool = (toolId: string) => Boolean(registry[toolId]);

export const getReactToolComponent = (toolId: string) =>
  registry[toolId] ?? null;
