import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end gap-3"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-2xl gradient-violet flex items-center justify-center flex-shrink-0 neon-glow-sm">
        <span className="text-[10px] font-bold tracking-wider text-primary-foreground">SF</span>
      </div>

      {/* Typing bubble */}
      <div className="ai-bubble px-5 py-4 rounded-2xl rounded-bl-md">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
