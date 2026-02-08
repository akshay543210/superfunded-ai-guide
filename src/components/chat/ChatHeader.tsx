import { Bot } from 'lucide-react';

const ChatHeader = () => {
  return (
    <header className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center neon-glow animate-pulse-glow">
        <Bot className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-display text-lg font-bold tracking-tight">SuperFunded AI</h1>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-secondary inline-block" />
          Official SuperFunded Assistant
        </p>
      </div>
    </header>
  );
};

export default ChatHeader;
