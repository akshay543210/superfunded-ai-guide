import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  index?: number;
};

const ChatMessage = ({ role, content, index = 0 }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index * 0.05, 0.15),
      }}
      className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 300 }}
        className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-secondary/80'
            : 'gradient-violet neon-glow-sm'
        }`}
      >
        <span className={`text-[10px] font-bold tracking-wider ${
          isUser ? 'text-secondary-foreground' : 'text-primary-foreground'
        }`}>
          {isUser ? 'YOU' : 'SF'}
        </span>
      </motion.div>

      {/* Message bubble */}
      <div
        className={`max-w-[82%] sm:max-w-[75%] px-4 py-3 ${
          isUser
            ? 'user-bubble rounded-2xl rounded-br-md'
            : 'ai-bubble rounded-2xl rounded-bl-md'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed text-primary-foreground">{content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
            prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
            prose-headings:text-foreground prose-headings:font-display
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-neon-secondary prose-a:no-underline hover:prose-a:underline
            prose-code:text-neon-secondary prose-code:bg-secondary/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
