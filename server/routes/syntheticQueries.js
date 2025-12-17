/**
 * Synthetic Queries Routes
 * Provides access to pre-defined strategic questions
 */

import express from 'express';
import { getSyntheticQueries, getSyntheticQueryById, getQueryCategories } from '../services/syntheticQueries.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify auth
const verifyAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all synthetic queries
router.get('/', verifyAuth, (req, res) => {
  try {
    const { category } = req.query;
    const queries = getSyntheticQueries(category);
    res.json({ queries, total: queries.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch synthetic queries' });
  }
});

// Get query by ID
router.get('/:id', verifyAuth, (req, res) => {
  try {
    const query = getSyntheticQueryById(parseInt(req.params.id));
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch query' });
  }
});

// Get categories
router.get('/categories/list', verifyAuth, (req, res) => {
  try {
    const categories = getQueryCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;

