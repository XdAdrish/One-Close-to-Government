import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/civic-hero.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Civic engagement and city connectivity"
          className="w-full h-full object-cover mix-blend-overlay opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 text-white text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                Connect with Your
                <span className="block text-accent">Community</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
                Report civic issues, track progress, and help make your city better. 
                Your voice matters in building a stronger community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-button hover:scale-105 transition-transform"
              >
                Report an Issue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Reports</h3>
                  <p className="text-sm text-white/70">Submit issues instantly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Private</h3>
                  <p className="text-sm text-white/70">Your data protected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Community Impact</h3>
                  <p className="text-sm text-white/70">Make a difference</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Visual Element */}
          <div className="lg:justify-self-end">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center">
                  Civic Impact
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">1,247</div>
                    <div className="text-sm text-white/70">Issues Reported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">892</div>
                    <div className="text-sm text-white/70">Issues Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">5</div>
                    <div className="text-sm text-white/70">Departments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">72%</div>
                    <div className="text-sm text-white/70">Resolution Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};