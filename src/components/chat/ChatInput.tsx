import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowUp } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = input.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative"
    >
      {/* Glow backdrop when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -inset-1 rounded-3xl bg-primary/5 blur-xl"
          />
        )}
      </AnimatePresence>

      <div
        className={`relative glass-card-strong p-2 flex items-end gap-2 transition-all duration-300 ${
          isFocused ? 'border-primary/30 neon-glow-sm' : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask about SuperFunded rules, payouts, strategies..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground 
            placeholder:text-muted-foreground/70 px-4 py-3 max-h-[140px] leading-relaxed"
        />

        {/* Send button with morph animation */}
        <motion.button
          onClick={handleSubmit}
          disabled={disabled || !hasContent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 
            transition-all duration-300 cursor-pointer
            ${hasContent && !disabled
              ? 'gradient-violet neon-glow-sm'
              : 'bg-secondary/50'
            }
            disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <AnimatePresence mode="wait">
            {hasContent ? (
              <motion.div
                key="send"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUp className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Send className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatInput;
