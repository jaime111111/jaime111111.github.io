import React, { useState } from 'react';
import Counter from '@/components/Counter';
import VideoPlayer from '@/components/VideoPlayer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const Enhanced = () => {
  const [bannerText, setBannerText] = useState('🎯 Welcome to Audio-Visual Counter Screen • Digital Counter with Voice Announcements • Video Player with Auto-Play • Interactive Controls Available • Count from 00 to 99 • Reset Function Included • Professional Interface Design •');
  const [counterSize, setCounterSize] = useState('9xl');
  const [counterColor, setCounterColor] = useState('green-400');

  const handleCountChange = (count: number) => {
    console.log('Counter changed to:', count);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      console.log('Video uploaded:', videoUrl);
      // You can pass this to the VideoPlayer component
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Enhanced Audio-Visual Counter
          </h1>
          <p className="text-xl text-gray-300">
            Advanced counter with customization options
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Customization Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Banner Text Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Banner Text</label>
              <Input
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter banner text..."
                className="bg-slate-700 text-white border-slate-600"
              />
            </div>

            {/* Counter Size Control */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Counter Size</label>
              <select
                value={counterSize}
                onChange={(e) => setCounterSize(e.target.value)}
                className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded-md"
              >
                <option value="6xl">Small (6xl)</option>
                <option value="8xl">Medium (8xl)</option>
                <option value="9xl">Large (9xl)</option>
                <option value="text-[12rem]">Extra Large</option>
              </select>
            </div>

            {/* Counter Color Control */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Counter Color</label>
              <select
                value={counterColor}
                onChange={(e) => setCounterColor(e.target.value)}
                className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded-md"
              >
                <option value="green-400">Green</option>
                <option value="blue-400">Blue</option>
                <option value="red-400">Red</option>
                <option value="yellow-400">Yellow</option>
                <option value="purple-400">Purple</option>
                <option value="pink-400">Pink</option>
              </select>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Upload Video</label>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => document.getElementById('video-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Video Player */}
          <div className="order-2 lg:order-1">
            <VideoPlayer autoLoop={true} autoPlay={true} />
          </div>

          {/* Right Side - Counter */}
          <div className="order-1 lg:order-2">
            <Counter 
              onCountChange={handleCountChange} 
              size={counterSize}
              color={counterColor}
              language="es"
              allowNegative={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Enhanced version with customization controls and Spanish voice support.
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
            {bannerText}
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

export default Enhanced;
