import { useState, useEffect, useCallback } from "react";

interface SlideControl {
  action: "next" | "prev" | "goto" | "fullscreen" | "sync";
  slide?: number;
  totalSlides?: number;
}

interface UseControlChannelOptions {
  onSync?: (slide: number, totalSlides: number) => void;
  onNext?: (slide: number) => void;
  onPrev?: (slide: number) => void;
  onGoToSlide?: (slide: number) => void;
  onFullscreen?: () => void;
}

interface UseControlChannelResult {
  currentSlide: number;
  totalSlides: number;
  sendControl: (action: SlideControl["action"], slide?: number) => void;
}

export function useControlChannel(
  options: UseControlChannelOptions = {}
): UseControlChannelResult {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(10);
  const [channel] = useState(() => new BroadcastChannel("dualview-control"));

  // Handle incoming messages from presenter
  useEffect(() => {
    const handleMessage = (event: MessageEvent<SlideControl>) => {
      const control = event.data;

      if (control.action === "sync") {
        // Sync slide info from presenter
        if (control.slide) setCurrentSlide(control.slide);
        if (control.totalSlides) setTotalSlides(control.totalSlides);
        options.onSync?.(control.slide ?? currentSlide, control.totalSlides ?? totalSlides);
      } else if (control.action === "next") {
        const targetSlide = control.slide ?? currentSlide + 1;
        setCurrentSlide(targetSlide);
        options.onNext?.(targetSlide);
      } else if (control.action === "prev") {
        const targetSlide = control.slide ?? currentSlide - 1;
        setCurrentSlide(targetSlide);
        options.onPrev?.(targetSlide);
      } else if (control.action === "goto") {
        if (control.slide) {
          setCurrentSlide(control.slide);
          options.onGoToSlide?.(control.slide);
        }
      } else if (control.action === "fullscreen") {
        options.onFullscreen?.();
      }
    };

    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
    };
  }, [channel, currentSlide, totalSlides, options]);

  // Send control action to presenter
  const sendControl = useCallback((action: SlideControl["action"], slide?: number) => {
    channel.postMessage({ action, slide });
    localStorage.setItem("dualview-control", JSON.stringify({ action, slide }));    setTimeout(() => {
      localStorage.removeItem("dualview-control");
    }, 100);
  }, [channel]);

  return {
    currentSlide,
    totalSlides,
    sendControl,
  };
}

