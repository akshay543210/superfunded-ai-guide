import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
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

  return (
    <div className="glass-card p-2 flex items-end gap-2 neon-glow-sm">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about SuperFunded rules, payouts, strategies..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground 
          placeholder:text-muted-foreground px-3 py-2 max-h-[120px]"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center 
          disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity
          flex-shrink-0 cursor-pointer"
      >
        <Send className="w-4 h-4 text-primary-foreground" />
      </button>
    </div>
  );
};

export default ChatInput;
