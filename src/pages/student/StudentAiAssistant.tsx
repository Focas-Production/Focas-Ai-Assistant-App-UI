import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, Book, Calculator, FlaskConical, Globe, MessageCircle, Menu, X, Plus} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  subject?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  subject: string;
}

const StudentAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = [
    { id: 'general', name: 'General', icon: MessageCircle, color: 'bg-blue-500' },
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-purple-500' },
    { id: 'science', name: 'Science', icon: FlaskConical, color: 'bg-green-500' },
    { id: 'history', name: 'History', icon: Book, color: 'bg-orange-500' },
    { id: 'geography', name: 'Geography', icon: Globe, color: 'bg-teal-500' },
  ];

  const quickPrompts = [
    "Explain this concept simply",
    "Help me solve this problem",
    "Create a study plan",
    "Summarize this topic",
    "Give me practice questions"
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
      subject: selectedSubject
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: generateAIResponse(input, selectedSubject),
        timestamp: new Date(),
        subject: selectedSubject
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Update or create conversation
      updateConversation(newMessage.text, aiResponse.text);
    }, 1200);
  };

  const generateAIResponse = (_userInput: string, subject: string) => {
    const responses = {
      math: [
        "Let me break down this mathematical concept step by step...",
        "Here's how to approach this math problem systematically...",
        "I'll show you multiple ways to solve this equation..."
      ],
      science: [
        "This is a fascinating scientific concept! Let me explain...",
        "The scientific principle behind this involves...",
        "Here's what happens at the molecular level..."
      ],
      history: [
        "This historical event is significant because...",
        "Let me provide context about this period in history...",
        "The historical impact of this was..."
      ],
      geography: [
        "From a geographical perspective, this region...",
        "The geographical factors that influence this are...",
        "Let me explain the physical features of this area..."
      ],
      general: [
        "Great question! Let me help you understand this...",
        "I'd be happy to explain this concept to you...",
        "Here's a comprehensive explanation..."
      ]
    };

    const subjectResponses = responses[subject as keyof typeof responses] || responses.general;
    return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
  };

  const updateConversation = (userMessage: string, aiMessage: string) => {
    const conversationTitle = userMessage.length > 40 
      ? userMessage.substring(0, 40) + "..." 
      : userMessage;

    if (currentConversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, lastMessage: aiMessage, timestamp: new Date() }
            : conv
        )
      );
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: conversationTitle,
        lastMessage: aiMessage,
        timestamp: new Date(),
        subject: selectedSubject
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setShowSidebar(false);
  };

  const loadConversation = (conversation: Conversation) => {
    // In a real app, you'd load the full conversation history
    setMessages([]);
    setCurrentConversationId(conversation.id);
    setSelectedSubject(conversation.subject);
    setShowSidebar(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `📎 Uploaded: ${file.name}`,
        timestamp: new Date(),
        subject: selectedSubject
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  const handleVoiceRecord = () => {
    const voiceMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: '🎤 Voice message recorded',
      timestamp: new Date(),
      subject: selectedSubject
    };
    setMessages(prev => [...prev, voiceMessage]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">StudyAI</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Conversation */}
          <div className="p-4">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium">New Conversation</span>
            </button>
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => loadConversation(conversation)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {conversation.lastMessage}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${subjects.find(s => s.id === conversation.subject)?.color || 'bg-gray-400'}`}></span>
                      <span className="text-xs text-gray-400">
                        {conversation.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              {currentSubject && (
                <div className={`w-8 h-8 ${currentSubject.color} rounded-lg flex items-center justify-center`}>
                  <currentSubject.icon className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h1 className="font-semibold text-gray-900">StudyAI Assistant</h1>
                <p className="text-sm text-gray-500">{currentSubject?.name || 'General'}</p>
              </div>
            </div>
          </div>
          
          {/* Subject Selector */}
          <div className="hidden sm:flex">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            
            {/* Welcome Screen */}
            {messages.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hello! I'm your AI Study Assistant
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  I'm here to help you learn, solve problems, and understand complex topics. What would you like to explore today?
                </p>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {subjects.slice(1).map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedSubject === subject.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <subject.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-medium text-gray-900">{subject.name}</div>
                    </button>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-br from-purple-500 to-blue-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <span className="text-white font-medium text-sm">You</span>
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Subject Selector Mobile */}
        <div className="sm:hidden px-4 py-2 bg-white border-t border-gray-200">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors flex-shrink-0"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />

              {/* Text Input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything about your studies..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 resize-none max-h-32 min-h-[24px] py-2 px-0 border-none outline-none"
                rows={1}
                style={{ lineHeight: '24px' }}
              />

              {/* Voice Recording */}
              <button
                onClick={handleVoiceRecord}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors flex-shrink-0"
                title="Voice message"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-2">
              StudyAI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAI;