import type { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageVariantsSlide: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageVariantsHorizontal: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger container with custom delay
export const staggerContainerWithDelay = (stagger = 0.1, delay = 0.2): Variants => ({
  animate: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

// Fade in up animation
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
};

// Fade in up with custom duration
export const fadeInUpWithDuration = (duration = 0.4): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration, ease: "easeOut" as const }
  },
});

// Slide in from right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
};

// Scale in animation
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

// Scale in with custom duration
export const scaleInWithDuration = (duration = 0.3): Variants => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration }
  },
});

// Button variants with hover and tap
export const buttonVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 },
};

// Simple button variants (without hover animation)
export const simpleButtonVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 },
};

// Header variants
export const headerVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
};

// Navigation button variants
export const navButtonVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  hover: { scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" },
  tap: { scale: 0.95 },
};

// Common transition props
export const defaultPageTransition = { duration: 0.4 };
export const quickPageTransition = { duration: 0.3 };
export const slowPageTransition = { duration: 0.5 };

