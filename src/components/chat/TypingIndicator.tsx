const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 animate-message-in">
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 neon-glow-sm">
        <span className="text-xs font-bold text-primary-foreground">SF</span>
      </div>
      <div className="glass-card px-4 py-3 max-w-[80px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
