import { ArrowLeft, ArrowRight, Check, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeInUp,
  scaleIn,
  simpleButtonVariants,
} from "@/lib/animation-variants";

interface ControlPanelProps {
  roomCode: string;
  currentSlide: number;
  totalSlides: number;
  onLeave: () => void;
  onNext: () => void;
  onPrev: () => void;
  onGoToSlide: (slide: number) => void;
  onFullscreen: () => void;
}

export function ControlPanel({
  roomCode,
  currentSlide,
  totalSlides,
  onLeave,
  onNext,
  onPrev,
  onGoToSlide,
  onFullscreen,
}: ControlPanelProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 bg-gradient-to-b from-background to-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={onLeave}
          className="absolute top-4 left-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Leave Room
        </Button>
      </motion.div>

      <motion.div 
        className="max-w-md w-full space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Room Info */}
        <motion.div className="text-center space-y-2" variants={fadeInUp}>
          <motion.div 
            className="flex justify-center"
            variants={scaleIn}
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
          </motion.div>
          <h1 className="text-xl font-bold">Connected to Room</h1>
          <p className="text-muted-foreground font-mono">{roomCode}</p>
        </motion.div>

        {/* Current Slide Display */}
        <motion.div 
          className="bg-card border rounded-lg p-6 text-center"
          variants={scaleIn}
        >
          <p className="text-sm text-muted-foreground mb-2">Current Slide</p>
          <motion.p 
            className="text-5xl font-bold"
            key={currentSlide}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {currentSlide}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-2">
            of {totalSlides}
          </p>
        </motion.div>

        {/* Control Buttons */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          variants={staggerContainer}
        >
          <motion.div variants={simpleButtonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={onPrev}
                disabled={currentSlide <= 1}
                className="h-16 border"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={simpleButtonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onNext}
                disabled={currentSlide >= totalSlides}
                className="h-16 border"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={simpleButtonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={onFullscreen}
                className="h-16"
              >
                <Monitor className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Slide Navigation */}
        <motion.div 
          className="bg-card border rounded-lg p-4 space-y-3"
          variants={fadeInUp}
        >
          <p className="text-sm font-medium text-center">Go to Slide</p>
          <motion.div 
            className="flex flex-wrap gap-2 justify-center"
            variants={staggerContainer}
          >
            {Array.from({ length: Math.min(totalSlides, 10) }, (_, i) => i + 1).map(
              (slide) => (
                <motion.div
                  key={slide}
                  variants={simpleButtonVariants}
                >
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentSlide === slide ? "default" : "outline"}
                      size="sm"
                      onClick={() => onGoToSlide(slide)}
                      className="w-10 h-10"
                    >
                      {slide}
                    </Button>
                  </motion.div>
                </motion.div>
              )
            )}
            {totalSlides > 10 && (
              <>
                <span className="text-muted-foreground">...</span>
                <motion.div variants={simpleButtonVariants}>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGoToSlide(totalSlides)}
                      className="w-10 h-10"
                    >
                      {totalSlides}
                    </Button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.p 
          className="text-xs text-muted-foreground text-center"
          variants={fadeInUp}
        >
          Tap arrows or slide numbers to navigate
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

