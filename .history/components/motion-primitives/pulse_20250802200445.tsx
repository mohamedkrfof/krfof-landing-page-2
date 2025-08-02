'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PulseProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
  color?: string;
}

export default function Pulse({
  children,
  className = '',
  scale = 1.05,
  duration = 2,
  color = 'rgba(59, 130, 246, 0.5)',
}: PulseProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
        }}
        animate={{
          scale: [1, scale, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}