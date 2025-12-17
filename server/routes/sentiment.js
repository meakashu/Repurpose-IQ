import express from 'express';
import sentimentAnalysisService from '../services/sentimentAnalysisService.js';

const router = express.Router();

// Analyze sentiment for a molecule
router.post('/analyze', async (req, res) => {
  try {
    const { molecule, sources } = req.body;
    if (!molecule) {
      return res.status(400).json({ error: 'molecule is required' });
    }

    const result = await sentimentAnalysisService.analyzeSentiment(
      molecule,
      sources || ['news', 'social']
    );

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sentiment history
router.get('/history/:molecule', async (req, res) => {
  try {
    const { molecule } = req.params;
    const { days = 30 } = req.query;

    const history = sentimentAnalysisService.getSentimentHistory(
      molecule,
      parseInt(days)
    );

    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
