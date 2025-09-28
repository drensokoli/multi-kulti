"use client";

import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

interface FloatingMessageProps {
  message: string | null;
  onDismiss: () => void;
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade out animation
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3 shadow-lg min-w-80 max-w-lg">
        <div className="flex items-center gap-3">
          <Info size={18} className="text-blue-400 flex-shrink-0" />
          <p className="text-white text-sm font-medium whitespace-nowrap">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingMessage;