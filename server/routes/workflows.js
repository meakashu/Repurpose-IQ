import express from 'express';
import jwt from 'jsonwebtoken';
import workflowService from '../services/workflowService.js';

// Auth middleware
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

const router = express.Router();

// Create workflow
router.post('/', verifyAuth, async (req, res) => {
  try {
    const workflow = await workflowService.createWorkflow({
      ...req.body,
      userId: req.user.userId
    });
    // Return both a top-level id and the full workflow object for compatibility
    // Shape: { id, workflow: { ... } }
    res.json({ id: workflow.id, workflow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List workflows
router.get('/', verifyAuth, async (req, res) => {
  try {
    const workflows = workflowService.listWorkflows(req.user.userId);
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow
router.get('/:id', verifyAuth, async (req, res) => {
  try {
    const workflow = workflowService.getWorkflowFromDB(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ workflow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute workflow
router.post('/:id/execute', verifyAuth, async (req, res) => {
  try {
    const result = await workflowService.executeWorkflow(req.params.id, {
      userId: req.user.userId,
      ...req.body.context
    });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update workflow
router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await workflowService.updateWorkflow(id, {
      ...req.body,
      userId: req.user.userId
    });
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({ workflow, message: 'Workflow updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete workflow
router.delete('/:id', verifyAuth, async (req, res) => {
  try {
    workflowService.deleteWorkflow(req.params.id);
    res.json({ message: 'Workflow deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
