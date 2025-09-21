import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Mic, MicOff, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CameraCapture } from './CameraCapture';

interface Issue {
  id: string;
  department: string;
  location: string;
  description: string;
  photos: string[];
  videos: string[];
  audioRecording?: string;
  timestamp: Date;
  status: 'submitted' | 'in-progress' | 'resolved';
}

interface SubmitIssueProps {
  onSubmit: (issue: Omit<Issue, 'id' | 'timestamp' | 'status'>) => void;
}

const departments = [
  'Electricity',
  'PWD (Public Works Department)',
  'Roads & Transport',
  'Garbage & Sanitation',
  'Water Supply',
  'Others'
];

export const SubmitIssue: React.FC<SubmitIssueProps> = ({ onSubmit }) => {
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState<string | undefined>();
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setVideos(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioRecording(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast({
            title: "Location Retrieved",
            description: "Current location has been added to your report."
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not retrieve current location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!department || !location) {
      toast({
        title: "Missing Information",
        description: "Please select a department and provide a location.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      department,
      location,
      description,
      photos,
      videos,
      audioRecording
    });

    // Reset form
    setDepartment('');
    setLocation('');
    setDescription('');
    setPhotos([]);
    setVideos([]);
    setAudioRecording(undefined);

    toast({
      title: "Issue Submitted",
      description: "Your civic issue has been successfully submitted!"
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-xl sm:text-2xl font-bold">Report a Civic Issue</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 bg-gradient-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-semibold">Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select the relevant department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold">Location *</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or use current location"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                className="shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
            />
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">Media Attachments</Label>
            
            {/* Camera Capture and File Upload */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <CameraCapture
                  onPhotoCapture={(photoUrl) => setPhotos(prev => [...prev, photoUrl])}
                  onVideoCapture={(videoUrl) => setVideos(prev => [...prev, videoUrl])}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full"
                  size="sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Upload Photos</span>
                  <span className="sm:hidden">Photos</span>
                </Button>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="w-full"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload Videos</span>
                <span className="sm:hidden">Videos</span>
              </Button>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              capture="environment"
              onChange={handleVideoUpload}
              className="hidden"
            />

            {/* Audio Recording */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                className="flex-1"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Voice
                  </>
                )}
              </Button>
            </div>

            {/* Media Preview */}
            {photos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Photos ({photos.length})</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Videos ({videos.length})</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-16 sm:h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}

            {audioRecording && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Voice Recording</Label>
                <audio src={audioRecording} controls className="w-full" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-hero shadow-button hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-5 w-5 mr-2" />
            Submit Issue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};