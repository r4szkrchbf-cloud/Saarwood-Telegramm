import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const docsDir = path.join(root, 'docs');
const outDir = path.join(root, 'packages', 'frontend', 'public', 'support');

const resources = [
  {
    input: path.join(docsDir, 'SAARwooD_NUTZERHANDBUCH_BETA_V1_DE.md'),
    output: path.join(outDir, 'saarwood-nutzerhandbuch-beta-v1-de.pdf'),
    title: 'SAARwooD Teleprompter - Nutzerhandbuch Beta V1',
  },
  {
    input: path.join(docsDir, 'BETA_TESTER_GUIDE.md'),
    output: path.join(outDir, 'beta-tester-guide-de.pdf'),
    title: 'Saarwood Teleprompter - Beta-Tester-Leitfaden',
  },
  {
    input: path.join(docsDir, 'TESTERFORMULAR_BETA_V1_DE.md'),
    output: path.join(outDir, 'testerformular-beta-v1-de.pdf'),
    title: 'Saarwood Teleprompter - Testerformular Beta V1',
  },
];

function normalizeMarkdown(markdown) {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, (m) => m)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/^\|/gm, '')
    .replace(/\|$/gm, '')
    .replace(/\|/g, ' | ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderPdf(title, text, output) {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 44;
  const marginTop = 54;
  const lineHeight = 16;
  const footerGap = 40;
  let y = marginTop;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(title, marginX, y);
  y += 26;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);

  const paragraphs = text.split('\n');
  for (const paragraph of paragraphs) {
    const lines = pdf.splitTextToSize(paragraph || ' ', pageWidth - marginX * 2);
    for (const line of lines) {
      if (y > pageHeight - footerGap) {
        pdf.addPage();
        y = marginTop;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10.5);
      }
      pdf.text(line, marginX, y);
      y += lineHeight;
    }
    y += 4;
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  pdf.save(output);
}

for (const resource of resources) {
  const raw = fs.readFileSync(resource.input, 'utf-8');
  const normalized = normalizeMarkdown(raw);
  renderPdf(resource.title, normalized, resource.output);
  console.log(`Generated ${path.relative(root, resource.output)}`);
}
