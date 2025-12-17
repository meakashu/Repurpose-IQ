import { useState, useEffect } from 'react';
import { FaPlay, FaStop, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await api.get('/workflows');
      setWorkflows(response.data.workflows || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const executeWorkflow = async (workflowId) => {
    setLoading(true);
    try {
      const response = await api.post(`/workflows/${workflowId}/execute`);
      toast.success('Workflow executed successfully');
      loadWorkflows();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to execute workflow');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await api.delete(`/workflows/${workflowId}`);
      toast.success('Workflow deleted');
      loadWorkflows();
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Automated Workflows</h1>
            <p className="text-gray-600">
              Create and manage automated research workflows
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-medical-primary px-6 py-3 font-medium flex items-center gap-2"
          >
            <FaPlus />
            Create Workflow
          </button>
        </div>

        {/* Workflows List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
              <FaCog className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">No workflows created yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Create your first automated workflow to streamline research tasks
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-medical-primary px-6 py-3"
              >
                Create Workflow
              </button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.description || 'No description'}</p>
                  </div>
                  <button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      workflow.status === 'active' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Runs:</span>
                    <span className="font-medium">{workflow.runCount || 0}</span>
                  </div>
                  {workflow.lastRun && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Run:</span>
                      <span className="text-xs text-gray-500">
                        {new Date(workflow.lastRun).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => executeWorkflow(workflow.id)}
                    disabled={loading || !workflow.enabled}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaPlay />
                    Execute
                  </button>
                  <button
                    onClick={() => setSelectedWorkflow(workflow)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    <FaCog />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <CreateWorkflowModal
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              setShowCreateModal(false);
              loadWorkflows();
            }}
          />
        )}
      </div>
    </div>
  );
}

function CreateWorkflowModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [],
    schedule: ''
  });

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { type: 'query', query: '' }]
    });
  };

  const saveWorkflow = async () => {
    try {
      await api.post('/workflows', formData);
      toast.success('Workflow created');
      onSave();
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Workflow</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., Weekly Market Analysis"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="3"
              placeholder="Describe what this workflow does"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Schedule (Cron Expression)</label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 0 9 * * 1 (Every Monday at 9 AM)"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for manual execution only</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={saveWorkflow}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
