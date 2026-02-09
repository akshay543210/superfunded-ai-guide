import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Tag, Brain, Activity } from 'lucide-react';

interface Stats {
  totalFaqs: number;
  activeFaqs: number;
  totalPromos: number;
  activePromos: number;
  totalAiInfo: number;
  activeAiInfo: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalFaqs: 0, activeFaqs: 0,
    totalPromos: 0, activePromos: 0,
    totalAiInfo: 0, activeAiInfo: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [faqs, promos, aiInfo] = await Promise.all([
        supabase.from('faqs').select('is_active'),
        supabase.from('promo_codes').select('is_active'),
        supabase.from('ai_info').select('is_active'),
      ]);

      setStats({
        totalFaqs: faqs.data?.length ?? 0,
        activeFaqs: faqs.data?.filter(f => f.is_active).length ?? 0,
        totalPromos: promos.data?.length ?? 0,
        activePromos: promos.data?.filter(p => p.is_active).length ?? 0,
        totalAiInfo: aiInfo.data?.length ?? 0,
        activeAiInfo: aiInfo.data?.filter(a => a.is_active).length ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'FAQs', icon: HelpCircle, total: stats.totalFaqs, active: stats.activeFaqs, color: 'text-blue-400' },
    { title: 'Promo Codes', icon: Tag, total: stats.totalPromos, active: stats.activePromos, color: 'text-green-400' },
    { title: 'AI Information', icon: Brain, total: stats.totalAiInfo, active: stats.activeAiInfo, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your SuperFunded admin data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <Card key={card.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={cn('w-5 h-5', card.color)} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">
                {loading ? '—' : card.total}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {loading ? '' : `${card.active} active`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Data Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong className="text-foreground">FAQs</strong> → Shown on website + used by AI</p>
          <p>• <strong className="text-foreground">Promo Codes</strong> → Used by website pricing + AI answers</p>
          <p>• <strong className="text-foreground">AI Information</strong> → Overrides everything else for AI</p>
          <p className="text-xs mt-3 text-muted-foreground/70">Only active records are used by the chatbot and website.</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Need cn import
import { cn } from '@/lib/utils';

export default Dashboard;
