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
  periodData?: PeriodAnalysisData;
  isLoading?: boolean;
}

export function Chatbot({ initialOpen = false, periodData, isLoading }: ChatbotProps) {
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

  // Update welcome message if data is still loading
  useEffect(() => {
    if (isLoading) {
      setMessages([{
        id: 1,
        text: "I'm gathering your period data. Please wait a moment...",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [isLoading]);
  
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => {
      return apiRequest('/api/chat', { 
        method: 'POST', 
        body: { 
          message,
          periodData: periodData // Send period data to the API
        } 
      });
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
    // Don't allow sending messages if still loading data or the input is empty
    if (!inputValue.trim() || isLoading || sendMessageMutation.isPending) return;
    
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
          placeholder={isLoading ? "Loading data..." : "Type a message..."}
          disabled={isLoading || sendMessageMutation.isPending}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50"
          style={{ borderColor: colors.lighter }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || sendMessageMutation.isPending}
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