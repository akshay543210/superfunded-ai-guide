import { DollarSign, TrendingDown, BarChart3, Shield, Wallet, RotateCcw } from 'lucide-react';

const actions = [
  { label: 'Account Prices', icon: DollarSign, message: 'What are the SuperFunded account prices and plans?' },
  { label: 'Drawdown Rules', icon: TrendingDown, message: 'Explain the daily and overall drawdown rules with examples.' },
  { label: 'Consistency Rule', icon: BarChart3, message: 'What is the consistency rule and why does it exist?' },
  { label: 'Allowed Strategies', icon: Shield, message: 'What trading strategies are allowed and which are not?' },
  { label: 'Payout Rules', icon: Wallet, message: 'How do payouts work and what are the eligibility rules?' },
  { label: 'Account Reset', icon: RotateCcw, message: 'What is the reset and retry policy?' },
];

type QuickActionsProps = {
  onSelect: (message: string) => void;
  disabled?: boolean;
};

const QuickActions = ({ onSelect, disabled }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.message)}
          disabled={disabled}
          className="glass-card px-3 py-3 flex flex-col items-center gap-2 text-center
            hover:border-primary/50 hover:neon-glow-sm transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          <action.icon className="w-5 h-5 text-primary group-hover:text-neon-secondary transition-colors" />
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
