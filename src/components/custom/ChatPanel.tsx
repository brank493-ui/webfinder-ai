'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  User,
  Send,
  Loader2,
  Sparkles,
  CreditCard,
  X,
} from 'lucide-react';
import { PRICING_PACKAGES } from '@/lib/pricing';
import type { ChatMessage } from '@/types';

export function ChatPanel() {
  const { t } = useLanguageStore();
  const {
    selectedBusiness,
    isChatOpen,
    setIsChatOpen,
    conversation,
    addMessage,
    isAiTyping,
    setIsAiTyping,
    selectedPackage,
    setSelectedPackage,
    clearConversation,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  // Close chat and reset
  const handleClose = () => {
    setIsChatOpen(false);
    clearConversation();
    setConversationId(null);
    setShowPricing(false);
    setSelectedPackage(null);
  };

  // Send message to AI
  const handleSend = async () => {
    if (!input.trim() || !selectedBusiness || isAiTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusiness.id,
          message: input.trim(),
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        addMessage(data.message);
        setConversationId(data.conversationId);

        // Check if AI is presenting pricing
        if (
          data.message.content.toLowerCase().includes('package') ||
          data.message.content.toLowerCase().includes('pricing') ||
          data.message.content.toLowerCase().includes('$')
        ) {
          setShowPricing(true);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: t('chat.sorryError'),
        timestamp: new Date(),
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  // Handle package selection
  const handleSelectPackage = async (packageId: 'standard' | 'pro') => {
    setSelectedPackage(packageId);

    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBusiness?.id,
          packageId,
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Add confirmation message
        addMessage({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `${t('chat.greatChoice')} ${t('chat.redirecting')} ${packageId === 'pro' ? 'Pro' : 'Standard'} package. ${t('chat.receiveWorkspace')}`,
          timestamp: new Date(),
        });

        // Redirect to payment
        setTimeout(() => {
          window.location.href = data.checkoutUrl;
        }, 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: t('chat.paymentError'),
        timestamp: new Date(),
      });
    }
  };

  return (
    <Sheet open={isChatOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600">
                <AvatarFallback className="bg-transparent">
                  <Bot className="h-6 w-6 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left">{t('chat.assistant')}</SheetTitle>
                <SheetDescription className="text-left">
                  {selectedBusiness?.name || t('chat.chatWithAi')}
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedBusiness && (
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{selectedBusiness.category}</Badge>
              {selectedBusiness.rating && (
                <Badge variant="secondary">{selectedBusiness.rating} {t('chat.stars')}</Badge>
              )}
            </div>
          )}
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-200'
                    }
                  >
                    {message.role === 'assistant' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {/* Pricing Cards */}
            {showPricing && !selectedPackage && (
              <div className="space-y-3 pt-4">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  {t('chat.choosePackage')}
                </p>
                {PRICING_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                      pkg.highlighted ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleSelectPackage(pkg.id as 'standard' | 'pro')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold">${pkg.price}</span>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {pkg.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-blue-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-3"
                      variant={pkg.highlighted ? 'default' : 'outline'}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t('chat.selectPackage')} {pkg.name}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
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
              placeholder={t('chat.typeMessage')}
              disabled={isAiTyping || !!selectedPackage}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isAiTyping || !!selectedPackage}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
