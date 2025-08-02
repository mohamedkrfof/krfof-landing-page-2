'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingProps {
  children: ReactNode;
  duration?: number;
  intensity?: number;
  className?: string;
}

export default function Floating({
  children,
  duration = 3,
  intensity = 10,
  className = '',
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}