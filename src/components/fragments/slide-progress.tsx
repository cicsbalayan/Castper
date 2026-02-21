import { motion } from "framer-motion";

interface SlideProgressProps {
  currentSlide: number;
  totalSlides: number;
}

export function SlideProgress({ currentSlide, totalSlides }: SlideProgressProps) {
  if (totalSlides <= 0) return null;

  return (
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
  );
}

