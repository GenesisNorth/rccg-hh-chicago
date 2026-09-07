"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GiveModal() {
  const [isOpen, setIsOpen] = useState(false);
  const tithelyLink = "https://tithe.ly/give?c=1323289";

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-give-modal", handleOpenModal);
    return () => window.removeEventListener("open-give-modal", handleOpenModal);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md bg-background rounded-3xl overflow-hidden shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-[#16A34A] mr-3" />
                <h2 className="text-xl font-bold">Give Online</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close giving form"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#16A34A]/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-[#16A34A]" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-foreground">Partner With Us</h3>
              
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                Your generosity makes a difference. We use Tithe.ly to provide you with a safe, fast, and easy way to give online.
              </p>

              <a href={tithelyLink} target="_blank" rel="noopener noreferrer" className="w-full" onClick={handleClose}>
                <Button className="w-full h-14 rounded-full bg-[#111827] hover:bg-[#16A34A] text-white text-base font-bold shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center">
                  Continue to Tithe.ly <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>

              <div className="mt-6 flex items-center text-xs text-muted-foreground justify-center">
                <Shield className="h-3 w-3 mr-1.5 text-green-600" />
                <p>Transactions are secure and encrypted</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
