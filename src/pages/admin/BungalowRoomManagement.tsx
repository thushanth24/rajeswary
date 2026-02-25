import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BungalowRoom } from '@/hooks/useBungalowRooms';
import { Plus, Pencil, Trash2, Home, Eye, EyeOff, Upload, Loader2 } from 'lucide-react';

const SUPABASE_URL = "https://kkefwggimxljvelqtcjs.supabase.co";

const defaultRoom: Partial<BungalowRoom> = {
  name: '',
  location: '',
  room_type: 'Double Room',
  ac_type: 'AC',
  max_adults: 2,
  max_children: 1,
  tariff_room_only: 0,
  tariff_bb: 0,
  tariff_full_board: 0,
  amenities: [],
  description: '',
  rules: ['Valid ID proof mandatory', 'No smoking inside premises', 'No pets allowed', 'Quiet hours: 10 PM - 6 AM'],
  check_in_time: '12:00 PM',
  check_out_time: '11:00 AM',
  images: [],
  available: true,
  display_order: 0,
};

const commonAmenities = [
  'Air Conditioner', 'Fan', 'Attached Bathroom', 'Hot Water', 'TV', 'Wi-Fi',
  'Kitchen Facility', 'Refrigerator', 'Parking', 'Housekeeping', 'Power Backup',
  'Security', 'Living Room', 'Dining Area', 'Balcony',
];

const BungalowRoomManagement = () => {
  const [rooms, setRooms] = useState<BungalowRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<BungalowRoom | null>(null);
  const [formData, setFormData] = useState(defaultRoom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('bungalow_rooms')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch rooms.', variant: 'destructive' });
    } else {
      setRooms((data || []) as BungalowRoom[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreateForm = () => {
    setEditingRoom(null);
    setFormData({ ...defaultRoom, display_order: rooms.length + 1 });
    setShowForm(true);
  };

  const openEditForm = (room: BungalowRoom) => {
    setEditingRoom(room);
    setFormData({ ...room });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.room_type) {
      toast({ title: 'Error', description: 'Name and room type are required.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      location: formData.location || '',
      room_type: formData.room_type,
      ac_type: formData.ac_type,
      max_adults: formData.max_adults,
      max_children: formData.max_children,
      tariff_room_only: formData.tariff_room_only,
      tariff_bb: formData.tariff_bb,
      tariff_full_board: formData.tariff_full_board,
      amenities: formData.amenities,
      description: formData.description,
      rules: formData.rules,
      check_in_time: formData.check_in_time,
      check_out_time: formData.check_out_time,
      images: formData.images,
      available: formData.available,
      display_order: formData.display_order,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingRoom) {
      ({ error } = await (supabase as any).from('bungalow_rooms').update(payload).eq('id', editingRoom.id));
    } else {
      ({ error } = await (supabase as any).from('bungalow_rooms').insert(payload));
    }

    setIsSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingRoom ? 'Room Updated!' : 'Room Created!', description: `${formData.name} saved successfully.` });
      setShowForm(false);
      fetchRooms();
    }
  };

  const deleteRoom = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await (supabase as any).from('bungalow_rooms').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete room.', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: `${name} has been removed.` });
      fetchRooms();
    }
  };

  const toggleAvailability = async (room: BungalowRoom) => {
    const { error } = await (supabase as any)
      .from('bungalow_rooms')
      .update({ available: !room.available, updated_at: new Date().toISOString() })
      .eq('id', room.id);
    if (!error) {
      toast({ title: room.available ? 'Room Hidden' : 'Room Visible', description: `${room.name} availability updated.` });
      fetchRooms();
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      setFormData(p => ({ ...p, amenities: [...(p.amenities || []), newAmenity.trim()] }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(p => ({ ...p, amenities: (p.amenities || []).filter(a => a !== amenity) }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(p => ({ ...p, rules: [...(p.rules || []), newRule.trim()] }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(p => ({ ...p, rules: (p.rules || []).filter((_, i) => i !== index) }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData(p => ({ ...p, images: [...(p.images || []), newImageUrl.trim()] }));
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `rooms/${fileName}`;

      const { error } = await supabase.storage
        .from('bungalow-images')
        .upload(filePath, file);

      if (error) {
        toast({ title: 'Upload Failed', description: `Failed to upload ${file.name}: ${error.message}`, variant: 'destructive' });
      } else {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/bungalow-images/${filePath}`;
        uploadedUrls.push(publicUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(p => ({ ...p, images: [...(p.images || []), ...uploadedUrls] }));
      toast({ title: 'Uploaded!', description: `${uploadedUrls.length} image(s) uploaded successfully.` });
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(p => ({ ...p, images: (p.images || []).filter((_, i) => i !== index) }));
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Room Management
            </h1>
            <p className="text-muted-foreground text-sm">Manage bungalow rooms, pricing, and availability. Changes reflect on the public website.</p>
          </div>
          <Button onClick={openCreateForm} className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add Room
          </Button>
        </div>

        {/* Rooms Table */}
        <Card className="card-traditional">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>AC</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Room Only</TableHead>
                  <TableHead>BB</TableHead>
                  <TableHead>Full Board</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : rooms.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No rooms configured yet. Add your first room.</TableCell></TableRow>
                ) : (
                  rooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{room.name}</p>
                          <p className="text-xs text-muted-foreground">{room.location}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{room.room_type}</Badge></TableCell>
                      <TableCell><Badge variant={room.ac_type === 'AC' ? 'default' : 'secondary'}>{room.ac_type}</Badge></TableCell>
                      <TableCell className="text-sm">{room.max_adults}A / {room.max_children}C</TableCell>
                      <TableCell className="text-sm font-medium">Rs {room.tariff_room_only.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-medium">Rs {room.tariff_bb.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-medium">Rs {room.tariff_full_board.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={room.available ? 'default' : 'destructive'}>
                          {room.available ? 'Available' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleAvailability(room)} title={room.available ? 'Hide' : 'Show'}>
                            {room.available ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(room)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteRoom(room.id, room.name)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingRoom ? `Edit: ${editingRoom.name}` : 'Add New Room'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Room Name *</Label>
                    <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Double Room A/C" required />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="e.g., East Wing" />
                  </div>
                  <div>
                    <Label>Room Type *</Label>
                    <Select value={formData.room_type} onValueChange={v => setFormData(p => ({ ...p, room_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Double Room">Double Room</SelectItem>
                        <SelectItem value="Triple Room">Triple Room</SelectItem>
                        <SelectItem value="Family Room">Family Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>AC Type *</Label>
                    <Select value={formData.ac_type} onValueChange={v => setFormData(p => ({ ...p, ac_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="Non-AC">Non-AC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Room description shown on the website..." />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Capacity & Timing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Max Adults</Label>
                    <Input type="number" min={1} value={formData.max_adults} onChange={e => setFormData(p => ({ ...p, max_adults: parseInt(e.target.value) || 1 }))} />
                  </div>
                  <div>
                    <Label>Max Children</Label>
                    <Input type="number" min={0} value={formData.max_children} onChange={e => setFormData(p => ({ ...p, max_children: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <Label>Check-in Time</Label>
                    <Input value={formData.check_in_time} onChange={e => setFormData(p => ({ ...p, check_in_time: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Check-out Time</Label>
                    <Input value={formData.check_out_time} onChange={e => setFormData(p => ({ ...p, check_out_time: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Pricing (per night in Rs)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Room Only</Label>
                    <Input type="number" min={0} value={formData.tariff_room_only} onChange={e => setFormData(p => ({ ...p, tariff_room_only: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <Label>Bed & Breakfast</Label>
                    <Input type="number" min={0} value={formData.tariff_bb} onChange={e => setFormData(p => ({ ...p, tariff_bb: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <Label>Full Board</Label>
                    <Input type="number" min={0} value={formData.tariff_full_board} onChange={e => setFormData(p => ({ ...p, tariff_full_board: parseFloat(e.target.value) || 0 }))} />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map(a => (
                    <Button
                      key={a} type="button" size="sm"
                      variant={formData.amenities?.includes(a) ? 'default' : 'outline'}
                      onClick={() => formData.amenities?.includes(a) ? removeAmenity(a) : setFormData(p => ({ ...p, amenities: [...(p.amenities || []), a] }))}
                      className="text-xs"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="Custom amenity" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())} />
                  <Button type="button" variant="outline" onClick={addAmenity}>Add</Button>
                </div>
                {formData.amenities && formData.amenities.filter(a => !commonAmenities.includes(a)).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.amenities.filter(a => !commonAmenities.includes(a)).map(a => (
                      <Badge key={a} variant="secondary" className="cursor-pointer" onClick={() => removeAmenity(a)}>
                        {a} ✕
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Rules */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Rules & Policies</h3>
                <ul className="space-y-1">
                  {formData.rules?.map((rule, i) => (
                    <li key={i} className="flex items-center justify-between text-sm bg-muted/50 px-3 py-1.5 rounded">
                      <span>{rule}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRule(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="Add a rule" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRule())} />
                  <Button type="button" variant="outline" onClick={addRule}>Add</Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images?.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-full h-20 object-cover rounded border border-border" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100" onClick={() => removeImage(i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex-1">
                    {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Upload Images</>}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Or paste image URL..." />
                  <Button type="button" variant="outline" onClick={addImageUrl}>Add</Button>
                </div>
              </div>

              {/* Availability & Order */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Switch checked={formData.available ?? true} onCheckedChange={v => setFormData(p => ({ ...p, available: v }))} />
                  <Label>Available on website</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Display Order</Label>
                  <Input type="number" className="w-20" value={formData.display_order} onChange={e => setFormData(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                  {isSubmitting ? 'Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BungalowRoomManagement;
