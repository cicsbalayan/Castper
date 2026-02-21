import { useNavigate } from "react-router-dom";
import { Monitor, Smartphone, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  pageVariants,
  staggerContainer,
  fadeInUp,
  buttonVariants,
  defaultPageTransition,
} from "@/lib/animation-variants";

export function SelectionPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-4 py-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={defaultPageTransition}
    >
      <motion.div 
        className="w-full max-w-4xl space-y-10 text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        
        {/* Logo / Title */}
        <motion.div className="space-y-4" variants={fadeInUp}>
          <div className="flex justify-center">
            <motion.div 
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Presentation className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          <motion.h1 
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            variants={fadeInUp}
          >
            DualView
          </motion.h1>

          <motion.p 
            className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto"
            variants={fadeInUp}
          >
            Present your PPT from your phone, control it on your PC
          </motion.p>
        </motion.div>

        {/* Options */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={staggerContainer}
        >
          
          <motion.div variants={buttonVariants}>
            <Button
              onClick={() => navigate("/create-room")}
              className="w-full min-h-45 sm:min-h-55 p-6
                         flex flex-col items-center justify-center gap-4
                         rounded-2xl border text-center
                         hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
              asChild
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
              >
                <div className="p-4 border shadow-2xs rounded-full bg-muted">
                  <Monitor className="w-12 h-12" />
                </div>

                <div>
                  <div className="text-lg font-semibold">
                    Create Presenter Room
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Upload PPT and present on this device
                  </div>
                </div>
              </motion.div>
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <Button
              onClick={() => navigate("/join-room")}
              variant="outline"
              className="w-full min-h-45 sm:min-h-55 p-6
                         flex flex-col items-center justify-center gap-4
                         rounded-2xl border text-center
                         hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
              asChild
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
              >
                <div className="p-4 border shadow-2xl rounded-full bg-muted">
                  <Smartphone className="w-8 h-8" />
                </div>

                <div>
                  <div className="text-lg font-semibold">
                    Join Room
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Control presentation from another device
                  </div>
                </div>
              </motion.div>
            </Button>
          </motion.div>

        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-xs sm:text-sm text-muted-foreground pt-4"
          variants={fadeInUp}
        >
          Create a room on your PC, then join with your phone to control slides
        </motion.p>

      </motion.div>
    </motion.div>
  );
}

