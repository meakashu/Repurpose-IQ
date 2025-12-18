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
    // For Vercel, use /tmp directory; otherwise use reports directory
    const reportsDir = process.env.VERCEL ? '/tmp/reports' : join(__dirname, '../../reports');
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
  console.log('\n[ReportGenerator] ========================================');
  console.log('[ReportGenerator] PDF generation requested');
  console.log(`[ReportGenerator] Timestamp: ${new Date().toISOString()}`);
  
  try {
    const { title, query, content, metadata } = req.body;
    console.log(`[ReportGenerator] Title: ${title || 'Pharma Strategy Analysis'}`);
    console.log(`[ReportGenerator] Query length: ${query?.length || 0} chars`);
    console.log(`[ReportGenerator] Content length: ${content?.length || 0} chars`);

    const filename = `report_${Date.now()}.pdf`;
    // For Vercel, use /tmp directory; otherwise use reports directory
    const reportsDir = process.env.VERCEL ? '/tmp/reports' : join(__dirname, '../../reports');
    const filepath = join(reportsDir, filename);
    console.log(`[ReportGenerator] Saving to: ${filepath}`);

    // Ensure reports directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
      console.log(`[ReportGenerator] Created reports directory: ${reportsDir}`);
    }

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filepath);
    doc.pipe(writeStream);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text(title || 'Pharma Strategy Analysis', { align: 'center' });
    doc.moveDown(2);
    
    // Query
    doc.fontSize(14).font('Helvetica-Bold').text('Query:', { continued: true });
    doc.font('Helvetica').fontSize(12).text(` ${query}`);
    doc.moveDown(2);
    
    // Content with better formatting
    doc.fontSize(12).font('Helvetica');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.startsWith('##')) {
        doc.moveDown();
        doc.fontSize(14).font('Helvetica-Bold').text(line.replace(/^##\s*/, ''), { underline: true });
        doc.moveDown(0.5);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        doc.font('Helvetica-Bold').text(line.replace(/\*\*/g, ''));
      } else if (line.startsWith('|')) {
        // Table row - simple formatting
        doc.font('Helvetica').fontSize(10).text(line);
      } else if (line.trim()) {
        doc.font('Helvetica').text(line);
      } else {
        doc.moveDown(0.5);
      }
    });

    // Metadata section
    if (metadata) {
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica-Bold').text('Report Metadata:', { underline: true });
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(10);
      if (metadata.agents_used) {
        doc.text(`Agents Used: ${metadata.agents_used.join(', ')}`);
      }
      doc.text(`Generated: ${new Date().toLocaleString()}`);
    }
    
    // References section
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').text('Data Sources & References', { underline: true });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica');
    doc.text('• USPTO Patent API Clone (Mock Data)');
    doc.text('• IQVIA Mock API (Mock Data)');
    doc.text('• ClinicalTrials.gov Stub (Mock Data)');
    doc.text('• Tavily Web Search API (Real API, if configured)');
    doc.text('• Groq AI (Real API)');
    doc.moveDown();
    doc.fontSize(8).font('Helvetica-Oblique').text('Note: This report was generated using mock/simulated data for demonstration purposes.');

    // Wait for PDF to finish writing before responding
    writeStream.on('finish', () => {
      console.log(`[ReportGenerator] ✓ PDF created successfully: ${filename}`);
      console.log(`[ReportGenerator] ========================================\n`);
      res.json({ filename, path: filepath });
    });

    writeStream.on('error', (error) => {
      console.error('[ReportGenerator] ✗ PDF write stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'PDF generation failed' });
      }
    });

    doc.end();
  } catch (error) {
    console.error('[ReportGenerator] ✗ PDF generation error:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Generate Excel report
router.post('/excel', async (req, res) => {
  try {
    const { title, query, data, metadata, agent_outputs } = req.body;

    const filename = `report_${Date.now()}.xlsx`;
    // For Vercel, use /tmp directory; otherwise use reports directory
    const reportsDir = process.env.VERCEL ? '/tmp/reports' : join(__dirname, '../../reports');
    const filepath = join(reportsDir, filename);
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    
    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow([title || 'Pharma Strategy Analysis']);
    summarySheet.addRow([`Query: ${query}`]);
    summarySheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
    summarySheet.addRow([]);
    
    if (metadata) {
      if (metadata.agents_used) {
        summarySheet.addRow(['Agents Used:', metadata.agents_used.join(', ')]);
      }
      if (metadata.confidence_score !== null && metadata.confidence_score !== undefined) {
        summarySheet.addRow(['Confidence Score:', metadata.confidence_score.toFixed(2)]);
      }
      if (metadata.decision_factors && metadata.decision_factors.length > 0) {
        summarySheet.addRow(['Decision Factors:']);
        metadata.decision_factors.forEach(factor => {
          summarySheet.addRow(['', `• ${factor}`]);
        });
      }
    }
    summarySheet.addRow([]);
    
    if (data && data.findings) {
      summarySheet.addRow(['Key Findings:']);
      data.findings.forEach(finding => {
        summarySheet.addRow(['', finding]);
      });
    }

    // Agent Outputs Sheet
    if (agent_outputs && Object.keys(agent_outputs).length > 0) {
      const agentSheet = workbook.addWorksheet('Agent Outputs');
      Object.entries(agent_outputs).forEach(([agentName, output]) => {
        agentSheet.addRow([`${agentName.toUpperCase()} Agent Output:`]);
        const outputText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
        const lines = outputText.split('\n');
        lines.forEach(line => {
          agentSheet.addRow(['', line]);
        });
        agentSheet.addRow([]);
      });
    }

    // Strategic Reasoning Sheet
    if (data && data.strategic_reasoning) {
      const reasoningSheet = workbook.addWorksheet('Strategic Reasoning');
      reasoningSheet.addRow(['Strategic Reasoning Analysis']);
      reasoningSheet.addRow([]);
      
      if (data.strategic_reasoning.reasoning) {
        reasoningSheet.addRow(['Reasoning:']);
        const reasoningLines = data.strategic_reasoning.reasoning.split('\n');
        reasoningLines.forEach(line => {
          reasoningSheet.addRow(['', line]);
        });
      }
      
      if (data.strategic_reasoning.confidenceScore !== null && data.strategic_reasoning.confidenceScore !== undefined) {
        reasoningSheet.addRow([]);
        reasoningSheet.addRow(['Confidence Score:', data.strategic_reasoning.confidenceScore.toFixed(2)]);
      }
      
      if (data.strategic_reasoning.decisionFactors && data.strategic_reasoning.decisionFactors.length > 0) {
        reasoningSheet.addRow([]);
        reasoningSheet.addRow(['Decision Factors:']);
        data.strategic_reasoning.decisionFactors.forEach(factor => {
          reasoningSheet.addRow(['', `• ${factor}`]);
        });
      }
    }

    await workbook.xlsx.writeFile(filepath);

    console.log(`[ReportGenerator] ✓ Excel created successfully: ${filename}`);
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
    // For Vercel, use /tmp directory; otherwise use reports directory
    const reportsDir = process.env.VERCEL ? '/tmp/reports' : join(__dirname, '../../reports');
    const filepath = join(reportsDir, filename);

    console.log(`[ReportGenerator] Download requested: ${filename}`);
    console.log(`[ReportGenerator] Looking in: ${reportsDir}`);

    if (!fs.existsSync(filepath)) {
      console.error(`[ReportGenerator] ✗ File not found: ${filepath}`);
      return res.status(404).json({ error: 'Report not found' });
    }

    // Set proper headers for download
    const ext = filename.split('.').pop();
    const contentType = ext === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('[ReportGenerator] ✗ Download stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

    fileStream.on('end', () => {
      console.log(`[ReportGenerator] ✓ Download completed: ${filename}`);
    });
  } catch (error) {
    console.error('[ReportGenerator] ✗ Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
});

export default router;

