import React from "react";
import Counter from "@/components/Counter";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCustomDemoConfig } from "@/context/CustomDemoConfigContext";
import { ShoppingBasket } from "lucide-react";

const LOCAL_STORAGE_COUNTER_KEY = "customDemoLastCounter";
const LOCAL_STORAGE_CYCLE_KEY = "customDemoLastCycle";

const CustomCounterDemo: React.FC = () => {
  const {
    bannerText,
    counterColor,
    counterSize,
    uploadedVideos,
    bannerTextSize,
    videoPlayerSize,
    theme
  } = useCustomDemoConfig();

  // For debugging count output and cycle tracking
  const [currentCount, setCurrentCount] = React.useState(0);
  const [currentCycle, setCurrentCycle] = React.useState(0);
  const [previousCount, setPreviousCount] = React.useState(0);

  const handleCountChange = (c: number) => {
    console.log("Count changed to:", c);
    
    // Detect cycle completion in both directions
    if (previousCount === 99 && c === 0) {
      // Forward cycle: 99 -> 00 (increment cycle)
      setCurrentCycle(prevCycle => {
        const newCycle = prevCycle + 1;
        localStorage.setItem(LOCAL_STORAGE_CYCLE_KEY, newCycle.toString());
        console.log("Forward cycle completed! New cycle:", newCycle);
        return newCycle;
      });
    } else if (previousCount === 0 && c === 99) {
      // Backward cycle: 00 -> 99 (decrement cycle)
      setCurrentCycle(prevCycle => {
        const newCycle = prevCycle - 1;
        localStorage.setItem(LOCAL_STORAGE_CYCLE_KEY, newCycle.toString());
        console.log("Backward cycle completed! New cycle:", newCycle);
        return newCycle;
      });
    }
    
    setPreviousCount(currentCount);
    setCurrentCount(c);
  };

  // Function to get the letter based on cycle count
  const getLetter = (cycle: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    // Handle negative cycles by using modulo with positive result
    const normalizedCycle = ((cycle % 5) + 5) % 5;
    return letters[normalizedCycle];
  };

  // Decide which video list to use (user uploaded or default inside VideoPlayer)
  const playlist = uploadedVideos.length > 0 ? uploadedVideos : undefined;

  // Read last saved values for counter and cycle
  const [initialCounter, setInitialCounter] = React.useState<number>(0);
  React.useEffect(() => {
    const lastCounter = localStorage.getItem(LOCAL_STORAGE_COUNTER_KEY);
    const lastCycle = localStorage.getItem(LOCAL_STORAGE_CYCLE_KEY);
    
    if (lastCounter !== null) {
      const counterValue = Number(lastCounter);
      setInitialCounter(counterValue);
      setCurrentCount(counterValue);
      setPreviousCount(counterValue);
    }
    
    if (lastCycle !== null) {
      const cycleValue = Number(lastCycle);
      setCurrentCycle(cycleValue);
    }
  }, []);

  // Calculate dynamic video height based on counter size
  const getVideoHeight = () => {
    const counterSizeNum = parseInt(counterSize.replace('px', ''));
    // Make video height proportional to counter size
    const minHeight = 200; // minimum height for video
    const calculatedHeight = Math.max(minHeight, counterSizeNum * 2);
    return `${calculatedHeight}px`;
  };

  // Counter reference to control it from screen clicks
  const counterRef = React.useRef<any>(null);

  // Full screen mouse handlers
  const handleScreenMouseDown = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (counterRef.current) {
      counterRef.current.handleScreenClick(event);
    }
  }, []);

  const handleScreenMouseUp = React.useCallback(() => {
    if (counterRef.current) {
      counterRef.current.handleScreenMouseUp();
    }
  }, []);

  const handleScreenMouseLeave = React.useCallback(() => {
    if (counterRef.current) {
      counterRef.current.handleScreenMouseLeave();
    }
  }, []);

  const handleContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault(); // Prevent right-click menu
  }, []);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme === "dark" ? "from-gray-900 via-blue-900 to-gray-900" : "from-gray-100 via-blue-100 to-gray-50"} p-4 transition-colors`}
      onMouseDown={handleScreenMouseDown}
      onMouseUp={handleScreenMouseUp}
      onMouseLeave={handleScreenMouseLeave}
      onContextMenu={handleContextMenu}
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            ATENDIENDO AL
          </h1>
          {/* Config Button - positioned to the right */}
          <Link to="/custom-config">
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-0 right-0 text-white hover:bg-white/10"
            >
              <ShoppingBasket className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Main content - side by side layout with automatic sizing */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center min-h-[65vh]">
          {/* Video Player - automatically sized based on counter */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <VideoPlayer
                autoLoop={false}
                autoPlay
                uploadedVideos={playlist}
                controlsHidden
                size="custom"
                customHeight={getVideoHeight()}
              />
            </div>
          </div>
          
          {/* Counter - maintains its configured size */}
          <div className="flex items-center justify-center">
            <Counter
              ref={counterRef}
              onCountChange={handleCountChange}
              size={counterSize}
              color={counterColor}
              language="es"
              allowNegative={false}
              initialValue={initialCounter}
              currentLetter={getLetter(currentCycle)}
            />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-gray-700 overflow-hidden z-50">
        <div>
          <div
            className={`whitespace-nowrap py-3 font-semibold px-8 text-yellow-400 ${bannerTextSize}`}
            style={{
              animation: "scroll-right-to-left 20s linear infinite"
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

export default CustomCounterDemo;
