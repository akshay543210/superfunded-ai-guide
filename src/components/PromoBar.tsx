import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Promo {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  notes: string | null;
  end_date: string | null;
}

const PromoBar = () => {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchPromo = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('promo_codes')
        .select('id, code, discount_type, discount_value, notes, end_date')
        .eq('is_active', true)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setPromo(data[0]);
      }
    };
    fetchPromo();
  }, []);

  if (!promo || dismissed) return null;

  const discountText =
    promo.discount_type === 'percentage'
      ? `${promo.discount_value}% OFF`
      : `$${promo.discount_value} OFF`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden border-b border-primary/20"
      >
        <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 px-4 py-2.5">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 text-center">
            <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-foreground">
              <span className="font-bold text-primary">{discountText}</span>
              {promo.notes && (
                <span className="text-muted-foreground ml-1.5">— {promo.notes}</span>
              )}
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[11px] font-mono font-bold tracking-wider">
                {promo.code}
              </span>
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBar;
