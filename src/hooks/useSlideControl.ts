import { useState, useEffect, useCallback } from "react";

export interface SlideControl {
  action: "next" | "prev" | "goto" | "fullscreen";
  slide?: number;
}

interface UseSlideControlResult {
  currentSlide: number;
  direction: number;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  goToSlide: (slide: number) => void;
  toggleFullscreen: () => void;
}

export function useSlideControl(
  totalSlides: number,
  currentSlideParam: number,
  directionParam: number,
  setCurrentSlide: (slide: number) => void,
  setDirection: (dir: number) => void,
  onFullscreenToggle: () => void
): UseSlideControlResult {
  const [channel] = useState(() => new BroadcastChannel("dualview-control"));

  useEffect(() => {
    const handleMessage = (event: MessageEvent<SlideControl>) => {
      const control = event.data;
      
      if (control.action === "next") {
        setDirection(1);
        setCurrentSlide(control.slide ?? currentSlideParam + 1);
      } else if (control.action === "prev") {
        setDirection(-1);
        setCurrentSlide(control.slide ?? currentSlideParam - 1);
      } else if (control.action === "goto") {
        const targetSlide = control.slide ?? currentSlideParam;
        setDirection(targetSlide > currentSlideParam ? 1 : -1);
        setCurrentSlide(targetSlide);
      } else if (control.action === "fullscreen") {
        onFullscreenToggle();
      }
    };

    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
    };
  }, [channel, currentSlideParam, setCurrentSlide, setDirection, onFullscreenToggle]);

  // Also handle localStorage for initial compatibility (can be removed after full migration)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dualview-control" && e.newValue) {
        try {
          const control = JSON.parse(e.newValue) as SlideControl;
          
          if (control.action === "next") {
            setDirection(1);
            setCurrentSlide(control.slide ?? currentSlideParam + 1);
          } else if (control.action === "prev") {
            setDirection(-1);
            setCurrentSlide(control.slide ?? currentSlideParam - 1);
          } else if (control.action === "goto") {
            const targetSlide = control.slide ?? currentSlideParam;
            setDirection(targetSlide > currentSlideParam ? 1 : -1);
            setCurrentSlide(targetSlide);
          } else if (control.action === "fullscreen") {
            onFullscreenToggle();
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentSlideParam, setCurrentSlide, setDirection, onFullscreenToggle]);

  const sendControl = useCallback((action: SlideControl["action"], slide?: number) => {
    channel.postMessage({ action, slide });
    // Also set to localStorage for compatibility
    localStorage.setItem("dualview-control", JSON.stringify({ action, slide }));
    // Clear after a short delay
    setTimeout(() => {
      localStorage.removeItem("dualview-control");
    }, 100);
  }, [channel]);

  const goToNextSlide = useCallback(() => {
    if (currentSlideParam < totalSlides) {
      setDirection(1);
      setCurrentSlide(currentSlideParam + 1);
      sendControl("next", currentSlideParam + 1);
    }
  }, [currentSlideParam, totalSlides, setCurrentSlide, setDirection, sendControl]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideParam > 1) {
      setDirection(-1);
      setCurrentSlide(currentSlideParam - 1);
      sendControl("prev", currentSlideParam - 1);
    }
  }, [currentSlideParam, setCurrentSlide, setDirection, sendControl]);

  const goToSlide = useCallback((slide: number) => {
    if (slide >= 1 && slide <= totalSlides) {
      setDirection(slide > currentSlideParam ? 1 : -1);
      setCurrentSlide(slide);
      sendControl("goto", slide);
    }
  }, [currentSlideParam, totalSlides, setCurrentSlide, setDirection, sendControl]);

  const toggleFullscreen = useCallback(() => {
    sendControl("fullscreen");
    onFullscreenToggle();
  }, [sendControl, onFullscreenToggle]);

  return {
    currentSlide: currentSlideParam,
    direction: directionParam,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
    toggleFullscreen,
  };
}

