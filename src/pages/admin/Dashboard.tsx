import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Tag, Brain, Activity, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stats {
  totalFaqs: number;
  activeFaqs: number;
  totalPromos: number;
  activePromos: number;
  totalAiInfo: number;
  activeAiInfo: number;
}

interface ChatStats {
  totalMessages: number;
  uniqueSessions: number;
  todayMessages: number;
  todaySessions: number;
  last7DaysMessages: number;
  successRate: number;
  recentMessages: { user_message: string; created_at: string; ai_response_status: string }[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalFaqs: 0, activeFaqs: 0,
    totalPromos: 0, activePromos: 0,
    totalAiInfo: 0, activeAiInfo: 0,
  });
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalMessages: 0, uniqueSessions: 0,
    todayMessages: 0, todaySessions: 0,
    last7DaysMessages: 0, successRate: 100,
    recentMessages: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [faqs, promos, aiInfo, allChats, todayChats, weekChats, recentChats] = await Promise.all([
        supabase.from('faqs').select('is_active'),
        supabase.from('promo_codes').select('is_active'),
        supabase.from('ai_info').select('is_active'),
        supabase.from('chat_sessions').select('session_id, ai_response_status'),
        supabase.from('chat_sessions').select('session_id').gte('created_at', today),
        supabase.from('chat_sessions').select('id').gte('created_at', sevenDaysAgo),
        supabase.from('chat_sessions').select('user_message, created_at, ai_response_status').order('created_at', { ascending: false }).limit(20),
      ]);

      setStats({
        totalFaqs: faqs.data?.length ?? 0,
        activeFaqs: faqs.data?.filter(f => f.is_active).length ?? 0,
        totalPromos: promos.data?.length ?? 0,
        activePromos: promos.data?.filter(p => p.is_active).length ?? 0,
        totalAiInfo: aiInfo.data?.length ?? 0,
        activeAiInfo: aiInfo.data?.filter(a => a.is_active).length ?? 0,
      });

      const allSessions = new Set(allChats.data?.map(c => c.session_id) ?? []);
      const todaySessions = new Set(todayChats.data?.map(c => c.session_id) ?? []);
      const successCount = allChats.data?.filter(c => c.ai_response_status === 'success').length ?? 0;
      const total = allChats.data?.length ?? 0;

      setChatStats({
        totalMessages: total,
        uniqueSessions: allSessions.size,
        todayMessages: todayChats.data?.length ?? 0,
        todaySessions: todaySessions.size,
        last7DaysMessages: weekChats.data?.length ?? 0,
        successRate: total > 0 ? Math.round((successCount / total) * 100) : 100,
        recentMessages: recentChats.data ?? [],
      });

      setLoading(false);
    };
    fetchStats();
  }, []);

  const contentCards = [
    { title: 'FAQs', icon: HelpCircle, total: stats.totalFaqs, active: stats.activeFaqs, color: 'text-blue-400' },
    { title: 'Promo Codes', icon: Tag, total: stats.totalPromos, active: stats.activePromos, color: 'text-green-400' },
    { title: 'AI Information', icon: Brain, total: stats.totalAiInfo, active: stats.activeAiInfo, color: 'text-purple-400' },
  ];

  const chatCards = [
    { title: 'Total Questions', value: chatStats.totalMessages, sub: `${chatStats.last7DaysMessages} last 7 days`, icon: MessageSquare, color: 'text-cyan-400' },
    { title: 'Unique Users', value: chatStats.uniqueSessions, sub: `${chatStats.todaySessions} today`, icon: Users, color: 'text-amber-400' },
    { title: 'Today\'s Messages', value: chatStats.todayMessages, sub: 'questions asked today', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Success Rate', value: `${chatStats.successRate}%`, sub: 'AI response success', icon: Activity, color: 'text-rose-400' },
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your SuperFunded admin data & chat analytics.</p>
      </div>

      {/* Chat Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Chat Analytics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chatCards.map(card => (
            <Card key={card.title} className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={cn('w-5 h-5', card.color)} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold font-display">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {loading ? '' : card.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Questions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : chatStats.recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chat messages yet. Questions will appear here once users start chatting.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {chatStats.recentMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    msg.ai_response_status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{msg.user_message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatTime(msg.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Management Stats */}
      <div className="space-y-4">
        <h2 className="text-lg font-display font-semibold">Content Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentCards.map(card => (
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
      </div>

      {/* Data Flow */}
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

export default Dashboard;
