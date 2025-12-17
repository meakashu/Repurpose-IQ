import express from 'express';
import jwt from 'jsonwebtoken';
import { ConversationService } from '../services/conversationService.js';
import db from '../database/db.js';

const router = express.Router();

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

// Get user conversations
router.get('/', verifyAuth, (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = ConversationService.getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

// Create conversation
router.post('/', verifyAuth, (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;
    const conversationId = ConversationService.createConversation(userId, title);
    res.json({ id: conversationId, message: 'Conversation created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get specific conversation
router.get('/:id', verifyAuth, (req, res) => {
  try {
    const conversation = ConversationService.getConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load conversation' });
  }
});

// Get messages for a conversation
router.get('/:id/messages', verifyAuth, (req, res) => {
  try {
    const { id } = req.params;
    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `).all(id);
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Update conversation title
router.put('/:id', verifyAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    db.prepare(`
      UPDATE conversations 
      SET title = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(title, id);
    
    res.json({ message: 'Conversation updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete conversation
router.delete('/:id', verifyAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(id);
    db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;

