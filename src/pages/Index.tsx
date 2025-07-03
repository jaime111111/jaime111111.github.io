
import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '@/components/Counter';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const handleCountChange = (count: number) => {
    console.log('Counter changed to:', count);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Audio-Visual Counter Screen
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Digital counter with voice announcements and video playback
          </p>
          
          {/* Navigation */}
          <Link to="/enhanced">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg">
              Go to Enhanced Version →
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Video Player */}
          <div className="order-2 lg:order-1">
            <VideoPlayer />
          </div>

          {/* Right Side - Counter */}
          <div className="order-1 lg:order-2">
            <Counter onCountChange={handleCountChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Use the controls to manage the counter and video playback. 
            The counter includes voice announcements for accessibility.
          </p>
        </div>
      </div>

      {/* Scrolling Text Banner */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-gray-700 overflow-hidden">
        <div className="animate-pulse hover:animate-none">
          <div 
            className="whitespace-nowrap py-3 text-yellow-400 text-lg font-semibold px-8"
            style={{
              animation: 'scroll-right-to-left 20s linear infinite'
            }}
          >
            🎯 Welcome to Audio-Visual Counter Screen • Digital Counter with Voice Announcements • Video Player with Auto-Play • Interactive Controls Available • Count from 00 to 99 • Reset Function Included • Professional Interface Design • 
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-right-to-left {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `
      }} />
    </div>
  );
};

export default Index;
