import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { type Reminder } from '@shared/schema';
import { toast } from '@/hooks/use-toast';
import AddReminderForm from '@/components/AddReminderForm';

export default function RemindersTab() {
  const [showNewReminderForm, setShowNewReminderForm] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [quietHours, setQuietHours] = useState({ from: '22:00', to: '07:00' });

  // Fetch reminders
  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ['/api/reminders'],
  });
  
  // Update reminder enabled state
  const updateReminder = useMutation({
    mutationFn: ({ id, enabled }: { id: number, enabled: boolean }) => {
      return apiRequest('PATCH', `/api/reminders/${id}`, { enabled })
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update reminder: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Create a new reminder
  const createReminder = useMutation({
    mutationFn: (reminder: Omit<Reminder, 'id'>) => {
      return apiRequest('POST', '/api/reminders', reminder)
        .then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      setShowNewReminderForm(false);
      toast({
        title: 'Reminder created',
        description: 'Your reminder has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create reminder: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  // Handle reminder toggle
  const handleToggleReminder = (id: number, currentEnabled: boolean) => {
    updateReminder.mutate({ id, enabled: !currentEnabled });
  };

  // Handle new reminder submission
  const handleAddReminder = (reminderData: Omit<Reminder, 'id' | 'userId'>) => {
    createReminder.mutate({
      ...reminderData,
      userId: 1, // This would come from the authenticated user in a real app
    });
  };

  const formatReminderTiming = (timing: any) => {
    if (!timing) return '';
    const { days, when } = timing;
    
    if (days === 0) return 'On the day';
    return `${days} day${days !== 1 ? 's' : ''} ${when}`;
  };

  return (
    <div className="space-y-6">
      {/* Active Reminders */}
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Active Reminders</h2>
          <Button 
            variant="ghost" 
            className="text-primary text-sm font-medium flex items-center gap-1"
            onClick={() => setShowNewReminderForm(true)}
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-3 rounded-md bg-neutral-100 animate-pulse">
                <div className="h-5 w-32 bg-slate-200 rounded mb-1"></div>
                <div className="h-3 w-48 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : reminders && reminders.length > 0 ? (
            reminders.map((reminder) => (
              <div key={reminder.id} className="p-3 rounded-md bg-neutral-100 flex justify-between items-center">
                <div>
                  <div className="font-medium">{reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}</div>
                  <div className="text-xs text-slate-500">
                    {formatReminderTiming(reminder.timing)} at {reminder.time}
                    {reminder.message && ` - ${reminder.message}`}
                  </div>
                </div>
                <Switch 
                  checked={reminder.enabled} 
                  onCheckedChange={() => handleToggleReminder(reminder.id, reminder.enabled)}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 text-sm py-8">
              No reminders set up yet. Add your first reminder.
            </div>
          )}
        </div>
      </Card>
      
      {/* Notification Settings */}
      <Card className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="push-notifications" className="text-sm">Push notifications</Label>
            <Switch 
              id="push-notifications" 
              checked={pushEnabled} 
              onCheckedChange={setPushEnabled} 
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Label htmlFor="email-notifications" className="text-sm">Email notifications</Label>
            <Switch 
              id="email-notifications" 
              checked={emailEnabled} 
              onCheckedChange={setEmailEnabled} 
            />
          </div>
          
          <div>
            <span className="text-sm block mb-2">Quiet hours</span>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="quiet-from" className="text-xs text-slate-500 block mb-1">From</Label>
                <select 
                  id="quiet-from"
                  className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100"
                  value={quietHours.from}
                  onChange={(e) => setQuietHours({ ...quietHours, from: e.target.value })}
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                    );
                  })}
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="quiet-to" className="text-xs text-slate-500 block mb-1">To</Label>
                <select 
                  id="quiet-to"
                  className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100"
                  value={quietHours.to}
                  onChange={(e) => setQuietHours({ ...quietHours, to: e.target.value })}
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* New Reminder Form */}
      {showNewReminderForm && (
        <AddReminderForm
          onCancel={() => setShowNewReminderForm(false)}
          onSubmit={handleAddReminder}
          isSubmitting={createReminder.isPending}
        />
      )}
    </div>
  );
}
