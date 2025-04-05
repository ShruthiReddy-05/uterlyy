import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatMessage, PeriodAnalysisData, getChatResponse } from '@/lib/geminiService';
import { SendIcon, RefreshCwIcon, BotIcon, UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatBotProps {
  periodData: PeriodAnalysisData;
  isLoading: boolean;
}

export default function ChatBot({ periodData, isLoading }: ChatBotProps) {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'bot', 
      content: 'Hello! I\'m your Cyclia assistant. I can analyze your period data and answer questions about your cycle. How can I help you today?' 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    
    // Clear input
    setQuery('');
    setIsProcessing(true);
    
    try {
      // If there's not enough data yet, provide a simple response
      if (!periodData.periodLogs || periodData.periodLogs.length === 0) {
        setTimeout(() => {
          setChatHistory(prev => [
            ...prev, 
            { 
              role: 'bot', 
              content: "I don't see any period data in your account yet. Start logging your periods to get personalized insights and answers to your questions!" 
            }
          ]);
          setIsProcessing(false);
        }, 1000);
        return;
      }
      
      // Get response from Gemini
      const response = await getChatResponse(periodData, userMessage.content, chatHistory);
      
      // Add bot response to chat
      setChatHistory(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      toast({
        title: 'Error',
        description: 'Sorry, I couldn\'t process your request. Please try again.',
        variant: 'destructive'
      });
      
      // Add error message to chat
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'bot', 
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setChatHistory([
      { 
        role: 'bot', 
        content: 'Chat cleared. How can I help you with your cycle today?' 
      }
    ]);
  };

  // Sample questions to suggest to the user
  const sampleQuestions = [
    "What patterns do you see in my cycle?",
    "How long is my average cycle?",
    "What are my most common symptoms?",
    "How does my mood change during my period?",
    "When is my next period likely to start?"
  ];

  return (
    <Card className="w-full h-[calc(100vh-13rem)] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BotIcon className="text-primary h-5 w-5" />
          Cyclia Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-3/4 h-16 rounded-md" />
            <Skeleton className="w-1/2 h-16 rounded-md ml-auto" />
            <Skeleton className="w-2/3 h-16 rounded-md" />
          </div>
        ) : (
          <>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 pb-4">
                {chatHistory.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] flex gap-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <UserIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                      ) : (
                        <BotIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 flex items-center gap-2">
                      <BotIcon className="h-5 w-5" />
                      <div className="flex gap-1">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {chatHistory.length === 1 && periodData.periodLogs && periodData.periodLogs.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((question, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setQuery(question);
                          handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={clearChat}
            disabled={isProcessing || chatHistory.length <= 1}
            title="Clear chat"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
          
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your cycle..."
            disabled={isProcessing || isLoading}
            className="flex-1"
          />
          
          <Button type="submit" size="icon" disabled={!query.trim() || isProcessing || isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}