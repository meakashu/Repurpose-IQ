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

  // ENTERPRISE AI EXECUTION CONTROLS
  const [executionStatus, setExecutionStatus] = useState('idle'); // idle | running | paused | stopped
  const [currentAgent, setCurrentAgent] = useState(null);
  const [progress, setProgress] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setLoading(false);
    setStreamingText('');
    if (messages[messages.length - 1]?.role === 'user' && streamingText) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: streamingText + ' ...(stopped)',
        agents: []
      }]);
      setStreamingText('');
    }
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

    // ENTERPRISE: Agent orchestration simulation
    setExecutionStatus('running');
    setProgress(0);
    const agents = ['IQVIA Insights Agent', 'Clinical Trials Agent', 'Patent Landscape Agent', 'Web Intelligence Agent'];
    let agentIndex = 0;

    const agentInterval = setInterval(() => {
      if (agentIndex < agents.length && loading) {
        setCurrentAgent(agents[agentIndex]);
        setProgress(((agentIndex + 1) / agents.length) * 100);
        agentIndex++;
      } else {
        clearInterval(agentInterval);
      }
    }, 800);

    // Auto scroll to bottom
    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await api.post('/query', { query: currentInput, conversationId });

      // Simulate streaming effect
      const responseText = response.data.response;
      let index = 0;
      const streamInterval = setInterval(() => {
        if (index < responseText.length && loading) {
          setStreamingText(responseText.substring(0, index + 1));
          index += 2;
          scrollToBottom();
        } else {
          clearInterval(streamInterval);
          if (loading) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: responseText,
              agents: response.data.agents
            }]);
            setStreamingText('');
            setTimeout(() => scrollToBottom(), 100);
          }
        }
      }, 20);

      if (response.data.conversationId && !conversationId) {
        setConversationId(response.data.conversationId);
        loadConversations();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to get response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        agents: []
      }]);
      setTimeout(() => scrollToBottom(), 100);
    } finally {
      setLoading(false);
      setStreamingText('');
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

      const payload = format === 'PDF' ? {
        title: 'RepurposeIQ Analysis Report',
        query: userQuery,
        content: lastResponse.content,
        metadata: {
          agents_used: lastResponse.agents || [],
          user: 'current_user'
        }
      } : {
        title: 'RepurposeIQ Analysis Report',
        query: userQuery,
        data: {
          findings: lastResponse.content.split('\n').filter(line => line.trim())
        },
        metadata: {
          agents_used: lastResponse.agents || [],
          user: 'current_user'
        }
      };

      const response = await api.post(`/reports/${format.toLowerCase()}`, payload);

      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL || ''}/api/reports/download/${response.data.filename}`;
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
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {/* Agent Orchestration Display (ENTERPRISE FEATURE) */}
      {loading && (
        <div className="mb-4 medical-card bg-gradient-to-r from-yellow-400 to-yellow-500 border-2 border-black rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaSpinner className="animate-spin text-2xl text-black" />
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
              >
                <FaStop />
                Stop Execution
              </button>
            </div>
          </div>
          <div className="mt-3 bg-black bg-opacity-20 rounded-full h-2">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Header Actions */}
      {messages.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
            >
              <FaTrash />
              Clear Chat
            </button>
            <button
              onClick={() => exportReport('PDF')}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
            >
              <FaFilePdf />
              Export PDF
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="btn-medical-secondary flex items-center gap-2 text-sm"
            >
              <FaFileExcel />
              Export Excel
            </button>
          </div>
        </div>
      )}

      {/* Conversation History Sidebar - Snap Values Style */}
      {conversations.length > 0 && (
        <div className="mb-6 medical-card bg-white border-2 border-black rounded-xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-black mb-4 flex items-center gap-2 font-space-grotesk">
            <FaSearch className="text-black" />
            Recent Conversations
          </h3>
          <div className="flex flex-wrap gap-3">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${conversationId === conv.id
                  ? 'bg-black text-yellow-400 border-black'
                  : 'bg-white text-black border-black hover:bg-black hover:text-yellow-400'
                  }`}
              >
                {conv.title}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Welcome Message when no messages - Snap Values Style */}
      {messages.length === 0 && !loading && (
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12">
          <div className="text-center max-w-4xl w-full">
            <div className="mx-auto mb-8 w-64 h-64 flex items-center justify-center bg-black rounded-full border-8 border-yellow-400 shadow-2xl p-8">
              <FaRobot className="w-full h-full text-yellow-400" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6 font-space-grotesk">
              RepurposeIQ Assistant
            </h2>
            <p className="text-xl lg:text-2xl text-black mb-12 font-inter font-medium leading-relaxed">
              Ask questions about drug repurposing, clinical trials, patents, market analysis, and more.
              Our multi-agent system will provide comprehensive insights.
            </p>
            {syntheticQueries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {syntheticQueries.slice(0, 4).map((query) => (
                  <button
                    key={query.id}
                    onClick={() => {
                      setInput(query.query);
                      setTimeout(() => document.querySelector('form')?.requestSubmit(), 100);
                    }}
                    className="medical-card bg-white border-2 border-black rounded-xl p-6 text-left hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="text-xs text-black font-bold mb-2 uppercase tracking-wide">{query.category}</div>
                    <div className="text-base text-black font-inter leading-relaxed">{query.query}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-6 mb-4 px-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
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
                    <div className="whitespace-pre-wrap text-black leading-relaxed font-inter break-words">{msg.content}</div>
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
            <div className="flex justify-start animate-fadeIn">
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

          {/* Loading indicator */}
          {loading && !streamingText && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Stop Button */}
      {loading && (
        <div className="flex justify-center mb-4">
          <button
            onClick={stopGeneration}
            className="btn-medical-secondary px-6 py-2 flex items-center gap-2"
          >
            <span className="w-3 h-3 bg-black"></span>
            Stop Generating
          </button>
        </div>
      )}

      {/* Voice Wave Animation Overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center animate-bounce-in">
            <img src="/images/voice-wave-animation.png" alt="Listening..." className="w-32 h-16 object-contain mb-4 animate-pulse" />
            <p className="font-space-grotesk font-bold text-xl">Listening...</p>
            <button onClick={stopVoiceRecognition} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Cancel</button>
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

      {/* Input Form */}
      <div className="mt-auto">
        {/* Input Methods */}
        <div className="mb-4">
          <div className="flex gap-2">
            {[
              { id: 'text', icon: FaPaperPlane, label: 'Text' },
              { id: 'voice', icon: FaMicrophone, label: 'Voice' },
              { id: 'image', icon: FaImage, label: 'Image' },
              { id: 'file', icon: FaFile, label: 'File' },
              { id: 'multimodal', icon: FaFlask, label: 'AI Analysis' }
            ].map((method) => {
              const Icon = method.icon;
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${(inputMethod === method.id || (method.id === 'voice' && isListening) || (method.id === 'multimodal' && showMultiModal))
                    ? 'bg-black text-yellow-400 border-2 border-black'
                    : 'bg-white text-black border-2 border-transparent hover:border-black hover:bg-yellow-50'
                    } ${isListening && method.id === 'voice' ? 'animate-pulse' : ''}`}
                >
                  <Icon />
                  {method.id === 'voice' && isListening ? 'Listening...' : method.label}
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
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pharmaceutical strategy, patents, trials, markets..."
              className="medical-input w-full pr-12"
              disabled={loading}
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-medical-primary px-8 flex items-center gap-2"
          >
            <FaPaperPlane />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
