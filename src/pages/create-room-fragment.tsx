import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  pageVariantsHorizontal,
  staggerContainer,
  fadeInUp,
  slideInRight,
  scaleIn,
  defaultPageTransition,
} from "@/lib/animation-variants";

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function CreateRoomFragment() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState(generateSessionCode());
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      alert("Failed to copy code");
    }
  };

  const handleProceed = () => {
    localStorage.setItem(
      "dualview-room",
      JSON.stringify({
        code: roomCode,
        isHost: true,
      })
    );
    navigate(`/present/${roomCode}`);
  };

  const regenerateCode = () => {
    setRoomCode(generateSessionCode());
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariantsHorizontal}
      transition={defaultPageTransition}
    >
      <motion.div 
        className="max-w-lg w-full space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
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
          <h1 className="text-2xl font-bold">Create Presenter Room</h1>
          <p className="text-muted-foreground">
            Create a room to start presenting
          </p>
        </motion.div>

        <motion.div className="bg-card border rounded-lg p-6 space-y-4" variants={slideInRight}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Session Code</span>
            <Button variant="outline" size="sm" onClick={regenerateCode}>
              Regenerate
            </Button>
          </div>

          <motion.div 
            className="flex gap-2"
            variants={fadeInUp}
          >
            <motion.div 
              className="flex-1 bg-muted rounded-lg px-4 py-3 text-center font-mono text-2xl tracking-widest font-bold"
              key={roomCode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {roomCode}
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </motion.div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center">
            Share this code with your phone to control the presentation
          </p>
        </motion.div>

        <motion.div className="bg-card border rounded-lg p-6 space-y-2" variants={slideInRight}>
          <p className="text-sm font-medium">Presentation</p>
          <p className="text-xs text-muted-foreground">
            Placeholder presentation will be shown
          </p>
        </motion.div>

        <motion.div variants={scaleIn}>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full"
              size="lg"
              onClick={handleProceed}
            >
              Proceed to Presentation
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

