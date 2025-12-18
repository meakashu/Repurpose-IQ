import { useState } from 'react';
import { FaRobot, FaArrowRight, FaCheckCircle, FaSpinner, FaDatabase, FaBrain } from 'react-icons/fa';

export default function MasterAgentDecisionFlow({ 
  query, 
  intent, 
  subtasks, 
  agentsSelected, 
  reasoning 
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!intent && !subtasks && !agentsSelected) return null;

  return (
    <div className="medical-card bg-gradient-to-r from-black to-gray-900 border-2 border-yellow-400 rounded-xl p-6 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-4"
      >
        <div className="flex items-center gap-3">
          <FaBrain className="text-yellow-400 text-2xl" />
          <div>
            <div className="font-bold text-yellow-400 font-space-grotesk text-lg">
              Master Agent Decision Flow
            </div>
            <div className="text-xs text-yellow-300 font-inter">
              Understanding • Planning • Execution
            </div>
          </div>
        </div>
        <div className="text-yellow-400">
          {isExpanded ? '▼' : '▶'}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-4">
          {/* Query Understanding */}
          <div className="bg-yellow-400 bg-opacity-10 border-2 border-yellow-400 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaRobot className="text-yellow-400" />
              <span className="font-semibold text-yellow-400 font-inter">Query Understanding</span>
            </div>
            <div className="text-white font-inter mb-2">"{query}"</div>
            {intent && (
              <div className="text-sm text-yellow-200 font-inter">
                <strong>Intent:</strong> {intent}
              </div>
            )}
          </div>

          {/* Subtask Breakdown */}
          {subtasks && subtasks.length > 0 && (
            <div className="bg-yellow-400 bg-opacity-10 border-2 border-yellow-400 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaCheckCircle className="text-yellow-400" />
                <span className="font-semibold text-yellow-400 font-inter">Subtask Breakdown</span>
              </div>
              <div className="space-y-2">
                {subtasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-white font-inter">
                    <span className="text-yellow-400 font-bold">{idx + 1}.</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Selection */}
          {agentsSelected && agentsSelected.length > 0 && (
            <div className="bg-yellow-400 bg-opacity-10 border-2 border-yellow-400 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaDatabase className="text-yellow-400" />
                <span className="font-semibold text-yellow-400 font-inter">Agent Routing</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {agentsSelected.map((agent, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold border-2 border-black">
                    <FaArrowRight className="text-xs" />
                    {agent}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning */}
          {reasoning && (
            <div className="bg-yellow-400 bg-opacity-10 border-2 border-yellow-400 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaBrain className="text-yellow-400" />
                <span className="font-semibold text-yellow-400 font-inter">Routing Logic</span>
              </div>
              <div className="text-sm text-yellow-200 font-inter whitespace-pre-wrap">
                {reasoning}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

