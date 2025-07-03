import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// These should match the settings offered in the demo and config pages.
const AVAILABLE_COLORS = [
  { label: "Green", value: "green-400" },
  { label: "Blue", value: "blue-400" },
  { label: "Red", value: "red-400" },
  { label: "Yellow", value: "yellow-400" },
  { label: "Purple", value: "purple-400" },
  { label: "Pink", value: "pink-400" },
];

const AVAILABLE_BANNER_TEXT_SIZES = [
  { label: "Pequeño", value: "text-base" },
  { label: "Mediano", value: "text-lg" },
  { label: "Grande", value: "text-2xl" },
  { label: "Extra Grande", value: "text-4xl" }
];

const AVAILABLE_VIDEO_PLAYER_SIZES = [
  { label: "Bajo", value: "h-48" },
  { label: "Medio", value: "h-64" },
  { label: "Alto", value: "h-80" },
  { label: "Extra Alto", value: "h-[28rem]" }
];

const AVAILABLE_THEMES = [
  { label: "Oscuro", value: "dark" },
  { label: "Claro", value: "light" }
];

const defaultBanner = "🎯 Custom Counter Demo • All features enabled • Digital Counter, Spanish Voice, Video Upload, Custom Styling!";

interface CustomDemoConfig {
  bannerText: string;
  setBannerText: (bannerText: string) => void;
  counterColor: string;
  setCounterColor: (color: string) => void;
  counterSize: string;
  setCounterSize: (size: string) => void;
  uploadedVideos: string[];
  setUploadedVideos: (urls: string[]) => void;
  bannerTextSize: string;
  setBannerTextSize: (size: string) => void;
  videoPlayerSize: string;
  setVideoPlayerSize: (size: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  AVAILABLE_COLORS: typeof AVAILABLE_COLORS;
  AVAILABLE_BANNER_TEXT_SIZES: typeof AVAILABLE_BANNER_TEXT_SIZES;
  AVAILABLE_VIDEO_PLAYER_SIZES: typeof AVAILABLE_VIDEO_PLAYER_SIZES;
  AVAILABLE_THEMES: typeof AVAILABLE_THEMES;
  defaultBanner: string;
}

const LOCAL_STORAGE_VIDEOS_KEY = "customDemoUploadedVideos";

const CustomDemoConfigContext = createContext<CustomDemoConfig | undefined>(undefined);

export const useCustomDemoConfig = () => {
  const ctx = useContext(CustomDemoConfigContext);
  if (!ctx) throw new Error("useCustomDemoConfig must be used within CustomDemoConfigProvider");
  return ctx;
};

export const CustomDemoConfigProvider = ({ children }: { children: ReactNode }) => {
  const [bannerText, setBannerText] = useState(defaultBanner);
  const [counterColor, setCounterColor] = useState("green-400");
  const [counterSize, setCounterSize] = useState("160px");
  const [uploadedVideos, setUploadedVideosState] = useState<string[]>([]);
  const [bannerTextSize, setBannerTextSize] = useState("text-lg");
  const [videoPlayerSize, setVideoPlayerSize] = useState("h-64");
  const [theme, setTheme] = useState("dark"); // default: dark

  // Load video list from localStorage initially
  useEffect(() => {
    const savedVideos = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (savedVideos) {
      try {
        setUploadedVideosState(JSON.parse(savedVideos));
      } catch {}
    }
  }, []);

  // Save video list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(uploadedVideos));
  }, [uploadedVideos]);

  // Slight API change: wrap setUploadedVideos to keep sync with localStorage
  const setUploadedVideos = (urls: string[]) => {
    setUploadedVideosState(urls);
    // No need to also call localStorage here, it's handled by the effect above
  };

  return (
    <CustomDemoConfigContext.Provider value={{
      bannerText, setBannerText,
      counterColor, setCounterColor,
      counterSize, setCounterSize,
      uploadedVideos, setUploadedVideos,
      bannerTextSize, setBannerTextSize,
      videoPlayerSize, setVideoPlayerSize,
      theme, setTheme,
      AVAILABLE_COLORS,
      AVAILABLE_BANNER_TEXT_SIZES,
      AVAILABLE_VIDEO_PLAYER_SIZES,
      AVAILABLE_THEMES,
      defaultBanner
    }}>
      {children}
    </CustomDemoConfigContext.Provider>
  );
};
