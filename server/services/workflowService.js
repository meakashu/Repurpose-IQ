import db from '../database/db.js';
import { MasterAgent } from '../agents/masterAgent.js';

// Lazy load node-cron
let cron = null;
const loadCron = async () => {
  if (cron === null) {
    try {
      const cronModule = await import('node-cron');
      cron = cronModule.default;
    } catch (e) {
      console.warn('node-cron not available. Scheduled workflows will use manual execution.');
      cron = false; // Mark as unavailable
    }
  }
  return cron;
};

/**
 * Automated Workflow Service
 * Manages research workflows, scheduled tasks, and agent orchestration
 */
class WorkflowService {
  constructor() {
    this.workflows = new Map();
    this.scheduledTasks = new Map();
    this.masterAgent = new MasterAgent();
  }

  /**
   * Create a new workflow
   */
  async createWorkflow(workflowData) {
    const {
      name,
      description,
      steps,
      schedule,
      enabled = true,
      userId
    } = workflowData;

    const workflowId = `workflow_${Date.now()}`;

    const workflow = {
      id: workflowId,
      name,
      description,
      steps: steps || [],
      schedule: schedule || null,
      enabled,
      userId,
      createdAt: new Date().toISOString(),
      lastRun: null,
      nextRun: schedule ? this.calculateNextRun(schedule) : null,
      runCount: 0,
      status: 'active'
    };

    // Save to database
    db.prepare(`
      INSERT INTO workflows (id, name, description, steps, schedule, enabled, user_id, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      name,
      description,
      JSON.stringify(steps),
      schedule,
      enabled ? 1 : 0,
      userId,
      workflow.createdAt,
      workflow.status
    );

    this.workflows.set(workflowId, workflow);

    // Schedule if enabled and has schedule
    if (enabled && schedule) {
      this.scheduleWorkflow(workflowId, schedule).catch(err => {
        console.error('Error scheduling workflow:', err);
      });
    }

    return workflow;
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId, context = {}) {
    const workflow = this.workflows.get(workflowId) || this.getWorkflowFromDB(workflowId);
    
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (!workflow.enabled) {
      throw new Error(`Workflow ${workflowId} is disabled`);
    }

    const results = [];
    const startTime = Date.now();

    try {
      // Update status
      this.updateWorkflowStatus(workflowId, 'running');

      // Execute each step
      for (const step of workflow.steps) {
        const stepResult = await this.executeStep(step, context);
        results.push({
          step: step.name || step.type,
          result: stepResult,
          timestamp: new Date().toISOString()
        });

        // Update context with step result
        context[step.name || step.type] = stepResult;
      }

      // Update workflow
      const endTime = Date.now();
      this.updateWorkflowStatus(workflowId, 'completed', {
        lastRun: new Date().toISOString(),
        runCount: workflow.runCount + 1,
        executionTime: endTime - startTime
      });

      return {
        workflowId,
        success: true,
        results,
        executionTime: endTime - startTime
      };
    } catch (error) {
      this.updateWorkflowStatus(workflowId, 'failed', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(step, context) {
    switch (step.type) {
      case 'query':
        return await this.masterAgent.processQuery(step.query, context.userId);
      
      case 'market_analysis':
        return await this.masterAgent.agents.market.process(step.query || context.query);
      
      case 'patent_check':
        return await this.masterAgent.agents.patent.process(step.query || context.query);
      
      case 'clinical_trial_search':
        return await this.masterAgent.agents.clinical.process(step.query || context.query);
      
      case 'wait':
        return new Promise(resolve => setTimeout(resolve, step.duration || 1000));
      
      case 'condition':
        // Conditional logic
        if (this.evaluateCondition(step.condition, context)) {
          return await this.executeStep(step.then, context);
        } else if (step.else) {
          return await this.executeStep(step.else, context);
        }
        return null;
      
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  /**
   * Evaluate condition
   */
  evaluateCondition(condition, context) {
    // Simple condition evaluation
    if (condition.type === 'equals') {
      return context[condition.variable] === condition.value;
    }
    if (condition.type === 'greater_than') {
      return context[condition.variable] > condition.value;
    }
    if (condition.type === 'contains') {
      return String(context[condition.variable] || '').includes(condition.value);
    }
    return false;
  }

  /**
   * Schedule a workflow
   */
  async scheduleWorkflow(workflowId, cronExpression) {
    const cronLib = await loadCron();
    if (!cronLib || cronLib === false) {
      console.warn('node-cron not available. Workflow will not be scheduled automatically.');
      return;
    }

    // Remove existing schedule if any
    if (this.scheduledTasks.has(workflowId)) {
      this.scheduledTasks.get(workflowId).destroy();
    }

    // Create new schedule
    const task = cronLib.schedule(cronExpression, async () => {
      try {
        await this.executeWorkflow(workflowId);
      } catch (error) {
        console.error(`Error executing scheduled workflow ${workflowId}:`, error);
      }
    });

    this.scheduledTasks.set(workflowId, task);
  }

  /**
   * Calculate next run time from cron expression
   */
  calculateNextRun(cronExpression) {
    // Simplified - in production, use a proper cron parser
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Next day
  }

  /**
   * Get workflow from database
   */
  getWorkflowFromDB(workflowId) {
    const row = db.prepare('SELECT * FROM workflows WHERE id = ?').get(workflowId);
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      steps: JSON.parse(row.steps || '[]'),
      schedule: row.schedule,
      enabled: row.enabled === 1,
      userId: row.user_id,
      createdAt: row.created_at,
      lastRun: row.last_run,
      nextRun: row.next_run,
      runCount: row.run_count || 0,
      status: row.status
    };
  }

  /**
   * Update workflow status
   */
  updateWorkflowStatus(workflowId, status, updates = {}) {
    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (updates.lastRun) {
      updateFields.push('last_run = ?');
      updateValues.push(updates.lastRun);
    }
    if (updates.runCount !== undefined) {
      updateFields.push('run_count = ?');
      updateValues.push(updates.runCount);
    }
    if (updates.nextRun) {
      updateFields.push('next_run = ?');
      updateValues.push(updates.nextRun);
    }

    updateValues.push(workflowId);

    db.prepare(`
      UPDATE workflows 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `).run(...updateValues);

    // Update in-memory cache
    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      Object.assign(workflow, { status, ...updates });
    }
  }

  /**
   * Update workflow
   */
  async updateWorkflow(workflowId, workflowData) {
    const workflow = this.getWorkflowFromDB(workflowId);
    if (!workflow) {
      return null;
    }

    // Check user ownership
    if (workflowData.userId && workflow.userId !== workflowData.userId) {
      throw new Error('Unauthorized: Cannot update workflow owned by another user');
    }

    const {
      name,
      description,
      steps,
      schedule,
      enabled,
      status
    } = workflowData;

    // Update database
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (steps !== undefined) {
      updateFields.push('steps = ?');
      updateValues.push(JSON.stringify(steps));
    }
    if (schedule !== undefined) {
      updateFields.push('schedule = ?');
      updateValues.push(schedule);
    }
    if (enabled !== undefined) {
      updateFields.push('enabled = ?');
      updateValues.push(enabled ? 1 : 0);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return workflow;
    }

    updateValues.push(workflowId);

    db.prepare(`
      UPDATE workflows 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `).run(...updateValues);

    // Reschedule if schedule changed
    if (schedule !== undefined && enabled) {
      await this.scheduleWorkflow(workflowId, schedule);
    }

    return this.getWorkflowFromDB(workflowId);
  }

  /**
   * List workflows
   */
  listWorkflows(userId = null) {
    let query = 'SELECT * FROM workflows';
    const params = [];

    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params);
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      enabled: row.enabled === 1,
      status: row.status,
      lastRun: row.last_run,
      nextRun: row.next_run,
      runCount: row.run_count || 0
    }));
  }

  /**
   * Delete workflow
   */
  deleteWorkflow(workflowId) {
    // Stop scheduled task
    if (this.scheduledTasks.has(workflowId)) {
      const task = this.scheduledTasks.get(workflowId);
      if (task && typeof task.destroy === 'function') {
        task.destroy();
      }
      this.scheduledTasks.delete(workflowId);
    }

    // Remove from database
    db.prepare('DELETE FROM workflows WHERE id = ?').run(workflowId);

    // Remove from cache
    this.workflows.delete(workflowId);
  }

}

export default new WorkflowService();
