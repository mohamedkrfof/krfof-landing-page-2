'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#FFD700', '#FFA500', '#FF6347', '#FFD700'],
  animationSpeed = 3,
}: GradientTextProps) {
  const gradientStops = colors.map((color, index) => {
    const percentage = (index / (colors.length - 1)) * 100;
    return `${color} ${percentage}%`;
  }).join(', ');

  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(45deg, ${gradientStops})`,
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: animationSpeed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}