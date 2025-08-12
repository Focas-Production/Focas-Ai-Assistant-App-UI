import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';
import { sessionManager } from '../../utils/sessionManager';
import type { ChatMessage } from '../../utils/sessionManager';

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
        setInput(transcript);
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

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a strict and accurate CA (Chartered Accountant) Exam Evaluator AI.
              
              Students will submit only their answers via text or voice. The question is not provided. 
              
              IMPORTANT: You are currently restricted to evaluate ONLY questions related to: ${currentTopic || 'No specific topic allocated yet'}
              
              Your responsibilities:
              
              1. Carefully infer the most likely CA-related question based on the student's answer.
              2. Evaluate the accuracy, completeness, and relevance of their answer in the context of Chartered Accountancy subjects.
              3. Say whether the answer is correct, partially correct, or incorrect.
              4. If incorrect or partially correct, provide the correct answer or explanation.
              5. Give a score out of 10 and an accuracy percentage.
              6. ${currentTopic ? `ONLY evaluate topics related to: ${currentTopic}. If the student's answer is not related to ${currentTopic}, politely redirect them to focus on ${currentTopic}.` : 'Only evaluate topics from the CA syllabus: accounting, taxation, auditing, law, etc.'}
              7. Never make up unrelated questions. Stick strictly to CA context.
              
              ${currentTopic ? `TOPIC RESTRICTION: You must only evaluate answers related to ${currentTopic}. If the student asks about other topics, politely remind them to focus on ${currentTopic}.` : ''}
              
              Respond in the following format:
              
              ✅ Evaluation: [Your judgment]
              📘 Inferred Question: [What you think the student was answering]
              📘 Correction (if any): [Correct answer or missing parts]
              📊 Score: X/10
              🎯 Accuracy: Y%`
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: input
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

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
          const allMessages: Message[] = [...messages, newMessage, aiResponse];
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
      console.error('Error calling OpenAI API:', error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I apologize, but I'm having trouble connecting to my knowledge base right now. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again in a moment, or check your internet connection.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const processFile = async (file: File) => {
    const fileMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `📎 Uploaded: ${file.name}`,
      timestamp: new Date(),
      file: file
    };
    
    setMessages(prev => [...prev, fileMessage]);
    setIsLoading(true);

    try {
      const fileContent = await readFileContent(file);
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a strict and accurate CA (Chartered Accountant) Exam Evaluator AI.
              
              Students will submit only their answers via text or voice. The question is not provided. 
              
              IMPORTANT: You are currently restricted to evaluate ONLY questions related to: ${currentTopic || 'No specific topic allocated yet'}
              
              Your responsibilities:
              
              1. Carefully infer the most likely CA-related question based on the student's answer.
              2. Evaluate the accuracy, completeness, and relevance of their answer in the context of Chartered Accountancy subjects.
              3. Say whether the answer is correct, partially correct, or incorrect.
              4. If incorrect or partially correct, provide the correct answer or explanation.
              5. Give a score out of 10 and an accuracy percentage.
              6. ${currentTopic ? `ONLY evaluate topics related to: ${currentTopic}. If the student's answer is not related to ${currentTopic}, politely redirect them to focus on ${currentTopic}.` : 'Only evaluate topics from the CA syllabus: accounting, taxation, auditing, law, etc.'}
              7. Never make up unrelated questions. Stick strictly to CA context.
              
              ${currentTopic ? `TOPIC RESTRICTION: You must only evaluate answers related to ${currentTopic}. If the student asks about other topics, politely remind them to focus on ${currentTopic}.` : ''}
              
              Respond in the following format:
              
              ✅ Evaluation: [Your judgment]
              📘 Inferred Question: [What you think the student was answering]
              📘 Correction (if any): [Correct answer or missing parts]
              📊 Score: X/10
              🎯 Accuracy: Y%`
            },
            {
              role: 'user',
              content: `Please analyze this file: ${file.name}\n\nFile content:\n${fileContent}`
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices[0]?.message?.content || 'Sorry, I could not analyze the file.';

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