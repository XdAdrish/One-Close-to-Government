import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { SubmitIssue } from '@/components/SubmitIssue';
import { SubmissionsView } from '@/components/SubmissionsView';

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

const Index = () => {
  const [activeView, setActiveView] = useState<'hero' | 'submit' | 'submissions'>('hero');
  const [issues, setIssues] = useState<Issue[]>([]);

  const handleSubmitIssue = (issueData: Omit<Issue, 'id' | 'timestamp' | 'status'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: 'submitted'
    };
    setIssues(prev => [newIssue, ...prev]);
    setActiveView('submissions');
  };

  const handleGetStarted = () => {
    setActiveView('submit');
  };

  const handleViewChange = (view: 'submit' | 'submissions') => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      {activeView !== 'hero' && (
        <Navigation activeView={activeView} onViewChange={handleViewChange} />
      )}
      
      <main className="pb-6 sm:pb-8">
        {activeView === 'hero' && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}
        
        {activeView === 'submit' && (
          <div className="py-6 sm:py-8 px-4 sm:px-6">
            <SubmitIssue onSubmit={handleSubmitIssue} />
          </div>
        )}
        
        {activeView === 'submissions' && (
          <div className="py-6 sm:py-8 px-4 sm:px-6">
            <SubmissionsView issues={issues} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
