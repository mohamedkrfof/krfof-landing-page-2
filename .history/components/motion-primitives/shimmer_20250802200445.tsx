'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ShimmerProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
}

export default function Shimmer({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.6)',
}: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 -skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}