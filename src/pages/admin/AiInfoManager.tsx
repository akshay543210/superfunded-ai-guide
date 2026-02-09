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
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';

const INFO_TYPES = ['rules', 'pricing', 'legal', 'promo'];

interface AiInfo {
  id: string;
  title: string;
  content: string;
  info_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AiInfoManager = () => {
  const [items, setItems] = useState<AiInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AiInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [infoType, setInfoType] = useState('rules');
  const [isActive, setIsActive] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('ai_info')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) toast({ title: 'Error', description: 'Failed to load AI info', variant: 'destructive' });
    else setItems(data ?? []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setTitle(''); setContent(''); setInfoType('rules'); setIsActive(true);
    setDialogOpen(true);
  };

  const openEdit = (item: AiInfo) => {
    setEditing(item);
    setTitle(item.title); setContent(item.content);
    setInfoType(item.info_type); setIsActive(item.is_active);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Validation', description: 'Title and content are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = { title: title.trim(), content: content.trim(), info_type: infoType, is_active: isActive };

    if (editing) {
      const { error } = await supabase.from('ai_info').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
      else toast({ title: 'Updated', description: 'AI info updated.' });
    } else {
      const { error } = await supabase.from('ai_info').insert(payload);
      if (error) toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' });
      else toast({ title: 'Created', description: 'AI info created.' });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('ai_info').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    else { toast({ title: 'Deleted' }); fetchItems(); }
    setDeleting(null);
  };

  const toggleActive = async (item: AiInfo) => {
    const { error } = await supabase.from('ai_info').update({ is_active: !item.is_active }).eq('id', item.id);
    if (!error) setItems(prev => prev.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x));
  };

  const filtered = items.filter(i => {
    const matchSearch = search === '' ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.content.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || i.info_type === filterType;
    return matchSearch && matchType;
  });

  const typeBadgeColor = (t: string) => {
    switch (t) {
      case 'rules': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pricing': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'legal': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'promo': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">AI Information</h1>
          <p className="text-muted-foreground text-sm mt-1">Control what SuperFunded AI is allowed to say. Active records override everything.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Info</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {INFO_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No AI info records.</TableCell>
                </TableRow>
              ) : (
                filtered.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[300px] truncate font-medium">{item.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={typeBadgeColor(item.info_type)}>
                        {item.info_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={item.is_active} onCheckedChange={() => toggleActive(item)} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(item.updated_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)} disabled={deleting === item.id}>
                        {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit AI Info' : 'Add AI Info'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Drawdown Rules Update" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Official information the AI should use..." rows={8} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={infoType} onValueChange={setInfoType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INFO_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
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

export default AiInfoManager;
