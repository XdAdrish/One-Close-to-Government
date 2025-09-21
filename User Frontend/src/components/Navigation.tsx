import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Building2 } from 'lucide-react';

interface NavigationProps {
  activeView: 'submit' | 'submissions';
  onViewChange: (view: 'submit' | 'submissions') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Civic Connect
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:space-x-2">
            <Button
              variant={activeView === 'submit' ? 'default' : 'outline'}
              onClick={() => onViewChange('submit')}
              className={`w-full sm:w-auto ${activeView === 'submit' ? 'bg-gradient-primary shadow-button' : ''}`}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Report Issue</span>
              <span className="sm:hidden">Report</span>
            </Button>
            <Button
              variant={activeView === 'submissions' ? 'default' : 'outline'}
              onClick={() => onViewChange('submissions')}
              className={`w-full sm:w-auto ${activeView === 'submissions' ? 'bg-gradient-primary shadow-button' : ''}`}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">My Submissions</span>
              <span className="sm:hidden">Submissions</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};