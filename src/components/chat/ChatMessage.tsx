import ReactMarkdown from 'react-markdown';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3 animate-message-in ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-secondary'
            : 'gradient-primary neon-glow-sm'
        }`}
      >
        <span className={`text-xs font-bold ${isUser ? 'text-secondary-foreground' : 'text-primary-foreground'}`}>
          {isUser ? 'You' : 'SF'}
        </span>
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'glass-card rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
            prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
            prose-headings:text-foreground prose-strong:text-foreground
            prose-a:text-neon-secondary prose-code:text-neon-secondary">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
