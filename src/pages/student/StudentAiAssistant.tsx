import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';
import { sessionManager } from '../../utils/sessionManager';
import type { ChatMessage } from '../../utils/sessionManager';
import { apiService } from '../../services/api';

// ✅ FIXED: More specific types for Speech Recognition

// Interface for the speech recognition event results
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Interface for a speech recognition error
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Interface describing an instance of the SpeechRecognition object
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Type for the constructor itself (e.g., `new SpeechRecognition()`)
type SpeechRecognitionConstructor = new () => SpeechRecognition;

// Update the global window interface with the specific constructor type
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  file?: File;
  inputMode?: 'text' | 'voice' | 'file' | 'image';
}

interface Sprint {
  name: string;
  topic?: string;
}

const StudentAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [databaseSessionId, setDatabaseSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ✅ FIXED: Specific type for the ref, replacing `any`
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Load existing chat history for current session and get current topic
  useEffect(() => {
    const currentSession = sessionManager.getCurrentSession();
    const userInfo = localStorage.getItem('userInfo');
    
    if (currentSession && userInfo) {
      const user = JSON.parse(userInfo);
      
      // Get current topic from sprintData
      const sprintData = JSON.parse(localStorage.getItem('sprintData') || '[]');
      const currentStudent = (sprintData as Sprint[]).find((sprint) => sprint.name === user.name);
      
      if (currentStudent && currentStudent.topic && currentStudent.topic !== 'Topic 1') {
        setCurrentTopic(currentStudent.topic);
        console.log('Current topic set to:', currentStudent.topic);
      } else {
        setCurrentTopic('');
        console.log('No specific topic allocated yet');
      }
      
      console.log('Loading chat history for session ID:', currentSession.sessionId);
      
      // Load session-specific chat history from session manager
      const evaluation = sessionManager.getEvaluation(currentSession.sessionId);
      if (evaluation && evaluation.messages) {
        console.log('Found existing session messages:', evaluation.messages);
        
        // Convert saved messages to Message format
        const loadedMessages: Message[] = evaluation.messages.map((msg: ChatMessage) => ({
          id: msg.id || Date.now().toString(),
          sender: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content,
          timestamp: new Date(msg.timestamp),
          file: msg.file
        }));
        setMessages(loadedMessages);
      } else {
        console.log('No existing session messages found, starting fresh');
      }
    }
  }, []);

  // Monitor for topic changes
  useEffect(() => {
    const checkTopicUpdate = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        const sprintData = JSON.parse(localStorage.getItem('sprintData') || '[]');
        const currentStudent = (sprintData as Sprint[]).find((sprint) => sprint.name === user.name);
        
        if (currentStudent && currentStudent.topic && currentStudent.topic !== 'Topic 1') {
          if (currentStudent.topic !== currentTopic) {
            setCurrentTopic(currentStudent.topic);
            console.log('Topic updated to:', currentStudent.topic);
          }
        }
      }
    };

    // Check immediately
    checkTopicUpdate();
    
    // Set up interval to check for topic updates every 2 seconds
    const interval = setInterval(checkTopicUpdate, 2000);
    
    return () => clearInterval(interval);
  }, [currentTopic]);

  // Save chat history whenever messages change
  const saveChatHistory = (updatedMessages: Message[]) => {
    const currentSession = sessionManager.getCurrentSession();
    if (!currentSession) {
      console.error('No active session found');
      return;
    }

    // Convert messages to the format expected by session manager
    const sessionMessages: ChatMessage[] = updatedMessages.map(msg => ({
      id: msg.id,
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
      timestamp: msg.timestamp.toLocaleString(),
      file: msg.file
    }));

    // Always get the latest evaluation (score/feedback if any)
    const existingEvaluation = sessionManager.getEvaluation(currentSession.sessionId);
    sessionManager.saveEvaluation({
      score: existingEvaluation ? existingEvaluation.score : 0,
      feedback: existingEvaluation ? existingEvaluation.feedback : 'Session in progress',
      messages: sessionMessages
    });
  };

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        // Send voice message directly
        const voiceMessage: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: transcript,
          timestamp: new Date(),
          inputMode: 'voice'
        };
        setMessages(prev => [...prev, voiceMessage]);
        setIsRecording(false);
      };

      // ✅ FIXED: Use the specific error event type
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startVoiceRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Get user info
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.error('No user info found');
      return;
    }

    const user = JSON.parse(userInfo);
    const studentId = user.id;
    
    // Use database session ID if available, otherwise try to get it
    let sessionId = databaseSessionId;
    if (!sessionId) {
      try {
        const activeSession = await apiService.getActiveSessionByStudent(studentId);
        if (activeSession && activeSession._id) {
          sessionId = activeSession._id;
          setDatabaseSessionId(sessionId);
        } else {
          console.error('No active session found in database');
          return;
        }
      } catch (error) {
        console.error('Error fetching active session:', error);
        return;
      }
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
      inputMode: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to database
      try {
        await apiService.addMessage(sessionId, {
          id: newMessage.id,
          role: 'user',
          content: newMessage.text,
          timestamp: newMessage.timestamp.toISOString(),
          studentId: studentId
        });
      } catch (dbError) {
        console.error('Error saving user message to database:', dbError);
        // Continue even if database save fails
      }

      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: input,
          // Optionally pass topic as subject hint
          subject: currentTopic || undefined
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponseText = data.answer || 'Sorry, I could not generate a response.';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);

      // Save AI response to database
      try {
        await apiService.addMessage(sessionId, {
          id: aiResponse.id,
          role: 'assistant',
          content: aiResponse.text,
          timestamp: aiResponse.timestamp.toISOString(),
          studentId: studentId
        });
      } catch (dbError) {
        console.error('Error saving AI message to database:', dbError);
        // Continue even if database save fails
      }

      const scoreMatch = aiResponseText.match(/📊 Score:\s*(\d+)\/10/);
      if (scoreMatch) {
        const score = scoreMatch[1];
        const allMessages: Message[] = [...messages, newMessage, aiResponse];
        const sessionMessages: ChatMessage[] = allMessages.map(msg => ({
          id: msg.id,
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
          timestamp: msg.timestamp.toLocaleString(),
          file: msg.file
        }));
        // Save to session manager for backward compatibility
        const currentSession = sessionManager.getCurrentSession();
        if (currentSession) {
          sessionManager.saveEvaluation({
            score: parseInt(score),
            feedback: 'Evaluation complete',
            messages: sessionMessages
          });
        }
        console.log('Score saved for session ID:', sessionId);
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I apologize, but I'm having trouble connecting to the backend right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again in a moment, or check your internet connection.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    const fileMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `📎 Uploaded: ${file.name}`,
      timestamp: new Date(),
      file: file,
      inputMode: file.type.startsWith('image/') ? 'image' : 'file'
    };
    
    setMessages(prev => [...prev, fileMessage]);
    setIsLoading(true);

    try {
      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3001';

      // 1) OCR the image to text
      let extractedText = '';
      if (file.type.startsWith('image/')) {
        const imageBase64 = await fileToBase64(file);
        const ocrRes = await fetch(`${backendUrl}/api/ocr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 })
        });
        if (!ocrRes.ok) throw new Error(`OCR failed: ${ocrRes.status}`);
        const ocrData = await ocrRes.json();
        extractedText = ocrData.text || '';
      } else {
        extractedText = await readFileContent(file);
      }

      // 2) Determine reference answer: use last AI message if present; else ask RAG for a correct answer
      const findLastAiMessage = () => {
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].sender === 'ai') return messages[i];
        }
        return null;
      };

      let referenceAnswer = findLastAiMessage()?.text || '';
      if (!referenceAnswer) {
        const getRefRes = await fetch(`${backendUrl}/api/rag/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: extractedText || `Please analyze this file: ${file.name}`,
            subject: currentTopic || undefined
          })
        });
        if (!getRefRes.ok) throw new Error(`Backend request failed: ${getRefRes.status}`);
        const getRefData = await getRefRes.json();
        referenceAnswer = getRefData.answer || '';
      }

      // 3) Evaluate extracted text against reference answer
      let evaluationText = '';
      if (referenceAnswer && extractedText) {
        const evalRes = await fetch(`${backendUrl}/api/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAnswer: extractedText,
            referenceAnswer
          })
        });
        if (!evalRes.ok) throw new Error(`Evaluation failed: ${evalRes.status}`);
        const evalData = await evalRes.json();
        evaluationText = evalData.evaluation || '';
      }

      const aiResponseText = evaluationText || referenceAnswer || 'Sorry, I could not analyze the file.';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);

      const scoreMatch = aiResponseText.match(/📊 Score:\s*(\d+)\/10/);
      if (scoreMatch) {
        const score = scoreMatch[1];
        const currentSession = sessionManager.getCurrentSession();
        if (currentSession) {
          const allMessages: Message[] = [...messages, fileMessage, aiResponse];
          const sessionMessages: ChatMessage[] = allMessages.map(msg => ({
            id: msg.id,
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
            timestamp: msg.timestamp.toLocaleString(),
            file: msg.file
          }));
          sessionManager.saveEvaluation({
            score: parseInt(score),
            feedback: 'Evaluation complete',
            messages: sessionMessages
          });
          console.log('Score saved for session ID:', currentSession.sessionId);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Sorry, I couldn't process the file "${file.name}". Please try uploading a different file or ask a question directly.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type.includes('text') || file.type.includes('pdf')) {
        reader.readAsText(file);
      } else {
        resolve(`File: ${file.name} (${file.type}) - Size: ${file.size} bytes`);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">StudyAI Assistant</h1>
              <p className="text-sm text-gray-500">CA Study Assistant</p>
              {currentTopic && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    📚 Topic: {currentTopic}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hello! I'm your CA Study Assistant
                </h2>
                {currentTopic ? (
                  <p className="text-gray-600 mb-4">
                    I'm currently focused on helping you with <span className="font-semibold text-blue-600">{currentTopic}</span>.
                    <br />
                    Please ask questions related to this topic for the best assistance.
                  </p>
                ) : (
                  <p className="text-gray-600 mb-4">
                    Waiting for your tutor to assign a specific topic. I'll help you with CA studies once a topic is selected.
                  </p>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
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

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
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
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={currentTopic ? `Ask me about ${currentTopic}...` : "Ask me anything about your CA studies..."}
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 resize-none max-h-32 min-h-[24px] py-2 px-0 border-none outline-none"
                rows={1}
                style={{ lineHeight: '24px' }}
              />
              <button
                onClick={handleVoiceRecord}
                className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                  isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                }`}
                title={isRecording ? "Stop recording" : "Voice message"}
              >
                <Mic className="w-5 h-5" />
              </button>
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