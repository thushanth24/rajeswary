import { useEffect, useState, useCallback } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Edit, Trash2, Calendar, CheckCircle, ClipboardList, ArrowLeftRight, AlertTriangle, Search } from 'lucide-react';
import { format, isToday, isTomorrow, addDays, isBefore } from 'date-fns';

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

interface UpcomingBooking {
  id: string;
  reference_number: string | null;
  customer_name: string;
  event_date: string;
  event_type: string;
  hall_id: string;
  status: string;
  halls?: { name: string };
}

interface BookingInventoryItem {
  id: string;
  booking_id: string;
  inventory_id: string;
  quantity_allocated: number;
  quantity_returned: number;
  status: string;
  notes: string | null;
  checked_out_at: string | null;
  returned_at: string | null;
  inventory?: InventoryItem;
  bookings?: UpcomingBooking;
}

const InventoryManagement = () => {
  const { user, isHallManager } = useAuth();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [bookingInventory, setBookingInventory] = useState<BookingInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<UpcomingBooking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: 0,
    status: 'available' as InventoryItem['status'],
    description: '',
    hall_id: '',
  });
  const [allocateData, setAllocateData] = useState({
    inventory_id: '',
    quantity: 1,
  });

  const fetchInventory = useCallback(async (hallIds?: string[]) => {
    try {
      let query = supabase
        .from('inventory')
        .select('*, halls(name)')
        .order('item_name');

      if (hallIds?.length) {
        query = query.in('hall_id', hallIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, []);

  const fetchHalls = useCallback(async () => {
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
  }, []);

  const fetchUpcomingBookings = useCallback(async (hallIds?: string[]) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');
      
      let query = supabase
        .from('bookings')
        .select('id, reference_number, customer_name, event_date, event_type, hall_id, status, halls(name)')
        .in('status', ['confirmed', 'acknowledged'])
        .gte('event_date', today)
        .lte('event_date', nextWeek)
        .order('event_date', { ascending: true });

      if (hallIds?.length) {
        query = query.in('hall_id', hallIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUpcomingBookings(data || []);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
    }
  }, []);

  const fetchBookingInventory = useCallback(async (hallIds?: string[]) => {
    try {
      let query = supabase
        .from('booking_inventory')
        .select('*, inventory(*), bookings!inner(id, reference_number, customer_name, event_date, event_type, hall_id, status, halls(name))')
        .order('created_at', { ascending: false });

      if (hallIds?.length) {
        query = (query as any).in('bookings.hall_id', hallIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookingInventory(data || []);
    } catch (error) {
      console.error('Error fetching booking inventory:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isHallManager && user?.id) {
        const { data, error } = await supabase
          .from('hall_managers')
          .select('hall_id, halls(id, name)')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching manager halls:', error);
          setLoading(false);
          return;
        }

        const managerHalls = (data || [])
          .map((row: any) => ({
            id: String(row.hall_id || ''),
            name: String(row.halls?.name || 'Hall'),
          }))
          .filter((hall: Hall) => hall.id);
        const managerHallIds = managerHalls.map((hall) => hall.id);

        setHalls(managerHalls);

        if (managerHallIds.length === 0) {
          setInventory([]);
          setUpcomingBookings([]);
          setBookingInventory([]);
          setLoading(false);
          return;
        }

        await Promise.all([
          fetchInventory(managerHallIds),
          fetchUpcomingBookings(managerHallIds),
          fetchBookingInventory(managerHallIds),
        ]);
      } else {
        await Promise.all([fetchInventory(), fetchHalls(), fetchUpcomingBookings(), fetchBookingInventory()]);
      }
      setLoading(false);
    };
    loadData();
  }, [fetchInventory, fetchHalls, fetchUpcomingBookings, fetchBookingInventory, isHallManager, user?.id]);

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
      fetchInventory(isHallManager ? halls.map((hall) => hall.id) : undefined);
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
      fetchInventory(isHallManager ? halls.map((hall) => hall.id) : undefined);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleAllocateToBooking = async () => {
    if (!selectedBooking || !allocateData.inventory_id || allocateData.quantity < 1) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select an item and quantity' });
      return;
    }

    try {
      const { error } = await supabase
        .from('booking_inventory')
        .insert({
          booking_id: selectedBooking.id,
          inventory_id: allocateData.inventory_id,
          quantity_allocated: allocateData.quantity,
          status: 'allocated',
        });

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Item allocated to booking' });
      setIsAllocateDialogOpen(false);
      setAllocateData({ inventory_id: '', quantity: 1 });
      fetchBookingInventory();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleCheckOut = async (allocationId: string) => {
    try {
      const { error } = await supabase
        .from('booking_inventory')
        .update({
          status: 'checked_out',
          checked_out_at: new Date().toISOString(),
          checked_out_by: user?.id,
        })
        .eq('id', allocationId);

      if (error) throw error;
      toast({ title: 'Checked Out', description: 'Items marked as checked out for event' });
      fetchBookingInventory();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleReturn = async (allocationId: string, quantityReturned: number, damaged: boolean = false) => {
    try {
      const { error } = await supabase
        .from('booking_inventory')
        .update({
          status: damaged ? 'damaged' : 'returned',
          quantity_returned: quantityReturned,
          returned_at: new Date().toISOString(),
          returned_by: user?.id,
        })
        .eq('id', allocationId);

      if (error) throw error;
      toast({ title: 'Returned', description: damaged ? 'Items marked as damaged' : 'Items returned successfully' });
      fetchBookingInventory();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleRemoveAllocation = async (allocationId: string) => {
    if (!confirm('Remove this allocation?')) return;
    
    try {
      const { error } = await supabase
        .from('booking_inventory')
        .delete()
        .eq('id', allocationId);

      if (error) throw error;
      toast({ title: 'Removed', description: 'Allocation removed' });
      fetchBookingInventory();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
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

  const getAllocationStatusBadge = (status: string) => {
    switch (status) {
      case 'allocated':
        return <Badge variant="secondary">Allocated</Badge>;
      case 'checked_out':
        return <Badge variant="default" className="bg-blue-600">Checked Out</Badge>;
      case 'returned':
        return <Badge variant="default" className="bg-green-600">Returned</Badge>;
      case 'damaged':
        return <Badge variant="destructive">Damaged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEventDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return <Badge variant="destructive">Today</Badge>;
    if (isTomorrow(date)) return <Badge variant="secondary">Tomorrow</Badge>;
    return <span className="text-muted-foreground">{format(date, 'EEE, MMM d')}</span>;
  };

  // Filter inventory
  const categories = [...new Set(inventory.map(i => i.category).filter(Boolean))];
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = !searchQuery || 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get allocations for selected booking
  const getBookingAllocations = (bookingId: string) => 
    bookingInventory.filter(bi => bi.booking_id === bookingId);

  // Today's events needing checklist
  const todaysEvents = upcomingBookings.filter(b => isToday(new Date(b.event_date)));
  
  // Items needing return (past events with checked_out status)
  const pendingReturns = bookingInventory.filter(bi => 
    bi.status === 'checked_out' && 
    bi.bookings && 
    isBefore(new Date(bi.bookings.event_date), new Date())
  );

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
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="inventory" className="gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Items</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
            {upcomingBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1">{upcomingBookings.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="checklist" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Checklist</span>
            {todaysEvents.length > 0 && (
              <Badge variant="destructive" className="ml-1">{todaysEvents.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="returns" className="gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="hidden sm:inline">Returns</span>
            {pendingReturns.length > 0 && (
              <Badge variant="destructive" className="ml-1">{pendingReturns.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Inventory Items Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                    <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
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
              <CardTitle className="font-serif flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventory Items
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredInventory.length} items
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item_name}</TableCell>
                        <TableCell>{item.halls?.name || 'N/A'}</TableCell>
                        <TableCell>{item.category || '-'}</TableCell>
                        <TableCell>
                          <span className={item.quantity < 10 ? 'text-destructive font-bold' : ''}>
                            {item.quantity}
                            {item.quantity < 10 && <AlertTriangle className="inline w-4 h-4 ml-1" />}
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
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={isHallManager ? 6 : 5} className="text-center py-8 text-muted-foreground">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events Tab - Allocate inventory */}
        <TabsContent value="events" className="space-y-4">
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events (Next 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No upcoming events in the next 7 days</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const allocations = getBookingAllocations(booking.id);
                    return (
                      <Card key={booking.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getEventDateLabel(booking.event_date)}
                                <span className="font-semibold">{booking.customer_name}</span>
                                <Badge variant="outline">{booking.event_type}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {booking.halls?.name} • {booking.reference_number}
                              </p>
                            </div>
                            {isHallManager && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsAllocateDialogOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Allocate Items
                              </Button>
                            )}
                          </div>
                          
                          {allocations.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium mb-2">Allocated Items:</p>
                              <div className="space-y-2">
                                {allocations.map((alloc) => (
                                  <div key={alloc.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                                    <div className="flex items-center gap-2">
                                      <span>{alloc.inventory?.item_name}</span>
                                      <Badge variant="secondary">×{alloc.quantity_allocated}</Badge>
                                      {getAllocationStatusBadge(alloc.status)}
                                    </div>
                                    {isHallManager && alloc.status === 'allocated' && (
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="outline" onClick={() => handleCheckOut(alloc.id)}>
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Check Out
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveAllocation(alloc.id)}>
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allocate Dialog */}
          <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Allocate Items to {selectedBooking?.customer_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Item</Label>
                  <Select value={allocateData.inventory_id} onValueChange={(v) => setAllocateData({ ...allocateData, inventory_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose inventory item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory
                        .filter(i =>
                          i.status === 'available' &&
                          i.quantity > 0 &&
                          (!selectedBooking || i.hall_id === selectedBooking.hall_id)
                        )
                        .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.item_name} ({item.quantity} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={allocateData.quantity}
                    onChange={(e) => setAllocateData({ ...allocateData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAllocateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAllocateToBooking}>Allocate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Pre-Event Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4">
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Today's Event Checklists
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No events scheduled for today</p>
              ) : (
                <div className="space-y-4">
                  {todaysEvents.map((booking) => {
                    const allocations = getBookingAllocations(booking.id);
                    const allCheckedOut = allocations.length > 0 && allocations.every(a => a.status !== 'allocated');
                    
                    return (
                      <Card key={booking.id} className={allCheckedOut ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{booking.customer_name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.event_type} • {booking.halls?.name}</p>
                            </div>
                            {allCheckedOut ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Ready
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          
                          {allocations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No items allocated to this event</p>
                          ) : (
                            <div className="space-y-2">
                              {allocations.map((alloc) => (
                                <div key={alloc.id} className="flex items-center justify-between p-2 bg-background rounded">
                                  <div className="flex items-center gap-2">
                                    {alloc.status === 'allocated' ? (
                                      <div className="w-5 h-5 border-2 rounded" />
                                    ) : (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                    <span>{alloc.inventory?.item_name}</span>
                                    <Badge variant="secondary">×{alloc.quantity_allocated}</Badge>
                                  </div>
                                  {isHallManager && alloc.status === 'allocated' && (
                                    <Button size="sm" onClick={() => handleCheckOut(alloc.id)}>
                                      Mark Ready
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Post-Event Returns Tab */}
        <TabsContent value="returns" className="space-y-4">
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                Pending Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingReturns.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No pending returns</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty Allocated</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReturns.map((alloc) => (
                      <TableRow key={alloc.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{alloc.bookings?.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{alloc.bookings?.reference_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>{alloc.inventory?.item_name}</TableCell>
                        <TableCell>{alloc.quantity_allocated}</TableCell>
                        <TableCell>{alloc.bookings?.event_date && format(new Date(alloc.bookings.event_date), 'PPP')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReturn(alloc.id, alloc.quantity_allocated, false)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Return All
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReturn(alloc.id, alloc.quantity_allocated, true)}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Damaged
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default InventoryManagement;
