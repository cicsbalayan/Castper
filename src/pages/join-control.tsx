import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Key, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.95 },
};

export function JoinControl() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(10);

  const handleJoin = () => {
    if (roomCode.length === 6) {
      // Check if room exists in localStorage
      const roomData = localStorage.getItem("dualview-room");
      if (roomData) {
        const parsed = JSON.parse(roomData);
        if (parsed.code === roomCode.toUpperCase()) {
          setIsJoined(true);
          setTotalSlides(10); // Default, would come from actual PPT
        } else {
          alert("Room not found. Please check the code.");
        }
      } else {
        alert("Room not found. Please check the code.");
      }
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
      // Notify the main page (would use WebSocket in real app)
      localStorage.setItem(
        "dualview-control",
        JSON.stringify({ action: "next", slide: currentSlide + 1 })
      );
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
      localStorage.setItem(
        "dualview-control",
        JSON.stringify({ action: "prev", slide: currentSlide - 1 })
      );
    }
  };

  const goToSlide = (slide: number) => {
    if (slide >= 1 && slide <= totalSlides) {
      setCurrentSlide(slide);
      localStorage.setItem(
        "dualview-control",
        JSON.stringify({ action: "goto", slide })
      );
    }
  };

  if (!isJoined) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="max-w-md w-full space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Back Button */}
          <motion.div variants={fadeInUp}>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <motion.div className="text-center space-y-2" variants={fadeInUp}>
            <motion.div 
              className="flex justify-center"
              variants={scaleIn}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-bold">Join Room</h1>
            <p className="text-muted-foreground">
              Enter the 6-character session code from the presenter
            </p>
          </motion.div>

          {/* Room Code Input */}
          <motion.div className="space-y-4" variants={staggerContainer}>
            <motion.div className="space-y-2" variants={fadeInUp}>
              <label className="text-sm font-medium">Session Code</label>
              <motion.input
                type="text"
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(e.target.value.toUpperCase().slice(0, 6))
                }
                placeholder="ABC123"
                className="w-full h-14 text-center text-2xl font-mono tracking-widest bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={6}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={scaleIn}>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleJoin}
                  disabled={roomCode.length !== 6}
                >
                  Join Room
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Control interface after joining
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
          onClick={() => setIsJoined(false)}
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
          <motion.div variants={buttonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={goToPrevSlide}
                disabled={currentSlide <= 1}
                className="h-16 border"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={goToNextSlide}
                disabled={currentSlide >= totalSlides}
                className="h-16 border"
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={buttonVariants}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  // Toggle fullscreen on presenter
                  localStorage.setItem(
                    "dualview-control",
                    JSON.stringify({ action: "fullscreen" })
                  );
                }}
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
                  variants={buttonVariants}
                >
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentSlide === slide ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToSlide(slide)}
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
                <motion.div variants={buttonVariants}>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToSlide(totalSlides)}
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

