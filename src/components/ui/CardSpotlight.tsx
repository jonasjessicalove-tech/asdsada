import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { cn } from '../../lib/utils';

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  color?: string;
  spotlightColor?: string;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className,
  radius = 350,
  color,
  spotlightColor,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const activeColor = spotlightColor || color || 'rgba(217, 119, 6, 0.16)';
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
    onMouseMove?.(e);
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group/spotlight relative rounded-2xl border border-slate-800 bg-[#0d121f] overflow-hidden transition-all duration-300',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${activeColor},
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};
