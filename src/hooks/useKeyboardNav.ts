import { useEffect, useCallback } from "react";

interface UseKeyboardNavOptions {
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  onNext: () => void;
  onPrev: () => void;
  onToggleFullscreen: () => void;
}

export function useKeyboardNav({
  currentSlide,
  totalSlides,
  isFullscreen,
  onNext,
  onPrev,
  onToggleFullscreen,
}: UseKeyboardNavOptions): void {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      if (currentSlide < totalSlides) {
        onNext();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentSlide > 1) {
        onPrev();
      }
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      onToggleFullscreen();
    } else if (e.key === "Escape" && isFullscreen) {
      e.preventDefault();
      // Handle escape in fullscreen - this should be handled by the fullscreen API
    }
  }, [currentSlide, totalSlides, isFullscreen, onNext, onPrev, onToggleFullscreen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

