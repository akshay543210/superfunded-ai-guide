import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['pricing', 'rules', 'payouts', 'eligibility', 'trading', 'general'];

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FaqsManager = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('general');
  const [isActive, setIsActive] = useState(true);

  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load FAQs', variant: 'destructive' });
    } else {
      setFaqs(data ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const openCreate = () => {
    setEditing(null);
    setQuestion('');
    setAnswer('');
    setCategory('general');
    setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsActive(faq.is_active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      toast({ title: 'Validation', description: 'Question and answer are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from('faqs')
        .update({ question: question.trim(), answer: answer.trim(), category, is_active: isActive })
        .eq('id', editing.id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to update FAQ', variant: 'destructive' });
      } else {
        toast({ title: 'Updated', description: 'FAQ updated successfully.' });
      }
    } else {
      const { error } = await supabase
        .from('faqs')
        .insert({ question: question.trim(), answer: answer.trim(), category, is_active: isActive });
      if (error) {
        toast({ title: 'Error', description: 'Failed to create FAQ', variant: 'destructive' });
      } else {
        toast({ title: 'Created', description: 'FAQ created successfully.' });
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchFaqs();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete FAQ', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'FAQ deleted.' });
      fetchFaqs();
    }
    setDeleting(null);
  };

  const toggleActive = async (faq: Faq) => {
    const { error } = await supabase
      .from('faqs')
      .update({ is_active: !faq.is_active })
      .eq('id', faq.id);
    if (!error) {
      setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f));
    }
  };

  const filtered = faqs.filter(f => {
    const matchSearch = search === '' ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">FAQs Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage questions and answers for the website and AI.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No FAQs found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(faq => (
                  <TableRow key={faq.id}>
                    <TableCell className="max-w-[300px] truncate font-medium">{faq.question}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={faq.is_active} onCheckedChange={() => toggleActive(faq)} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(faq.updated_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(faq.id)}
                        disabled={deleting === faq.id}
                      >
                        {deleting === faq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={question} onChange={e => setQuestion(e.target.value)} placeholder="What is...?" />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="The answer is..." rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="pt-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaqsManager;
