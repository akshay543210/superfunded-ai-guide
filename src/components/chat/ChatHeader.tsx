import { motion } from 'framer-motion';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ChatHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center gap-4 px-5 py-4 border-b border-border/30"
    >
      {/* Avatar with glow ring */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-glow-ring neon-glow-sm" />
        <div className="relative w-11 h-11 rounded-full gradient-violet flex items-center justify-center neon-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
            SuperFunded AI
          </h1>
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-secondary" />
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Official SuperFunded Assistant
          </p>
        </div>
      </div>

      {/* Trust badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4, type: 'spring' }}
      >
        <Badge
          variant="outline"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border-primary/30 bg-primary/5 text-primary text-[10px] font-semibold tracking-wider uppercase"
        >
          <ShieldCheck className="w-3 h-3" />
          Official Docs
        </Badge>
      </motion.div>

      {/* Subtle header line glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.header>
  );
};

export default ChatHeader;
