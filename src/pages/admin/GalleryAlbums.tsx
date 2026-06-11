import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Camera, ImagePlus, Loader2, Plus, Trash2, Upload } from 'lucide-react';

const SUPABASE_URL = 'https://kkefwggimxljvelqtcjs.supabase.co';
const BUCKET = 'hall-gallery-images';

interface Hall {
  id: string;
  name: string;
}

interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  is_active: boolean;
}

interface GalleryAlbum {
  id: string;
  hall_id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  is_active: boolean;
  halls?: { name: string } | null;
  hall_gallery_photos?: GalleryPhoto[];
}

const emptyForm = {
  hall_id: '',
  title: '',
  description: '',
  event_date: '',
  caption: '',
};

const getSafeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const GalleryAlbums = () => {
  const { user, isAdmin, isHallManager } = useAuth();
  const { toast } = useToast();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAlbumId, setUploadingAlbumId] = useState<string | null>(null);

  const fetchHalls = useCallback(async () => {
    if (isHallManager && !isAdmin && user?.id) {
      const { data, error } = await supabase
        .from('hall_managers')
        .select('hall_id, halls(name)')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      const managerHalls = (data || [])
        .map((row: any) => ({
          id: String(row.hall_id || ''),
          name: String(row.halls?.name || 'Hall'),
        }))
        .filter((hall: Hall) => hall.id);

      setHalls(managerHalls);
      if (managerHalls.length === 1) {
        setForm((prev) => ({ ...prev, hall_id: managerHalls[0].id }));
      }
      return managerHalls;
    }

    const { data, error } = await supabase
      .from('halls')
      .select('id, name')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    setHalls(data || []);
    return data || [];
  }, [isAdmin, isHallManager, user?.id]);

  const fetchAlbums = useCallback(async (visibleHallIds: string[] = []) => {
    if (isHallManager && !isAdmin && visibleHallIds.length === 0) {
      setAlbums([]);
      return;
    }

    let query = (supabase as any)
      .from('hall_gallery_albums')
      .select('*, halls(name), hall_gallery_photos(*)')
      .order('created_at', { ascending: false });

    if (isHallManager && !isAdmin) {
      query = query.in('hall_id', visibleHallIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    setAlbums((data || []).map((album: GalleryAlbum) => ({
      ...album,
      hall_gallery_photos: (album.hall_gallery_photos || [])
        .filter((photo) => photo.is_active)
        .sort((a, b) => a.id.localeCompare(b.id)),
    })));
  }, [isAdmin, isHallManager]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const loadedHalls = await fetchHalls();
        await fetchAlbums(loadedHalls.map((hall) => hall.id));
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load gallery albums',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAlbums, fetchHalls, toast]);

  const uploadFiles = async (albumId: string, hallId: string, selectedFiles: File[], caption?: string) => {
    const uploadedRows = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Skipped File',
          description: `${file.name} is not an image`,
        });
        continue;
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${getSafeFileName(file.name)}`;
      const filePath = `${hallId}/${albumId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      uploadedRows.push({
        album_id: albumId,
        image_url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`,
        caption: caption?.trim() || null,
        uploaded_by: user?.id,
      });
    }

    if (uploadedRows.length > 0) {
      const { error } = await (supabase as any)
        .from('hall_gallery_photos')
        .insert(uploadedRows);

      if (error) throw error;
    }

    return uploadedRows.length;
  };

  const handleCreateAlbum = async () => {
    if (!form.hall_id || !form.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Details',
        description: 'Select a hall and enter an event name',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await (supabase as any)
        .from('hall_gallery_albums')
        .insert({
          hall_id: form.hall_id,
          title: form.title.trim(),
          description: form.description.trim() || null,
          event_date: form.event_date || null,
          created_by: user?.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      const uploadedCount = files.length
        ? await uploadFiles(data.id, form.hall_id, files, form.caption)
        : 0;

      toast({
        title: 'Album Created',
        description: uploadedCount
          ? `Created album and uploaded ${uploadedCount} image(s)`
          : 'Created album successfully',
      });

      setForm(halls.length === 1 ? { ...emptyForm, hall_id: halls[0].id } : emptyForm);
      setFiles([]);
      await fetchAlbums(halls.map((hall) => hall.id));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create album',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadToAlbum = async (album: GalleryAlbum, selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploadingAlbumId(album.id);
    try {
      const uploadedCount = await uploadFiles(album.id, album.hall_id, Array.from(selectedFiles));
      toast({
        title: 'Images Uploaded',
        description: `Uploaded ${uploadedCount} image(s) to ${album.title}`,
      });
      await fetchAlbums(halls.map((hall) => hall.id));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload images',
      });
    } finally {
      setUploadingAlbumId(null);
    }
  };

  const handleDeactivateAlbum = async (albumId: string) => {
    if (!confirm('Hide this album from the public gallery?')) return;

    const { error } = await (supabase as any)
      .from('hall_gallery_albums')
      .update({ is_active: false })
      .eq('id', albumId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      return;
    }

    toast({ title: 'Album Hidden', description: 'Album removed from public gallery' });
    fetchAlbums(halls.map((hall) => hall.id));
  };

  const handleDeactivatePhoto = async (photoId: string) => {
    const { error } = await (supabase as any)
      .from('hall_gallery_photos')
      .update({ is_active: false })
      .eq('id', photoId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      return;
    }

    toast({ title: 'Photo Hidden', description: 'Photo removed from public gallery' });
    fetchAlbums(halls.map((hall) => hall.id));
  };

  if (loading) {
    return (
      <AdminLayout title="Gallery Albums">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gallery Albums">
      <div className="space-y-6">
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <ImagePlus className="h-5 w-5" />
              Create Event Album
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {halls.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No halls are assigned to you. Contact a super admin before uploading gallery images.
              </p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Hall *</Label>
                    <Select
                      value={form.hall_id}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, hall_id: value }))}
                      disabled={halls.length === 1}
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
                    <Label>Event Date</Label>
                    <Input
                      type="date"
                      value={form.event_date}
                      onChange={(event) => setForm((prev) => ({ ...prev, event_date: event.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Event / Album Name *</Label>
                    <Input
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="E.g. Kumar & Meena Wedding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Caption</Label>
                    <Input
                      value={form.caption}
                      onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
                      placeholder="Optional caption for uploaded images"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Short note about this event"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => setFiles(Array.from(event.target.files || []))}
                  />
                  {files.length > 0 && (
                    <p className="text-xs text-muted-foreground">{files.length} image(s) selected</p>
                  )}
                </div>
                <Button onClick={handleCreateAlbum} disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Album
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {albums.map((album) => (
            <Card key={album.id} className="card-traditional">
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      {album.title}
                    </CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{album.halls?.name || 'Hall'}</Badge>
                      {album.event_date && <Badge variant="outline">{album.event_date}</Badge>}
                      <Badge variant="outline">{album.hall_gallery_photos?.length || 0} photos</Badge>
                    </div>
                    {album.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{album.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Label className="inline-flex cursor-pointer items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      {uploadingAlbumId === album.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Add Images
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploadingAlbumId === album.id}
                        onChange={(event) => handleUploadToAlbum(album, event.target.files)}
                      />
                    </Label>
                    <Button variant="outline" size="sm" onClick={() => handleDeactivateAlbum(album.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {album.hall_gallery_photos && album.hall_gallery_photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                    {album.hall_gallery_photos.map((photo) => (
                      <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border">
                        <img src={photo.image_url} alt={photo.caption || album.title} className="h-full w-full object-cover" />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleDeactivatePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          ))}

          {albums.length === 0 && (
            <Card className="card-traditional">
              <CardContent className="py-8 text-center text-muted-foreground">
                No gallery albums yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryAlbums;
