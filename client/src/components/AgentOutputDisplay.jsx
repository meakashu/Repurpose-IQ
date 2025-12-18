import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRobot, FaDatabase, FaChartLine } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AgentOutputDisplay({ agentName, output, dataSource }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="medical-card bg-white border-2 border-black rounded-xl p-4 mb-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center">
            <FaRobot className="text-black text-sm" />
          </div>
          <div>
            <div className="font-bold text-black font-space-grotesk">{agentName}</div>
            <div className="text-xs text-black opacity-70 font-inter">
              {dataSource && (
                <span className="flex items-center gap-1">
                  <FaDatabase className="text-xs" />
                  {dataSource}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-black opacity-70">
            {isExpanded ? 'Hide' : 'Show'} Output
          </span>
          {isExpanded ? (
            <FaChevronUp className="text-black" />
          ) : (
            <FaChevronDown className="text-black" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-black">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {output}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

