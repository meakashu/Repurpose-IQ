import express from 'express';
import querySuggestionService from '../services/querySuggestionService.js';

const router = express.Router();

// Get query suggestions
router.get('/', async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    const suggestions = await querySuggestionService.getSuggestions(query || '', parseInt(limit));
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular queries
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const queries = querySuggestionService.getPopularQueries(parseInt(limit));
    res.json({ queries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save query (for learning)
router.post('/save', async (req, res) => {
  try {
    const { query, category } = req.body;
    querySuggestionService.saveQuery(query, category);
    res.json({ message: 'Query saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
