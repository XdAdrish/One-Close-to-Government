import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Building2, Camera, Video, Mic } from 'lucide-react';

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

interface SubmissionsViewProps {
  issues: Issue[];
}

const getStatusColor = (status: Issue['status']) => {
  switch (status) {
    case 'submitted':
      return 'bg-accent text-accent-foreground';
    case 'in-progress':
      return 'bg-primary text-primary-foreground';
    case 'resolved':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusText = (status: Issue['status']) => {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'in-progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    default:
      return 'Unknown';
  }
};

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="text-center p-12 shadow-card bg-gradient-card">
          <div className="space-y-4">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Issues Submitted Yet</h3>
            <p className="text-muted-foreground">
              Your submitted civic issues will appear here. Start by reporting your first issue!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Your Submissions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track the status of your civic issues and reports
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {issues.map((issue) => (
          <Card key={issue.id} className="shadow-card bg-gradient-card hover:shadow-civic transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    {issue.department}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {issue.timestamp.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{issue.location}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(issue.status)} shrink-0`}>
                  {getStatusText(issue.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {issue.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              )}

              {/* Media Attachments Summary */}
              {(issue.photos.length > 0 || issue.videos.length > 0 || issue.audioRecording) && (
                <div>
                  <h4 className="font-semibold mb-2">Attachments</h4>
                  <div className="flex gap-4 text-sm">
                    {issue.photos.length > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <Camera className="h-4 w-4" />
                        {issue.photos.length} photo{issue.photos.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    {issue.videos.length > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <Video className="h-4 w-4" />
                        {issue.videos.length} video{issue.videos.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    {issue.audioRecording && (
                      <div className="flex items-center gap-1 text-primary">
                        <Mic className="h-4 w-4" />
                        Voice recording
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Photos Preview */}
              {issue.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {issue.photos.slice(0, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-cover rounded border"
                    />
                  ))}
                  {issue.photos.length > 4 && (
                    <div className="w-full h-16 sm:h-20 bg-muted rounded border flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                      +{issue.photos.length - 4} more
                    </div>
                  )}
                </div>
              )}

              {/* Videos Preview */}
              {issue.videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {issue.videos.slice(0, 2).map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-24 sm:h-32 object-cover rounded border"
                    />
                  ))}
                  {issue.videos.length > 2 && (
                    <div className="w-full h-24 sm:h-32 bg-muted rounded border flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                      +{issue.videos.length - 2} more videos
                    </div>
                  )}
                </div>
              )}

              {/* Audio Recording */}
              {issue.audioRecording && (
                <div>
                  <h4 className="font-semibold mb-2">Voice Recording</h4>
                  <audio src={issue.audioRecording} controls className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};