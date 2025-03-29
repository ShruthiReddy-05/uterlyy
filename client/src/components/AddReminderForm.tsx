import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  type: z.enum(['period', 'fertile', 'ovulation', 'medication', 'custom']),
  timing: z.object({
    days: z.number(),
    when: z.enum(['before', 'after', 'on']),
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  message: z.string().optional(),
  enabled: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddReminderFormProps {
  onCancel: () => void;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}

export default function AddReminderForm({ onCancel, onSubmit, isSubmitting }: AddReminderFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'period',
      timing: {
        days: 2,
        when: 'before',
      },
      time: '08:00',
      message: '',
      enabled: true,
    }
  });
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">New Reminder</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm block mb-1">Reminder Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="period">Period start</SelectItem>
                    <SelectItem value="fertile">Fertile window</SelectItem>
                    <SelectItem value="ovulation">Ovulation day</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timing.when"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm block mb-1">When</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="before">Before</SelectItem>
                    <SelectItem value="on">On the day</SelectItem>
                    <SelectItem value="after">After</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {form.watch('timing.when') !== 'on' && (
            <FormField
              control={form.control}
              name="timing.days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm block mb-1">Days {form.watch('timing.when')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100"
                      min={1}
                      max={30}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm block mb-1">Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm block mb-1">Custom Message (optional)</FormLabel>
                <FormControl>
                  <Input
                    className="w-full p-2 rounded-md border border-slate-200 bg-neutral-100"
                    placeholder="Enter custom message"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-3 bg-neutral-100 text-slate-800 rounded-md"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 bg-primary text-white rounded-md font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Reminder'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
