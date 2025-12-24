import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  hall_id: string;
  item_name: string;
  category: string | null;
  quantity: number;
  status: 'available' | 'in_use' | 'under_repair' | 'disposed';
  description: string | null;
  halls?: { name: string };
}

interface Hall {
  id: string;
  name: string;
}

const InventoryManagement = () => {
  const { user, isHallManager } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: 0,
    status: 'available' as InventoryItem['status'],
    description: '',
    hall_id: '',
  });

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, halls(name)')
        .order('item_name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const { data, error } = await supabase
        .from('halls')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setHalls(data || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchHalls();
  }, []);

  const resetForm = () => {
    setFormData({
      item_name: '',
      category: '',
      quantity: 0,
      status: 'available',
      description: '',
      hall_id: '',
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!formData.item_name || !formData.hall_id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in required fields',
      });
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('inventory')
          .update({
            item_name: formData.item_name,
            category: formData.category || null,
            quantity: formData.quantity,
            status: formData.status,
            description: formData.description || null,
            last_checked_at: new Date().toISOString(),
            last_checked_by: user?.id,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Item updated successfully' });
      } else {
        const { error } = await supabase
          .from('inventory')
          .insert({
            hall_id: formData.hall_id,
            item_name: formData.item_name,
            category: formData.category || null,
            quantity: formData.quantity,
            status: formData.status,
            description: formData.description || null,
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Item added successfully' });
      }

      setIsAddDialogOpen(false);
      resetForm();
      fetchInventory();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      category: item.category || '',
      quantity: item.quantity,
      status: item.status,
      description: item.description || '',
      hall_id: item.hall_id,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Deleted', description: 'Item removed successfully' });
      fetchInventory();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-600">Available</Badge>;
      case 'in_use':
        return <Badge variant="secondary">In Use</Badge>;
      case 'under_repair':
        return <Badge variant="outline">Under Repair</Badge>;
      case 'disposed':
        return <Badge variant="destructive">Disposed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Inventory">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Inventory Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {isHallManager ? 'Manage inventory for your hall' : 'View inventory across all halls'}
          </p>
          {isHallManager && (
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Hall *</Label>
                    <Select
                      value={formData.hall_id}
                      onValueChange={(v) => setFormData({ ...formData, hall_id: v })}
                      disabled={!!editingItem}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hall" />
                      </SelectTrigger>
                      <SelectContent>
                        {halls.map((hall) => (
                          <SelectItem key={hall.id} value={hall.id}>
                            {hall.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input
                      value={formData.item_name}
                      onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                      placeholder="e.g., Chairs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Furniture"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as InventoryItem['status'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="in_use">In Use</SelectItem>
                          <SelectItem value="under_repair">Under Repair</SelectItem>
                          <SelectItem value="disposed">Disposed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingItem ? 'Update' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Hall</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  {isHallManager && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell>{item.halls?.name || 'N/A'}</TableCell>
                    <TableCell>{item.category || '-'}</TableCell>
                    <TableCell>
                      <span className={item.quantity < 10 ? 'text-destructive font-bold' : ''}>
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    {isHallManager && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {inventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isHallManager ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InventoryManagement;
