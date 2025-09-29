"use client";

import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-xl border-t border-white/10">
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-white/70">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-400">❤️</span>
            <span>by</span>
            <a
              href="https://drensokoli.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              Dren Sokoli
            </a>
          </div>
          <span className="text-white/50 p-1 hidden sm:block">|</span>
          
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/drensokoli/multi-kulti"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
