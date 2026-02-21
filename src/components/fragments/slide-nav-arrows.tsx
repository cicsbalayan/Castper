import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { navButtonVariants } from "@/lib/animation-variants";

interface SlideNavArrowsProps {
  currentSlide: number;
  totalSlides: number;
  isFullscreen: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function SlideNavArrows({
  currentSlide,
  totalSlides,
  isFullscreen,
  onNext,
  onPrev,
}: SlideNavArrowsProps) {
  return (
    <>
      {/* Left Navigation Arrow */}
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullscreen ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            size="lg"
            onClick={onPrev}
            disabled={currentSlide <= 1}
            className="h-24 w-16 bg-gray-100/90 text-gray-900 hover:bg-gray-200 rounded-none"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Right Navigation Arrow */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center opacity-0 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullscreen ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            size="lg"
            onClick={onNext}
            disabled={currentSlide >= totalSlides}
            className="h-24 w-16 bg-gray-100/90 text-gray-900 hover:bg-gray-200 rounded-none"
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}

