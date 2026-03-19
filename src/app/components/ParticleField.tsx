import { motion } from 'motion/react';
import { useMemo } from 'react';

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  style?: 'float' | 'firefly' | 'sparkle';
}

export function ParticleField({ count = 20, color = 'rgba(232,212,140,0.4)', speed = 'normal', style = 'float' }: ParticleFieldProps) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i,
    size: style === 'sparkle' ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: (speed === 'slow' ? 5 : speed === 'fast' ? 2 : 3) + Math.random() * 3,
    delay: Math.random() * 3,
    drift: (Math.random() - 0.5) * 20,
  })), [count, speed, style]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: style === 'firefly'
              ? `0 0 ${p.size * 3}px ${color}`
              : style === 'sparkle'
              ? `0 0 ${p.size * 2}px ${color}`
              : 'none',
          }}
          animate={
            style === 'firefly'
              ? { y: [0, -30 + p.drift, 0], x: [0, p.drift, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }
              : style === 'sparkle'
              ? { opacity: [0, 1, 0], scale: [0, 1.5, 0] }
              : { y: [0, -30, 0], opacity: [0.15, 0.6, 0.15] }
          }
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
