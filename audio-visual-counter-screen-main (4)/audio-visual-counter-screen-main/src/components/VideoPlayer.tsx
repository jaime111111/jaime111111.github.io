import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  autoLoop?: boolean;
  autoPlay?: boolean;
  uploadedVideos?: string[];
  controlsHidden?: boolean;
  size?: string; // Accept tailwind height class, e.g. h-48/h-64 etc
  customHeight?: string; // Accept custom height in px
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  autoLoop = true,
  autoPlay = true,
  uploadedVideos = [],
  controlsHidden = false,
  size = "h-64",
  customHeight
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(autoLoop);
  const [uploadedVideosState, setUploadedVideosState] = useState<string[]>(uploadedVideos);

  React.useEffect(() => {
    setUploadedVideosState(uploadedVideos);
    setCurrentVideoIndex(0);
  }, [uploadedVideos]);

  // Sample video URLs - you can replace these with your own videos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const defaultVideoSources = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ];

  // Player allows cycling from uploaded playlist or default list.
  // If only one video, Next button is disabled.
  const videoSources = uploadedVideosState.length > 0 ? [...uploadedVideosState] : [...defaultVideoSources];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const nextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    setCurrentVideoIndex(nextIndex);
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (autoPlay) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    } else {
      setIsPlaying(false);
      nextVideo();
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setUploadedVideosState(prev => [...prev, videoUrl]);
      setCurrentVideoIndex(videoSources.length); // Switch to the new video
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [isRepeat, currentVideoIndex, autoPlay]);

  // Determine video height - use customHeight if provided, otherwise use size class
  const getVideoHeightStyle = () => {
    if (customHeight) {
      return { height: customHeight };
    }
    return {};
  };

  const getVideoSizeClass = () => {
    if (customHeight) {
      return ""; // Don't use size class when custom height is provided
    }
    return typeof size === "string" ? size : "h-64";
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl p-6">
      {/* Video Display */}
      <div 
        className={`relative bg-black rounded-lg overflow-hidden mb-4 shadow-lg ${getVideoSizeClass()}`}
        style={getVideoHeightStyle()}
      >
        <video
          ref={videoRef}
          src={videoSources[currentVideoIndex]}
          className={`w-full object-cover ${getVideoSizeClass()}`}
          style={customHeight ? { height: customHeight } : {}}
          loop={isRepeat}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect fill='%23000' width='400' height='225'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='24'%3EReproductor de Video%3C/text%3E%3C/svg%3E"
        />
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Progress Bar and Controls are hidden if controlsHidden */}
      {!controlsHidden && (
        <>
          <div className="mb-4">
            <div className="bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button
              onClick={togglePlay}
              variant="outline"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              onClick={resetVideo}
              variant="outline"
              size="sm"
              className="bg-gray-600 hover:bg-gray-700 text-white border-gray-500"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <Button
              onClick={nextVideo}
              variant="outline"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white border-green-500"
              disabled={videoSources.length <= 1}
            >
              Siguiente
            </Button>

            <Button
              onClick={() => setIsRepeat(!isRepeat)}
              variant="outline"
              size="sm"
              className={`${
                isRepeat
                  ? 'bg-orange-600 hover:bg-orange-700 border-orange-500'
                  : 'bg-gray-600 hover:bg-gray-700 border-gray-500'
              } text-white`}
            >
              {isRepeat ? '🔄 Repetir' : '➡️ Siguiente'}
            </Button>

            <Button
              onClick={() => document.getElementById('video-file-upload')?.click()}
              variant="outline"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}

      {/* Playlist display (if more than one in list) */}
      {!controlsHidden && videoSources.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          {videoSources.map((url, idx) => (
            <Button
              key={url}
              onClick={() => setCurrentVideoIndex(idx)}
              variant={idx === currentVideoIndex ? "secondary" : "outline"}
              className={idx === currentVideoIndex ? "bg-blue-600 text-white" : ""}
              size="sm"
            >
              {uploadedVideosState.length > 0 ? `Mi video ${idx + 1}` : `Demo ${idx + 1}`}
            </Button>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      {!controlsHidden && (
        <input
          id="video-file-upload"
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />
      )}

      {!controlsHidden && (
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Video {currentVideoIndex + 1} de {videoSources.length}
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {isRepeat ? 'Modo Repetición' : 'Modo Auto Siguiente'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
