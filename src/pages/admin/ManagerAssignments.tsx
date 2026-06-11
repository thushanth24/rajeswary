import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Building2, Trash2 } from 'lucide-react';

interface HallManager {
  id: string;
  hall_id: string;
  user_id: string;
  assigned_at: string;
  is_active: boolean;
  halls?: { name: string };
  profiles?: { full_name: string; email: string };
}

interface Hall {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
}

const ManagerAssignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<HallManager[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [availableManagers, setAvailableManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedManager, setSelectedManager] = useState('');

  const fetchData = async () => {
    try {
      // Fetch hall manager assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('hall_managers')
        .select('*, halls(name)')
        .eq('is_active', true);

      if (assignmentsError) throw assignmentsError;

      // Fetch halls
      const { data: hallsData, error: hallsError } = await supabase
        .from('halls')
        .select('id, name')
        .eq('is_active', true);

      if (hallsError) throw hallsError;

      // Fetch profiles with hall_manager role - join user_roles with profiles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'hall_manager');
      
      if (rolesError) {
        console.error('Error fetching hall_manager roles:', rolesError);
        throw rolesError;
      }

      const managerUserIds = rolesData?.map(r => r.user_id) || [];

      // Fetch all profiles for managers (for both dropdown and assignments table)
      let profilesMap: Record<string, Profile> = {};
      if (managerUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', managerUserIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        setAvailableManagers(profilesData || []);
        
        // Create a map for quick lookup
        (profilesData || []).forEach(p => {
          profilesMap[p.id] = p;
        });
      } else {
        setAvailableManagers([]);
      }

      // Merge profile data into assignments
      const assignmentsWithProfiles = (assignmentsData || []).map(assignment => ({
        ...assignment,
        profiles: profilesMap[assignment.user_id] || null,
      }));

      setAssignments(assignmentsWithProfiles as HallManager[]);
      setHalls(hallsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedHall || !selectedManager) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select both a hall and a manager',
      });
      return;
    }

    try {
      const existingHallAssignment = assignments.find(
        a => a.hall_id === selectedHall && a.is_active
      );
      
      if (existingHallAssignment?.user_id === selectedManager) {
        toast({
          variant: 'destructive',
          title: 'Already Assigned',
          description: 'This manager is already assigned to this hall',
        });
        return;
      }

      const assignmentPayload = {
        hall_id: selectedHall,
        user_id: selectedManager,
        assigned_by: user?.id,
        assigned_at: new Date().toISOString(),
        is_active: true,
      };

      const { error } = existingHallAssignment
        ? await supabase
            .from('hall_managers')
            .update(assignmentPayload)
            .eq('id', existingHallAssignment.id)
        : await supabase
            .from('hall_managers')
            .insert(assignmentPayload);

      if (error) throw error;

      toast({
        title: 'Success',
        description: existingHallAssignment
          ? 'Hall manager updated successfully'
          : 'Manager assigned successfully',
      });

      setSelectedHall('');
      setSelectedManager('');
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const handleRemove = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;

    try {
      const { error } = await supabase
        .from('hall_managers')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: 'Removed',
        description: 'Assignment removed successfully',
      });
      fetchData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Manager Assignments">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manager Assignments">
      <div className="space-y-6">
        {/* Assignment Form */}
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Assign Manager to Hall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select Hall</label>
                <Select value={selectedHall} onValueChange={setSelectedHall}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a hall" />
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
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select Manager</label>
                <Select value={selectedManager} onValueChange={setSelectedManager}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.full_name || manager.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssign}>Assign</Button>
            </div>
            {availableManagers.length === 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                No users with hall_manager role found. First assign the hall_manager role to users in User Management.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card className="card-traditional">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Current Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hall</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.halls?.name}</TableCell>
                    <TableCell>{(assignment.profiles as any)?.full_name || 'N/A'}</TableCell>
                    <TableCell>{(assignment.profiles as any)?.email}</TableCell>
                    <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={assignment.is_active ? 'default' : 'secondary'}>
                        {assignment.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(assignment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No manager assignments yet
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

export default ManagerAssignments;
