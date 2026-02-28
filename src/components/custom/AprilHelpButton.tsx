'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface Message {
  id: string;
  role: 'user' | 'april';
  content: string;
  timestamp: Date;
}

export function AprilHelpButton() {
  const { t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'april',
          content: `Hello! 👋 I'm April, your AI assistant. I'm here to help you navigate WebFinder AI. You can ask me anything about:

• How to get started with your website project
• Understanding our pricing packages
• The website development process
• Payment options and invoices
• Any other questions you might have!

How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/april/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          context: 'user_help',
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: `april-${Date.now()}`,
            role: 'april',
            content: data.response,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Fallback response
        setMessages((prev) => [
          ...prev,
          {
            id: `april-${Date.now()}`,
            role: 'april',
            content: getFallbackResponse(input.trim()),
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error getting April response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `april-${Date.now()}`,
          role: 'april',
          content: getFallbackResponse(input.trim()),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('package')) {
      return `We offer three packages:

📦 **Standard Package** - $149 (≈ 91,000 CFA)
Perfect for small businesses needing a simple online presence.

📦 **Pro Package** - $399 (≈ 245,000 CFA)  
Our most popular choice! Great for growing businesses.

📦 **Premium Package** - $999 (≈ 615,000 CFA)
Complete solution with e-commerce and advanced features.

Would you like me to explain what's included in each package?`;
    }
    
    if (lowerQuery.includes('start') || lowerQuery.includes('begin') || lowerQuery.includes('how')) {
      return `Getting started is easy! Here's how:

1️⃣ Go to the Onboarding section
2️⃣ Fill out your website requirements
3️⃣ Choose your preferred package
4️⃣ Complete the payment
5️⃣ We'll start building your website!

Need help with any specific step?`;
    }
    
    if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
      return `We accept multiple payment methods:

💳 Credit/Debit Cards (Visa, Mastercard)
📱 Mobile Money (MTN, Orange)
🏦 Bank Transfer

All payments are secure and you'll receive an invoice via email after completion.`;
    }
    
    if (lowerQuery.includes('time') || lowerQuery.includes('long') || lowerQuery.includes('duration')) {
      return `Website delivery times vary by package:

📦 Standard: 5-7 business days
📦 Pro: 7-14 business days  
📦 Premium: 14-21 business days

We'll keep you updated throughout the process!`;
    }

    return `Thanks for your question! I'm here to help you with anything about WebFinder AI. 

You can ask me about:
• Pricing and packages
• How to get started
• Payment options
• Website features
• Delivery timeline

What would you like to know more about?`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open April help chat"
      >
        <div className="relative">
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-25" />
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 shadow-2xl transition-transform group-hover:scale-110">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src="/april-avatar.jpg" alt="April" />
              <AvatarFallback className="bg-transparent text-white font-bold text-lg">A</AvatarFallback>
            </Avatar>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              Need help? Chat with April!
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 bg-gray-900 h-2 w-2" />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? 'bottom-6 right-6 w-72'
          : 'bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96'
      }`}
    >
      <Card className="shadow-2xl border-2 border-blue-200 overflow-hidden">
        {/* Header */}
        <CardHeader className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white">
                <AvatarImage src="/april-avatar.jpg" alt="April" />
                <AvatarFallback className="bg-transparent text-white font-bold">A</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                  April
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                </CardTitle>
                <p className="text-xs text-blue-100">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Chat Content */}
        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-64 sm:h-80 p-3 sm:p-4" ref={scrollRef}>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.role === 'april' ? (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-blue-200 flex-shrink-0">
                        <AvatarImage src="/april-avatar.jpg" alt="April" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                          A
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3 sm:px-4 py-2 max-w-[85%] ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-gray-100 dark:bg-gray-800 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 sm:gap-3">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-blue-200 flex-shrink-0">
                      <AvatarImage src="/april-avatar.jpg" alt="April" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                        A
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 sm:px-4 py-2 rounded-tl-sm">
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t bg-gray-50 dark:bg-gray-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask April anything..."
                  className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
