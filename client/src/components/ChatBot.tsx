import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useTheme } from './ThemeProviderCustom';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { PeriodAnalysisData } from '../lib/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  initialOpen?: boolean;
}

interface ChatBotProps {
  periodData: PeriodAnalysisData;
  isLoading: boolean;
}

// The component used for the floating chatbot button
export function Chatbot({ initialOpen = false }: ChatbotProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your period assistant. How can I help you today? You can ask me about your cycle, symptoms, or any period-related questions.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      return apiRequest('/api/chat', { method: 'POST', body: { message } });
    },
    onSuccess: (data: any) => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    // Send to API
    sendMessageMutation.mutate(inputValue);
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 p-4 rounded-full shadow-lg"
        style={{ backgroundColor: colors.darker, color: 'white' }}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 w-80 sm:w-96 h-96 rounded-lg shadow-xl flex flex-col overflow-hidden bg-white border"
      style={{ borderColor: colors.darker }}
    >
      {/* Header */}
      <div className="p-3 flex justify-between items-center"
        style={{ backgroundColor: colors.darker, color: 'white' }}
      >
        <h3 className="font-medium">Uterly Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-white">
          <X size={18} />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-gray-100 ml-auto'
                : 'bg-[var(--color-lighter)] text-[var(--color-text)]'
            }`}
          >
            <div>{message.text}</div>
            <div className={`text-xs mt-1 ${
              message.sender === 'user' ? 'text-gray-500' : 'text-[var(--color-text)] opacity-70'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50"
          style={{ borderColor: colors.lighter }}
        />
        <button
          onClick={handleSendMessage}
          disabled={sendMessageMutation.isPending}
          className="p-2 rounded-md"
          style={{ backgroundColor: colors.darker, color: 'white' }}
        >
          {sendMessageMutation.isPending ? (
            <div className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `white transparent transparent transparent` }}
            />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

// This is to support the import in ChatbotTab.tsx
export default function ChatBot({ periodData, isLoading }: ChatBotProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>Loading your data...</p>
      </div>
    );
  }

  // Render the chat interface similar to the Chatbot component
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="p-3 font-medium bg-primary text-primary-foreground">
        Uterly AI Assistant
      </div>
      
      <div className="p-4 h-[400px] overflow-y-auto bg-gray-50">
        <div className="space-y-3">
          <div className="max-w-[80%] p-3 rounded-lg bg-primary/10">
            <p>Hello! I can analyze your period data and answer questions about your cycle. How can I help you today?</p>
          </div>
          
          <div className="ml-auto max-w-[80%] p-3 rounded-lg bg-gray-200">
            <p>You can ask me questions like:</p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>When is my next period expected?</li>
              <li>What symptoms have I been tracking most frequently?</li>
              <li>How long is my average cycle?</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your question here..." 
            className="flex-1 p-2 border rounded-md"
          />
          <button className="p-2 rounded-md bg-primary text-primary-foreground">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}