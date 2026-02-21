import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Check, Copy, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function generateSessionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
      delayChildren: 0.1,
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

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
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

export function CreateRoomFragment() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [roomCode, setRoomCode] = useState(generateSessionCode);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.type === "application/vnd.ms-powerpoint" ||
        file.name.endsWith(".pptx") ||
        file.name.endsWith(".ppt")
      ) {
        setPptFile(file);
        const url = URL.createObjectURL(file);
        setPptUrl(url);
      } else {
        alert("Please select a PowerPoint file (.ppt or .pptx)");
      }
    }
  };

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
    if (pptUrl) {
      localStorage.setItem(
        "dualview-room",
        JSON.stringify({
          code: roomCode,
          pptUrl: pptUrl,
          pptName: pptFile?.name || "Presentation",
          isHost: true,
        })
      );
      navigate(`/present/${roomCode}`);
    }
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
      variants={pageVariants}
      transition={{ duration: 0.4 }}
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
            Create a room and upload your PowerPoint
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

        <motion.div className="bg-card border rounded-lg p-6 space-y-4" variants={slideInRight}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Upload PowerPoint</span>
            {pptFile && (
              <motion.span 
                className="text-xs text-green-500 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Check className="w-3 h-3" /> Uploaded
              </motion.span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {pptFile ? (
              <motion.div 
                key="file-selected"
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{pptFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(pptFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPptFile(null);
                    setPptUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="file-upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                    <span>Click to upload PPT/PPTX</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={scaleIn}>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full"
              size="lg"
              onClick={handleProceed}
              disabled={!pptUrl}
            >
              Proceed to Presentation
            </Button>
          </motion.div>
        </motion.div>

        {!pptUrl && (
          <p className="text-xs text-muted-foreground text-center">
            Please upload a PowerPoint file to continue
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

