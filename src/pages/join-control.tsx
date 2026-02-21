import { useState, useCallback } from "react";
import { JoinForm } from "@/components/fragments/join-form";
import { ControlPanel } from "@/components/fragments/control-panel";
import { useControlChannel } from "@/hooks/useControlChannel";

export function JoinControl() {
  const [roomCode, setRoomCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const { currentSlide, totalSlides, sendControl } = useControlChannel({
    onSync: (slide, total) => {
      console.log(`Synced: slide ${slide} of ${total}`);
    },
  });

  const handleJoin = useCallback((code: string) => {
    setRoomCode(code);
    setIsJoined(true);
    sendControl("sync");
  }, [sendControl]);

  const handleLeave = useCallback(() => {
    setIsJoined(false);
    setRoomCode("");
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides) {
      sendControl("next", currentSlide + 1);
    }
  }, [currentSlide, totalSlides, sendControl]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 1) {
      sendControl("prev", currentSlide - 1);
    }
  }, [currentSlide, sendControl]);

  const handleGoToSlide = useCallback((slide: number) => {
    if (slide >= 1 && slide <= totalSlides) {
      sendControl("goto", slide);
    }
  }, [totalSlides, sendControl]);

  const handleFullscreen = useCallback(() => {
    sendControl("fullscreen");
  }, [sendControl]);

  if (!isJoined) {
    return <JoinForm onJoin={handleJoin} />;
  }

  return (
    <ControlPanel
      roomCode={roomCode}
      currentSlide={currentSlide}
      totalSlides={totalSlides}
      onLeave={handleLeave}
      onNext={handleNext}
      onPrev={handlePrev}
      onGoToSlide={handleGoToSlide}
      onFullscreen={handleFullscreen}
    />
  );
}

export default JoinControl;

