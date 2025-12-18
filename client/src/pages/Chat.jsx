import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FaPaperPlane, FaMicrophone, FaImage, FaFile,
  FaRobot, FaStar, FaDownload, FaFilePdf, FaFileExcel,
  FaUser, FaTrash, FaSearch, FaFlask, FaPlay, FaPause, FaStop, FaSpinner
} from 'react-icons/fa';
import MultiModalInput from '../components/MultiModalInput';
import TypingIndicator from '../components/TypingIndicator';
import QuerySuggestions from '../components/QuerySuggestions';
import AgentOutputDisplay from '../components/AgentOutputDisplay';
import DemoModeBanner from '../components/DemoModeBanner';
import StrategicReasoning from '../components/StrategicReasoning';
import MasterAgentDecisionFlow from '../components/MasterAgentDecisionFlow';
import { AutoChartRenderer } from '../components/ChartVisualizations';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState('text');
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [syntheticQueries, setSyntheticQueries] = useState([]);
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [agentOutputs, setAgentOutputs] = useState({});
  const [masterAgentFlow, setMasterAgentFlow] = useState(null);
  const [strategicReasoning, setStrategicReasoning] = useState(null);

  // ENTERPRISE AI EXECUTION CONTROLS
  const [executionStatus, setExecutionStatus] = useState('idle'); // idle | running | paused | stopped
  const [currentAgent, setCurrentAgent] = useState(null);
  const [progress, setProgress] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const agentIntervalRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isStoppedRef = useRef(false);

  const scrollToBottom = () => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        // Find the scrollable parent (messages container)
        const scrollContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          // Fallback to scrollIntoView
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    loadConversations();
    loadSyntheticQueries();
    initializeVoiceRecognition();
  }, []);

  const loadSyntheticQueries = async () => {
    try {
      const response = await api.get('/synthetic-queries');
      setSyntheticQueries(response.data.queries || []);
    } catch (error) {
      console.error('Failed to load synthetic queries:', error);
    }
  };

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-submit after voice input
        setTimeout(() => {
          document.querySelector('form')?.requestSubmit();
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setInputMethod('voice');
        toast.success('Listening... Speak your question');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast.error('Voice recognition not available');
      }
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (id) => {
    try {
      const response = await api.get(`/conversations/${id}`);
      setMessages(response.data.messages || []);
      setConversationId(id);
      toast.success('Conversation loaded');
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const stopGeneration = () => {
    // Mark as stopped
    isStoppedRef.current = true;
    
    // Cancel ongoing API request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear agent simulation interval
    if (agentIntervalRef.current) {
      clearInterval(agentIntervalRef.current);
      agentIntervalRef.current = null;
    }
    
    // Clear streaming interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    
    // Update state
    setLoading(false);
    setExecutionStatus('stopped');
    setCurrentAgent(null);
    setProgress(0);
    
    // Save partial response if there's streaming text
    const currentStreamingText = streamingText;
    if (currentStreamingText && currentStreamingText.trim()) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: currentStreamingText + '\n\n*(Generation stopped by user)*',
        agents: []
      }]);
    }
    
    setStreamingText('');
    setAgentOutputs({});
    setMasterAgentFlow(null);
    setStrategicReasoning(null);
    toast.success('Generation stopped');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setStreamingText('');
    isStoppedRef.current = false; // Reset stopped flag

    // ENTERPRISE: Agent orchestration simulation
    setExecutionStatus('running');
    setProgress(0);
    const agents = ['IQVIA Insights Agent', 'Clinical Trials Agent', 'Patent Landscape Agent', 'Web Intelligence Agent'];
    let agentIndex = 0;

    // Clear any existing interval
    if (agentIntervalRef.current) {
      clearInterval(agentIntervalRef.current);
    }

    agentIntervalRef.current = setInterval(() => {
      // Check if stopped
      if (isStoppedRef.current) {
        if (agentIntervalRef.current) {
          clearInterval(agentIntervalRef.current);
          agentIntervalRef.current = null;
        }
        return;
      }
      
      if (agentIndex < agents.length && loading) {
        setCurrentAgent(agents[agentIndex]);
        setProgress(((agentIndex + 1) / agents.length) * 100);
        agentIndex++;
      } else {
        if (agentIntervalRef.current) {
          clearInterval(agentIntervalRef.current);
          agentIntervalRef.current = null;
        }
      }
    }, 800);

    // Auto scroll to bottom
    setTimeout(() => scrollToBottom(), 100);

    // Create AbortController for cancellable request
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.post('/query', 
        { query: currentInput, conversationId },
        {
          signal: abortControllerRef.current.signal,
          timeout: 120000 // 120 seconds timeout for AI queries (Groq can take time)
        }
      );
      
      // Store agent outputs and flow information if available
      if (response.data.agentOutputs) {
        setAgentOutputs(response.data.agentOutputs);
      }
      if (response.data.masterAgentFlow) {
        setMasterAgentFlow(response.data.masterAgentFlow);
      }
      if (response.data.strategicReasoning) {
        setStrategicReasoning(response.data.strategicReasoning);
      }

      // Simulate streaming effect
      const responseText = response.data.response || '';

      // If for some reason the backend didn't return a response string,
      // fail gracefully and show a helpful message instead of hanging UI
      if (!responseText.trim()) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I was not able to generate a response for this query. Please try rephrasing or asking a slightly different pharmaceutical question.',
          agents: response.data.agents || []
        }]);
        setLoading(false);
        setStreamingText('');
        setTimeout(() => scrollToBottom(), 100);
        return;
      }

      // Clear any existing streaming interval
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      let index = 0;
      let lastScrollTime = 0;
      
      streamIntervalRef.current = setInterval(() => {
        // Check if stopped (using ref to avoid stale state)
        if (isStoppedRef.current) {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          return;
        }

        if (index < responseText.length) {
          setStreamingText(responseText.substring(0, index + 1));
          index += 2;
          // Throttle scroll calls to every 100ms during streaming for better performance
          const now = Date.now();
          if (now - lastScrollTime > 100) {
            scrollToBottom();
            lastScrollTime = now;
          }
        } else {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
          }
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: responseText,
            agents: response.data.agents,
            strategicReasoning: response.data.strategicReasoning
          }]);
          setStreamingText('');
          setLoading(false);
          setExecutionStatus('idle');
          setTimeout(() => scrollToBottom(), 100);
        }
      }, 20);

      // Update conversation ID if returned (new or existing)
      if (response.data.conversationId) {
        setConversationId(response.data.conversationId);
        if (!conversationId) {
          // Only reload if this is a new conversation
          loadConversations();
        }
      }
    } catch (error) {
      // Don't show error if request was aborted (user stopped)
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        // Already handled in stopGeneration
        return;
      }

      // Clear intervals on error
      if (agentIntervalRef.current) {
        clearInterval(agentIntervalRef.current);
        agentIntervalRef.current = null;
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      toast.error(error.response?.data?.error || 'Failed to get response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        agents: []
      }]);
      setTimeout(() => scrollToBottom(), 100);
      setLoading(false);
      setStreamingText('');
      setExecutionStatus('idle');
      abortControllerRef.current = null;
    }
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append(type === 'image' ? 'image' : 'document', file);

    try {
      const endpoint = type === 'image' ? '/upload/image' : '/upload/document';
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`${type === 'image' ? 'Image' : 'File'} uploaded successfully!`);
      return response.data;
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
      return null;
    }
  };

  const exportReport = async (format) => {
    if (messages.length === 0) {
      toast.error('No conversation to export');
      return;
    }

    try {
      const lastResponse = messages[messages.length - 1];
      const userQuery = messages[messages.length - 2]?.content || 'Chat conversation';

      // Include agent outputs and strategic reasoning in report
      const payload = format === 'PDF' ? {
        title: 'RepurposeIQ Analysis Report',
        query: userQuery,
        content: lastResponse.content,
        metadata: {
          agents_used: lastResponse.agents || [],
          confidence_score: lastResponse.strategicReasoning?.confidenceScore || null,
          decision_factors: lastResponse.strategicReasoning?.decisionFactors || [],
          master_agent_flow: lastResponse.masterAgentFlow || null,
          user: 'current_user',
          response_time: Date.now() - (lastResponse.timestamp || Date.now())
        },
        agent_outputs: agentOutputs || {}
      } : {
        title: 'RepurposeIQ Analysis Report',
        query: userQuery,
        data: {
          findings: lastResponse.content.split('\n').filter(line => line.trim()),
          agent_outputs: agentOutputs || {},
          strategic_reasoning: lastResponse.strategicReasoning || null
        },
        metadata: {
          agents_used: lastResponse.agents || [],
          confidence_score: lastResponse.strategicReasoning?.confidenceScore || null,
          user: 'current_user'
        }
      };

      const response = await api.post(`/reports/${format.toLowerCase()}`, payload);

      const link = document.createElement('a');
      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? window.location.origin : '');
      link.href = `${apiBase}/api/reports/download/${response.data.filename}`;
      link.download = response.data.filename;
      link.click();

      toast.success(`${format} report generated and downloaded!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to generate ${format} report`);
    }
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      setConversationId(null);
      toast.success('Chat cleared');
    }
  };

  return (
    <div className="chat-container flex-1 flex flex-col max-w-7xl mx-auto w-full" style={{ minHeight: 0 }}>
      {/* Demo Mode Banner */}
      <DemoModeBanner />
      
      {/* Master Agent Decision Flow */}
      {masterAgentFlow && (
        <MasterAgentDecisionFlow
          query={masterAgentFlow.query}
          intent={masterAgentFlow.intent}
          subtasks={masterAgentFlow.subtasks}
          agentsSelected={masterAgentFlow.agentsSelected}
          reasoning={masterAgentFlow.reasoning}
        />
      )}
      
      {/* Agent Orchestration Display (ENTERPRISE FEATURE) */}
      {loading && (
        <div className="mb-4 medical-card bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-black rounded-xl p-4 shadow-lg" role="status" aria-live="polite" aria-label="AI processing status">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <FaSpinner className="animate-spin text-2xl text-black" aria-hidden="true" />
              <div>
                <div className="font-bold text-black font-space-grotesk">Master Agent Orchestrating...</div>
                <div className="text-sm text-black font-inter">
                  Currently Running: <span className="font-semibold">{currentAgent || 'IQVIA Insights Agent'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <button
              onClick={stopGeneration}
              className="px-4 py-2 bg-black text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-semibold border-2 border-black"
              aria-label="Stop AI generation"
              title="Stop AI generation"
            >
              <FaStop />
              <span className="hidden sm:inline">Stop Execution</span>
              <span className="sm:hidden">Stop</span>
            </button>
            </div>
          </div>
          <div className="mt-3 bg-black bg-opacity-20 rounded-full h-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Processing progress">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Header Actions */}
      {messages.length > 0 && (
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={clearChat}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
              aria-label="Clear chat conversation"
              title="Clear chat"
            >
              <FaTrash />
              <span className="hidden sm:inline">Clear Chat</span>
              <span className="sm:hidden">Clear</span>
            </button>
            <button
              onClick={() => exportReport('PDF')}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
              aria-label="Export conversation as PDF"
              title="Export PDF"
            >
              <FaFilePdf />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
              aria-label="Export conversation as Excel"
              title="Export Excel"
            >
              <FaFileExcel />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* Conversation History Sidebar - Snap Values Style */}
      {conversations.length > 0 && (
        <div className="mb-6 medical-card bg-white border-2 border-black rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-sm sm:text-base font-bold text-black mb-4 flex items-center gap-2 font-space-grotesk">
            <FaSearch className="text-black" aria-hidden="true" />
            Recent Conversations
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3" role="group" aria-label="Recent conversations">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border-2 ${conversationId === conv.id
                  ? 'bg-black text-yellow-400 border-black'
                  : 'bg-white text-black border-black hover:bg-black hover:text-yellow-400'
                  }`}
                aria-label={`Load conversation: ${conv.title}`}
                aria-pressed={conversationId === conv.id}
              >
                <span className="truncate max-w-[120px] sm:max-w-none">{conv.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Welcome Message when no messages - Snap Values Style */}
      {messages.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12 overflow-y-auto" style={{ minHeight: 0 }}>
          <div className="text-center max-w-4xl w-full">
            <div className="mx-auto mb-6 sm:mb-8 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-black rounded-full border-4 sm:border-8 border-yellow-400 shadow-2xl p-6 sm:p-8">
              <FaRobot className="w-full h-full text-yellow-400" aria-hidden="true" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 font-space-grotesk">
              RepurposeIQ Assistant
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-black mb-8 sm:mb-12 font-inter font-medium leading-relaxed px-4">
              Ask questions about drug repurposing, clinical trials, patents, market analysis, and more.
              Our multi-agent system will provide comprehensive insights.
            </p>
            {syntheticQueries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 px-2">
                {syntheticQueries.slice(0, 4).map((query) => (
                  <button
                    key={query.id}
                    onClick={() => {
                      setInput(query.query);
                      setTimeout(() => document.querySelector('form')?.requestSubmit(), 100);
                    }}
                    className="medical-card bg-white border-2 border-black rounded-xl p-4 sm:p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1"
                    aria-label={`Use suggested query: ${query.query}`}
                  >
                    <div className="text-xs text-black font-bold mb-2 uppercase tracking-wide">{query.category}</div>
                    <div className="text-sm sm:text-base text-black font-inter leading-relaxed">{query.query}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="chat-messages-container flex-1 overflow-y-auto space-y-6 mb-4 px-2 sm:px-4 medical-scrollbar" style={{ minHeight: 0 }} role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} medical-fade-in`}
              role="article"
              aria-label={msg.role === 'user' ? 'Your message' : 'AI assistant response'}
            >
              <div className={`medical-message ${msg.role === 'user' ? 'message-user' : 'message-assistant'} max-w-3xl w-full`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-black text-yellow-400' : 'bg-yellow-400 border-2 border-black text-black'
                    }`}>
                    {msg.role === 'user' ? <FaUser /> : <FaRobot />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-2 text-black opacity-70">
                      {msg.role === 'user' ? 'You' : 'RepurposeIQ AI'}
                    </div>
                    
                    {/* Strategic Reasoning for assistant messages */}
                    {msg.role === 'assistant' && msg.strategicReasoning && (
                      <div className="mb-4">
                        <StrategicReasoning
                          reasoning={msg.strategicReasoning.reasoning}
                          confidenceScore={msg.strategicReasoning.confidenceScore}
                          decisionFactors={msg.strategicReasoning.decisionFactors}
                        />
                      </div>
                    )}
                    
                    {/* Charts/Visualizations */}
                    {msg.role === 'assistant' && (
                      <div className="mb-4">
                        <AutoChartRenderer 
                          content={msg.content} 
                          agentType={msg.agents?.[0]?.toLowerCase() || ''}
                        />
                      </div>
                    )}
                    
                    {/* Markdown content with table support */}
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    {msg.agents && msg.agents.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-black flex flex-wrap gap-2">
                        <span className="text-xs font-semibold text-black mr-2">Agents used:</span>
                        {msg.agents.map((agent, i) => (
                          <span
                            key={i}
                            className="medical-badge badge-primary flex items-center gap-1 text-xs"
                          >
                            <FaStar className="text-xs" />
                            {agent}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Streaming text */}
          {streamingText && (
            <div className="flex justify-start medical-fade-in">
              <div className="medical-message message-assistant max-w-3xl w-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-black text-black flex items-center justify-center">
                    <FaRobot />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold mb-2 text-black opacity-70">RepurposeIQ AI</div>
                    <div className="whitespace-pre-wrap text-black font-inter break-words">{streamingText}</div>
                    <span className="inline-block w-2 h-5 bg-black ml-1 animate-pulse">|</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Agent Outputs (if available) */}
          {Object.keys(agentOutputs).length > 0 && (
            <div className="mb-6">
              <div className="font-bold text-black mb-3 font-space-grotesk">Individual Agent Outputs:</div>
              {Object.entries(agentOutputs).map(([agentName, output]) => (
                <AgentOutputDisplay
                  key={agentName}
                  agentName={agentName}
                  output={typeof output === 'string' ? output : output.content}
                  dataSource={typeof output === 'object' ? output.dataSource : null}
                />
              ))}
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && !streamingText && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Stop Button - Only show if not already shown in orchestration banner */}
      {loading && executionStatus !== 'running' && (
        <div className="flex justify-center mb-4">
          <button
            onClick={stopGeneration}
            className="btn-medical-secondary px-6 py-2 flex items-center gap-2"
            aria-label="Stop generating response"
            title="Stop generating response"
          >
            <FaStop />
            <span className="hidden sm:inline">Stop Generating</span>
            <span className="sm:hidden">Stop</span>
          </button>
        </div>
      )}

      {/* Voice Wave Animation Overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="voice-listening-title">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center border-2 border-black shadow-lg">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-12 bg-black rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-16 bg-black rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
              <div className="w-3 h-20 bg-black rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
              <div className="w-3 h-16 bg-black rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-3 h-12 bg-black rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
            </div>
            <p id="voice-listening-title" className="font-space-grotesk font-bold text-xl text-black mb-2">Listening...</p>
            <p className="text-sm text-black opacity-70 mb-4">Speak your question clearly</p>
            <button 
              onClick={stopVoiceRecognition} 
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors border-2 border-black"
              aria-label="Stop voice recognition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Multi-Modal Analysis Panel */}
      {showMultiModal && (
        <div className="mb-4">
          <MultiModalInput
            onAnalysisComplete={(result) => {
              // Add analysis result to chat
              if (result.analysis?.text) {
                setInput(result.analysis.text);
                setShowMultiModal(false);
              }
            }}
          />
        </div>
      )}

      {/* Input Form - Fixed at bottom */}
      <div className="chat-input-container mt-auto flex-shrink-0">
        {/* Query Suggestions - Only show when there are messages or input */}
        {(messages.length > 0 || input) && (
          <QuerySuggestions
            currentQuery={input}
            onSelectSuggestion={(query) => {
              setInput(query);
              setTimeout(() => document.querySelector('form')?.requestSubmit(), 100);
            }}
          />
        )}
        {/* Input Methods */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Input method selection">
            {[
              { id: 'text', icon: FaPaperPlane, label: 'Text', mobileLabel: 'Text', ariaLabel: 'Text input' },
              { id: 'voice', icon: FaMicrophone, label: 'Voice', mobileLabel: 'Voice', ariaLabel: 'Voice input' },
              { id: 'image', icon: FaImage, label: 'Image', mobileLabel: 'Img', ariaLabel: 'Image upload' },
              { id: 'file', icon: FaFile, label: 'File', mobileLabel: 'File', ariaLabel: 'File upload' },
              { id: 'multimodal', icon: FaFlask, label: 'AI Analysis', mobileLabel: 'AI', ariaLabel: 'AI multimodal analysis' }
            ].map((method) => {
              const Icon = method.icon;
              const isActive = inputMethod === method.id || (method.id === 'voice' && isListening) || (method.id === 'multimodal' && showMultiModal);
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    if (method.id === 'voice') {
                      if (isListening) {
                        stopVoiceRecognition();
                      } else {
                        startVoiceRecognition();
                      }
                    } else if (method.id === 'multimodal') {
                      setShowMultiModal(!showMultiModal);
                    } else {
                      setInputMethod(method.id);
                      if (method.id === 'image') imageInputRef.current?.click();
                      if (method.id === 'file') fileInputRef.current?.click();
                    }
                  }}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ${isActive
                    ? 'bg-black text-yellow-400 border-2 border-black'
                    : 'bg-white text-black border-2 border-transparent hover:border-black hover:bg-yellow-50'
                    } ${isListening && method.id === 'voice' ? 'animate-pulse' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={method.label}
                  aria-label={method.ariaLabel}
                  aria-pressed={isActive}
                  disabled={loading && method.id !== 'voice'}
                >
                  <Icon className="text-sm md:text-base" aria-hidden="true" />
                  <span className="hidden sm:inline">{method.id === 'voice' && isListening ? 'Listening...' : method.label}</span>
                  <span className="sm:hidden">{method.id === 'voice' && isListening ? '...' : method.mobileLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleFileUpload(e.target.files[0], 'image');
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              handleFileUpload(e.target.files[0], 'document');
            }
          }}
        />

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 md:gap-3"
          aria-label="Chat input form"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pharmaceutical strategy, patents, trials, markets..."
              className="medical-input w-full pr-10 md:pr-12 text-sm md:text-base"
              disabled={loading}
              aria-label="Chat input"
              aria-describedby="input-help-text"
              maxLength={2000}
            />
            <span id="input-help-text" className="sr-only">Enter your question about drug repurposing, clinical trials, patents, or market analysis</span>
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg md:text-xl transition-colors"
                aria-label="Clear input"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-medical-primary px-4 md:px-8 flex items-center gap-1 md:gap-2 text-sm md:text-base flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
            aria-disabled={loading || !input.trim()}
          >
            <FaPaperPlane className="text-sm md:text-base" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
