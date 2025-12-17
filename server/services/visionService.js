import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Vision Service for Multi-Modal Document Analysis
 * Handles image/document OCR and molecular structure recognition
 */
class VisionService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useOpenAI = !!this.openaiApiKey;
  }

  /**
   * Analyze image/document with OCR and understanding
   */
  async analyzeImage(imagePath, imageBuffer = null) {
    try {
      if (this.useOpenAI) {
        return await this.analyzeWithOpenAI(imagePath, imageBuffer);
      } else {
        return await this.analyzeWithBasicOCR(imagePath, imageBuffer);
      }
    } catch (error) {
      console.error('Vision analysis error:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze with OpenAI Vision API
   */
  async analyzeWithOpenAI(imagePath, imageBuffer) {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({ apiKey: this.openaiApiKey });

    // Read image
    const image = imageBuffer || fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');

    const response = await client.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this pharmaceutical document. Extract: 1) Drug/molecule names, 2) Indications, 3) Clinical trial information, 4) Patent numbers, 5) Market data. Format as structured JSON."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    return {
      text: response.choices[0].message.content,
      extracted_data: this.parseExtractedData(response.choices[0].message.content),
      source: 'openai_vision'
    };
  }

  /**
   * Basic OCR fallback (placeholder - would use Tesseract.js in production)
   */
  async analyzeWithBasicOCR(imagePath, imageBuffer) {
    // Placeholder for Tesseract.js OCR
    return {
      text: "OCR analysis placeholder. Install Tesseract.js for full OCR capabilities.",
      extracted_data: {
        molecules: [],
        indications: [],
        trials: [],
        patents: []
      },
      source: 'basic_ocr'
    };
  }

  /**
   * Parse extracted data from vision analysis
   */
  parseExtractedData(text) {
    const extracted = {
      molecules: [],
      indications: [],
      trials: [],
      patents: [],
      market_data: {}
    };

    // Simple extraction patterns
    const moleculePattern = /\b(Metformin|Pembrolizumab|Sitagliptin|Rivaroxaban|Atorvastatin)\b/gi;
    const indicationPattern = /\b(diabetes|cancer|hypertension|COPD|asthma|PCOS)\b/gi;
    const trialPattern = /NCT\d+/gi;
    const patentPattern = /(US|EP|WO)\d+/gi;

    extracted.molecules = [...new Set(text.match(moleculePattern) || [])];
    extracted.indications = [...new Set(text.match(indicationPattern) || [])];
    extracted.trials = [...new Set(text.match(trialPattern) || [])];
    extracted.patents = [...new Set(text.match(patentPattern) || [])];

    return extracted;
  }

  /**
   * Recognize molecular structure from image
   */
  async recognizeMolecularStructure(imagePath, imageBuffer = null) {
    try {
      if (this.useOpenAI) {
        const OpenAI = (await import('openai')).default;
        const client = new OpenAI({ apiKey: this.openaiApiKey });

        const image = imageBuffer || fs.readFileSync(imagePath);
        const base64Image = image.toString('base64');

        const response = await client.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Identify the molecular structure in this image. If you can see a chemical structure, provide: 1) Molecule name, 2) SMILES notation if possible, 3) Chemical formula, 4) Key functional groups. Format as JSON."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        });

        return {
          structure_data: JSON.parse(response.choices[0].message.content || '{}'),
          source: 'openai_vision'
        };
      } else {
        return {
          structure_data: {
            message: "OpenAI API key required for molecular structure recognition"
          },
          source: 'unavailable'
        };
      }
    } catch (error) {
      console.error('Molecular structure recognition error:', error);
      return {
        structure_data: { error: error.message },
        source: 'error'
      };
    }
  }

  /**
   * Process document (PDF, DOCX, etc.)
   */
  async processDocument(filePath, fileType) {
    try {
      // For PDF/DOCX, would use libraries like pdf-parse, mammoth
      // For now, placeholder
      return {
        text: "Document processing placeholder. Install pdf-parse or mammoth for full document processing.",
        extracted_data: {
          molecules: [],
          indications: [],
          trials: [],
          patents: []
        },
        source: 'document_processor'
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }
}

export default new VisionService();
