import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { PcosDetectionData } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Check, Loader2, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function PCOSDetectionTab() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch existing PCOS detection results
  const { data: pcosDetections = [], isLoading } = useQuery<PcosDetectionData[]>({
    queryKey: ['/api/pcos-detections'],
    staleTime: 10000,
  });

  // Upload and analyze image mutation
  const { mutate: uploadImage, isPending, isError, error } = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('/api/pcos-detections', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pcos-detections'] });
      resetForm();
    },
  });

  // Delete detection result mutation
  const { mutate: deleteDetection } = useMutation({
    mutationFn: async (id: number | undefined) => {
      if (!id) throw new Error('Detection ID is required');
      return apiRequest(`/api/pcos-detections/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pcos-detections'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please select a valid image file (JPEG or PNG)');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Please select an image under 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    if (notes) {
      formData.append('notes', notes);
    }
    
    uploadImage(formData);
  }, [selectedFile, notes, uploadImage]);

  const resetForm = () => {
    setSelectedFile(null);
    setNotes('');
    setPreviewUrl(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">PCOS Detection</h1>
      
      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Ultrasound Image</CardTitle>
          <CardDescription>
            Upload an ultrasound image to analyze for Polycystic Ovary Syndrome (PCOS) indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image">Ultrasound Image</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange} 
                disabled={isPending}
              />
              <p className="text-sm text-muted-foreground">
                JPG or PNG, 5MB max
              </p>
            </div>
            
            {previewUrl && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="relative mt-1 rounded-md overflow-hidden w-full max-w-md mx-auto border">
                  <img 
                    src={previewUrl} 
                    alt="Image preview" 
                    className="w-full h-auto object-contain max-h-[300px]" 
                  />
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 rounded-full p-1"
                    disabled={isPending}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any notes about this scan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm} disabled={isPending || !selectedFile}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Analyze
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error 
              ? error.message 
              : 'An error occurred while analyzing the image.'}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Results Section */}
      <h2 className="text-xl font-semibold mb-4">Detection History</h2>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : pcosDetections && pcosDetections.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pcosDetections.map((detection: PcosDetectionData) => (
            <Card key={detection.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={detection.imageUrl} 
                  alt="Ultrasound scan" 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${
                  detection.isPcos 
                    ? 'bg-red-500/90 text-white' 
                    : 'bg-green-500/90 text-white'
                }`}>
                  {detection.isPcos ? 'PCOS Detected' : 'No PCOS Detected'}
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">PCOS Likelihood</p>
                    <p className="text-sm font-bold">{detection.pcosLikelihood.toFixed(1)}%</p>
                  </div>
                  <Progress 
                    value={detection.pcosLikelihood} 
                    className={`h-2 ${
                      detection.pcosLikelihood > 50 
                        ? 'bg-red-200 [&>div]:bg-red-500' 
                        : 'bg-green-200 [&>div]:bg-green-500'
                    }`}
                  />
                </div>
                
                {detection.notes && (
                  <div className="text-sm mt-2">
                    <p className="font-medium">Notes:</p>
                    <p className="text-muted-foreground">{detection.notes}</p>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-4">
                  {format(new Date(detection.createdAt), 'MMMM d, yyyy')}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-4 py-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this result?')) {
                      deleteDetection(detection.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No detection results yet</p>
            <p className="text-muted-foreground">
              Upload an ultrasound image to get started with PCOS detection
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}