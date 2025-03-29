import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { PeriodLog } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Extend the schema with client-side specific validation
const formSchema = z.object({
  flow: z.enum(['light', 'medium', 'heavy', 'none']).optional(),
  symptoms: z.array(z.string()).default([]),
  mood: z.string().optional(),
  notes: z.string().default('')
});

type FormValues = z.infer<typeof formSchema>;

interface TodayLogProps {
  date: Date;
  existingLog?: PeriodLog;
  onSave: (data: Omit<PeriodLog, 'id' | 'userId'>) => void;
  isSubmitting: boolean;
}

export default function TodayLog({ date, existingLog, onSave, isSubmitting }: TodayLogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flow: existingLog?.flow as 'light' | 'medium' | 'heavy' | 'none' | undefined,
      symptoms: existingLog?.symptoms || [],
      mood: existingLog?.mood || undefined,
      notes: existingLog?.notes || ''
    }
  });
  
  const onSubmit = (data: FormValues) => {
    onSave({
      date: date.toISOString(),
      ...data
    });
  };
  
  const symptoms = [
    'Cramps',
    'Headache',
    'Bloating',
    'Fatigue',
    'Mood swings',
    'Breast tenderness'
  ];
  
  const moods = [
    { label: 'Happy', icon: '😊' },
    { label: 'Normal', icon: '😐' },
    { label: 'Sad', icon: '😢' },
    { label: 'Stressed', icon: '😫' },
    { label: 'Energetic', icon: '💪' }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {isSameDay(date, new Date()) ? "Today's Log" : `Log for ${format(date, 'MMMM d, yyyy')}`}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Flow intensity */}
          <FormField
            control={form.control}
            name="flow"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-2">Flow intensity</FormLabel>
                <div className="flex space-x-2">
                  {['light', 'medium', 'heavy', 'none'].map((flowType) => (
                    <Button
                      key={flowType}
                      type="button"
                      variant="ghost"
                      className={cn(
                        "flex-1 py-2 rounded-md text-sm capitalize",
                        field.value === flowType
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-neutral-100 text-slate-500"
                      )}
                      onClick={() => field.onChange(flowType)}
                    >
                      {flowType}
                    </Button>
                  ))}
                </div>
              </FormItem>
            )}
          />
          
          {/* Symptoms */}
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-2">Symptoms</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {symptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      type="button"
                      variant="ghost"
                      className={cn(
                        "p-2 rounded-md text-xs text-center",
                        field.value?.includes(symptom)
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-neutral-100 text-slate-500"
                      )}
                      onClick={() => {
                        const newValue = field.value?.includes(symptom)
                          ? field.value.filter(s => s !== symptom)
                          : [...(field.value || []), symptom];
                        field.onChange(newValue);
                      }}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </FormItem>
            )}
          />
          
          {/* Mood */}
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-2">Mood</FormLabel>
                <div className="flex justify-between">
                  {moods.map(({ label, icon }) => (
                    <Button
                      key={label}
                      type="button"
                      variant="ghost"
                      className="text-center flex flex-col items-center p-1"
                      onClick={() => field.onChange(field.value === label ? undefined : label)}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mx-auto",
                        field.value === label
                          ? "bg-primary/10"
                          : "bg-neutral-100"
                      )}>
                        <span className={cn(
                          "text-lg",
                          field.value === label
                            ? "text-primary"
                            : "text-slate-500"
                        )}>
                          {icon}
                        </span>
                      </div>
                      <span className={cn(
                        "text-xs block mt-1",
                        field.value === label && "font-medium"
                      )}>
                        {label}
                      </span>
                    </Button>
                  ))}
                </div>
              </FormItem>
            )}
          />
          
          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium mb-2">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full p-3 rounded-md border border-slate-200 focus:outline-none focus:border-primary/50"
                    rows={2}
                    placeholder="Add any additional notes here..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full py-3 bg-primary text-white rounded-md font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Log'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}
