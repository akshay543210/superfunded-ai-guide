import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import QuickActions from '@/components/chat/QuickActions';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ParticleBackground from '@/components/effects/ParticleBackground';
import CursorGlow from '@/components/effects/CursorGlow';
import PromoBar from '@/components/PromoBar';
import { useChat } from '@/hooks/useChat';
import { ShieldCheck } from 'lucide-react';
import sfLogo from '@/assets/sf-logo.webp';

const Index = () => {
  const { messages, isLoading, send } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden">
      {/* Cinematic background */}
      <ParticleBackground />
      <CursorGlow />

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col h-full">
        <PromoBar />
        <ChatHeader />

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 scrollbar-hidden"
        >
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Welcome state */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 pt-4"
                >
                  {/* Welcome message */}
                  <div className="flex items-end gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                      className="w-8 h-8 rounded-2xl overflow-hidden flex-shrink-0 neon-glow-sm"
                    >
                      <img src={sfLogo} alt="SF" className="w-full h-full object-cover" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="ai-bubble px-5 py-4 rounded-2xl rounded-bl-md max-w-[85%]"
                    >
                      <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
                        prose-p:my-1.5 prose-strong:text-foreground prose-strong:font-semibold">
                        <p>👋 Welcome to <strong>SuperFunded AI</strong>!</p>
                        <p>I'm your official support assistant. My answers are based exclusively on the official SuperFunded Rules & Conditions, General Terms, Privacy Policy, and Website Terms.</p>
                        <p className="text-muted-foreground">Choose a topic below or type your question.</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Trust banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Answers based on official SuperFunded documents (V.2 — Jan 2026)
                    </p>
                  </motion.div>

                  {/* Quick actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <QuickActions onSelect={send} disabled={isLoading} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} index={i} />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <TypingIndicator />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input area */}
        <div className="relative px-4 sm:px-6 pb-4 pt-2">
          <div className="max-w-2xl mx-auto">
            <ChatInput onSend={send} disabled={isLoading} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-[10px] text-muted-foreground/60 mt-3 font-medium tracking-wide"
            >
              AI guidance based on official SuperFunded Rules, Terms & Policies · Powered by SuperFunded AI
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
