import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Building2 } from 'lucide-react';

interface Hall {
  id: string;
  name: string;
  slug: string;
  capacity_min: number;
  capacity_max: number;
  price_range: string | null;
  is_active: boolean;
  created_at: string;
}

const HallsManagement = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const { data, error } = await supabase
          .from('halls')
          .select('*')
          .order('name');

        if (error) throw error;
        setHalls(data || []);
      } catch (error) {
        console.error('Error fetching halls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="All Halls">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="All Halls">
      <Card className="card-traditional">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Wedding Halls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {halls.map((hall) => (
                <TableRow key={hall.id}>
                  <TableCell className="font-medium">{hall.name}</TableCell>
                  <TableCell>{hall.capacity_min} - {hall.capacity_max} guests</TableCell>
                  <TableCell>{hall.price_range || 'Not set'}</TableCell>
                  <TableCell>
                    <Badge variant={hall.is_active ? 'default' : 'secondary'}>
                      {hall.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default HallsManagement;
