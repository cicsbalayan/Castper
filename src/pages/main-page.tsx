import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Maximize,
  Minimize,
  Monitor,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Declare pptxjs on window
declare global {
  interface Window {
    $: any;
    jQuery: any;
    pptxjs: any;
  }
}

// Extend jQuery interface for pptx plugin (used for type checking)

interface RoomData {
  code: string;
  pptUrl: string | null;
  pptName: string;
  isHost: boolean;
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const headerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
};

const buttonVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  hover: { scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" },
  tap: { scale: 0.95 },
};

export function MainPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load room data from localStorage
    const data = localStorage.getItem("dualview-room");
    if (data) {
      const parsed = JSON.parse(data) as RoomData;
      setRoomData(parsed);
    } else {
      // No room data, redirect to create
      navigate("/create-room");
    }
  }, [navigate]);

// Load and parse PPT file
  useEffect(() => {
    if (roomData?.pptUrl && slideContainerRef.current) {
      const loadPpt = async () => {
        setIsLoading(true);
        try {
          // For PPT files, we'll use Microsoft Office Online viewer to display as slides
          // This converts PPT to interactive slides without needing local parsing
          const pptUrl = roomData.pptUrl!;
          
          // Create an iframe for Office Online viewer
          // The Office Online viewer can display PPT files directly
          const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl)}`;
          
          if (slideContainerRef.current) {
            slideContainerRef.current.innerHTML = '';
            
            const iframe = document.createElement('iframe');
            iframe.src = viewerUrl;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allowFullscreen = true;
            
            // Wait for iframe to load
            iframe.onload = () => {
              console.log('PPT viewer loaded');
              setIsLoading(false);
              // Try to detect slide count - this is limited with iframe approach
              setTotalSlides(1);
            };
            
            iframe.onerror = () => {
              console.error('Failed to load PPT viewer');
              setIsLoading(false);
            };
            
            slideContainerRef.current.appendChild(iframe);
          }
        } catch (error) {
          console.error("Error loading PPT:", error);
          setIsLoading(false);
        }
      };
      
      loadPpt();
    }
  }, [roomData?.pptUrl]);

  // Listen for control commands from join-control page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dualview-control" && e.newValue) {
        try {
          const control = JSON.parse(e.newValue);
          if (control.action === "next") {
            setDirection(1);
            setCurrentSlide(control.slide);
          } else if (control.action === "prev") {
            setDirection(-1);
            setCurrentSlide(control.slide);
          } else if (control.action === "goto") {
            setDirection(control.slide > currentSlide ? 1 : -1);
            setCurrentSlide(control.slide);
          } else if (control.action === "fullscreen") {
            toggleFullscreen();
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentSlide]);

  // Poll for control changes (since storage event doesn't fire on same window)
  useEffect(() => {
    const interval = setInterval(() => {
      const control = localStorage.getItem("dualview-control");
      if (control) {
        try {
          const parsed = JSON.parse(control);
          if (parsed.action === "next") {
            setDirection(1);
            setCurrentSlide(parsed.slide);
          } else if (parsed.action === "prev") {
            setDirection(-1);
            setCurrentSlide(parsed.slide);
          } else if (parsed.action === "goto") {
            setDirection(parsed.slide > currentSlide ? 1 : -1);
            setCurrentSlide(parsed.slide);
          } else if (parsed.action === "fullscreen") {
            toggleFullscreen();
          }
          // Clear the control after processing
          localStorage.removeItem("dualview-control");
        } catch {
          // Ignore
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        if (currentSlide < totalSlides) {
          setDirection(1);
          setCurrentSlide(currentSlide + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentSlide > 1) {
          setDirection(-1);
          setCurrentSlide(currentSlide - 1);
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, totalSlides, isFullscreen, toggleFullscreen]);

  const goToNextSlide = () => {
    if (currentSlide < totalSlides) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 1) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (!roomData) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <p>Loading...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen flex flex-col bg-white ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {/* Header Bar */}
      <motion.div 
        className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm border-b"
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </motion.div>
          <div className="flex items-center gap-2 text-gray-900">
            <Monitor className="w-4 h-4" />
            <span className="font-mono text-sm">{roomCode}</span>
            {roomData.isHost && (
              <motion.span 
                className="text-xs bg-primary/20 px-2 py-0.5 rounded"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Host
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide Counter */}
          <motion.div 
            className="text-gray-900 text-sm font-mono mr-4"
            key={currentSlide}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {totalSlides > 0 ? `${currentSlide} / ${totalSlides}` : 'Loading...'}
          </motion.div>

          {/* Fullscreen Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Display Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-5xl aspect-video bg-white rounded-lg shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Loading presentation...</p>
            </div>
          ) : roomData.pptUrl ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* PPT Slide Container */}
                <div 
                  ref={slideContainerRef}
                  className="w-full h-full [&_p]:m-0 [&_span]:m-0 [&_div]:m-0"
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <p className="text-gray-500">No presentation loaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls (visible on hover or when not fullscreen) */}
      <motion.div 
        className="absolute inset-y-0 left-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullscreen ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={goToPrevSlide}
            disabled={currentSlide <= 1}
            className="h-24 w-16 bg-gray-100/90 text-gray-900 hover:bg-gray-200 rounded-none"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute inset-y-0 right-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullscreen ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={goToNextSlide}
            disabled={currentSlide >= totalSlides}
            className="h-24 w-16 bg-gray-100/90 text-gray-900 hover:bg-gray-200 rounded-none"
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Slide Progress Bar */}
      {totalSlides > 0 && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentSlide / totalSlides) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      )}

      {/* Status Indicators */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="absolute bottom-4 right-4 flex items-center gap-2 text-gray-600 text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
          >
            <Check className="w-3 h-3" />
            <span>Fullscreen</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

