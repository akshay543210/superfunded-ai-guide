import { useRef, useEffect } from 'react';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import QuickActions from '@/components/chat/QuickActions';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { useChat } from '@/hooks/useChat';

const WELCOME_MESSAGE = `👋 Welcome to **SuperFunded AI**! I'm your official support assistant.

I can help you with account prices, drawdown rules, consistency rules, allowed strategies, payouts, and more.

Choose a topic below or type your question!`;

const Index = () => {
  const { messages, isLoading, send } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-[100dvh] gradient-bg">
      <ChatHeader />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {showWelcome && (
          <div className="animate-fade-in-up space-y-5 max-w-lg mx-auto pt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 neon-glow-sm">
                <span className="text-xs font-bold text-primary-foreground">SF</span>
              </div>
              <div className="glass-card px-4 py-3 rounded-xl rounded-tl-sm">
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
                  prose-p:my-1 prose-strong:text-foreground">
                  <p>👋 Welcome to <strong>SuperFunded AI</strong>! I'm your official support assistant.</p>
                  <p>I can help you with account prices, drawdown rules, consistency rules, allowed strategies, payouts, and more.</p>
                  <p>Choose a topic below or type your question!</p>
                </div>
              </div>
            </div>

            <QuickActions onSelect={send} disabled={isLoading} />
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
      </div>

      <div className="px-4 pb-4 pt-2">
        <ChatInput onSend={send} disabled={isLoading} />
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          AI guidance based on official SuperFunded rules · Powered by SuperFunded AI
        </p>
      </div>
    </div>
  );
};

export default Index;
