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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const PromosManager = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PromoCode | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');

  const fetchPromos = useCallback(async () => {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'Failed to load promo codes', variant: 'destructive' });
    } else {
      setPromos(data ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  const openCreate = () => {
    setEditing(null);
    setCode(''); setDiscountType('percentage'); setDiscountValue('');
    setStartDate(''); setEndDate(''); setIsActive(true); setNotes('');
    setDialogOpen(true);
  };

  const openEdit = (p: PromoCode) => {
    setEditing(p);
    setCode(p.code);
    setDiscountType(p.discount_type);
    setDiscountValue(String(p.discount_value));
    setStartDate(p.start_date ?? '');
    setEndDate(p.end_date ?? '');
    setIsActive(p.is_active);
    setNotes(p.notes ?? '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!code.trim() || !discountValue) {
      toast({ title: 'Validation', description: 'Code and discount value are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = {
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      start_date: startDate || null,
      end_date: endDate || null,
      is_active: isActive,
      notes: notes.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from('promo_codes').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Error', description: 'Failed to update promo', variant: 'destructive' });
      else toast({ title: 'Updated', description: 'Promo code updated.' });
    } else {
      const { error } = await supabase.from('promo_codes').insert(payload);
      if (error) toast({ title: 'Error', description: 'Failed to create promo', variant: 'destructive' });
      else toast({ title: 'Created', description: 'Promo code created.' });
    }

    setSaving(false);
    setDialogOpen(false);
    fetchPromos();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    else { toast({ title: 'Deleted' }); fetchPromos(); }
    setDeleting(null);
  };

  const toggleActive = async (p: PromoCode) => {
    const { error } = await supabase.from('promo_codes').update({ is_active: !p.is_active }).eq('id', p.id);
    if (!error) setPromos(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
  };

  const isExpired = (p: PromoCode) => p.end_date && new Date(p.end_date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Promo Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage discount codes for the website and AI.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Code</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="hidden sm:table-cell">Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No promo codes yet.</TableCell>
                </TableRow>
              ) : (
                promos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold">{p.code}</TableCell>
                    <TableCell>
                      {p.discount_type === 'percentage' ? `${p.discount_value}%` : `$${p.discount_value}`}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {p.start_date ? format(new Date(p.start_date), 'MMM d') : '—'} → {p.end_date ? format(new Date(p.end_date), 'MMM d') : '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                        {isExpired(p) && <Badge variant="destructive" className="text-[10px]">Expired</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                        {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Promo Code' : 'Add Promo Code'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={e => setCode(e.target.value)} placeholder="SUMMER25" className="uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="25" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (internal)</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..." rows={2} />
            </div>
            <div className="flex items-center gap-3">
              <Label>Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
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

export default PromosManager;
