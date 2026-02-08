import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, BarChart3, Shield, Wallet, RotateCcw, Clock, AlertTriangle } from 'lucide-react';

const actions = [
  { label: 'Account Prices', icon: DollarSign, message: 'What are the SuperFunded account prices for 1-Step and 2-Step challenges?' },
  { label: 'Drawdown Rules', icon: TrendingDown, message: 'Explain the daily drawdown and maximum overall drawdown rules for 1-Step and 2-Step challenges with examples.' },
  { label: 'Profit Distribution', icon: BarChart3, message: 'What is the profit distribution (consistency) rule and the profit cap?' },
  { label: 'Prohibited Strategies', icon: AlertTriangle, message: 'What trading strategies are prohibited at SuperFunded?' },
  { label: 'Payout Rules', icon: Wallet, message: 'How do payouts work? What is the minimum payout, waiting period, and profit share?' },
  { label: 'News Trading', icon: Clock, message: 'What are the news trading rules at SuperFunded?' },
];

type QuickActionsProps = {
  onSelect: (message: string) => void;
  disabled?: boolean;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const QuickActions = ({ onSelect, disabled }: QuickActionsProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
    >
      {actions.map((action) => (
        <motion.button
          key={action.label}
          variants={item}
          onClick={() => onSelect(action.message)}
          disabled={disabled}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="glass-card px-3 py-4 flex flex-col items-center gap-2.5 text-center
            hover:border-primary/40 transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer
            relative overflow-hidden"
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
            bg-gradient-to-t from-primary/5 to-transparent" />

          <div className="relative w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center
            group-hover:bg-primary/20 transition-colors duration-300">
            <action.icon className="w-4 h-4 text-primary group-hover:text-neon-secondary transition-colors duration-300" />
          </div>
          <span className="relative text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {action.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickActions;
