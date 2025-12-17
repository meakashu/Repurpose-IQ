import express from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// List available reports
router.get('/', (req, res) => {
  try {
    const reportsDir = join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      return res.json({ reports: [] });
    }

    const files = fs.readdirSync(reportsDir)
      .filter(file => file.endsWith('.pdf') || file.endsWith('.xlsx'))
      .map(file => {
        const filepath = join(reportsDir, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          path: filepath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified - a.modified);

    res.json({ reports: files });
  } catch (error) {
    console.error('List reports error:', error);
    res.status(500).json({ error: 'Failed to list reports' });
  }
});

// Generate PDF report
router.post('/pdf', (req, res) => {
  try {
    const { title, query, content, metadata } = req.body;

    const filename = `report_${Date.now()}.pdf`;
    const filepath = join(__dirname, '../../reports', filename);

    // Ensure reports directory exists
    const reportsDir = join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filepath));

    // Add content
    doc.fontSize(20).text(title || 'Pharma Strategy Analysis', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Query: ${query}`);
    doc.moveDown();
    doc.text(content);

    if (metadata) {
      doc.moveDown();
      doc.fontSize(10).text(`Agents Used: ${metadata.agents_used?.join(', ') || 'N/A'}`);
    }

    doc.end();

    res.json({ filename, path: filepath });
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Generate Excel report
router.post('/excel', async (req, res) => {
  try {
    const { title, query, data, metadata } = req.body;

    const filename = `report_${Date.now()}.xlsx`;
    const filepath = join(__dirname, '../../reports', filename);

    const reportsDir = join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Analysis');

    worksheet.addRow([title || 'Pharma Strategy Analysis']);
    worksheet.addRow([`Query: ${query}`]);
    worksheet.addRow([]);

    if (data.findings) {
      worksheet.addRow(['Findings:']);
      data.findings.forEach(finding => {
        worksheet.addRow([finding]);
      });
    }

    await workbook.xlsx.writeFile(filepath);

    res.json({ filename, path: filepath });
  } catch (error) {
    console.error('Excel generation error:', error);
    res.status(500).json({ error: 'Excel generation failed' });
  }
});

// Download report
router.get('/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = join(__dirname, '../../reports', filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.download(filepath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;

