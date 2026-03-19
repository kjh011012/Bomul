import { motion } from 'motion/react';

interface ChestProgressRingProps {
  progress: number;
  size?: number;
}

export function ChestProgressRing({ progress, size = 56 }: ChestProgressRingProps) {
  const strokeWidth = 5;
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8942e" />
            <stop offset="50%" stopColor="#e8d48c" />
            <stop offset="100%" stopColor="#c9a84c" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(26,58,42,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#chestGold)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeDasharray={circumference}
          filter={progress > 0 ? 'url(#glow)' : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={progress >= 100 ? 'trophy' : progress >= 50 ? 'chest' : 'lock'}
          initial={{ scale: 1.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-lg"
        >
          {progress >= 100 ? '🏆' : progress >= 50 ? '📦' : '🔒'}
        </motion.span>
      </div>
    </div>
  );
}
