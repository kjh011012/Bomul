import { motion } from 'motion/react';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'gold' | 'forest' | 'water' | 'ember' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const variants = {
  gold: {
    bg: 'linear-gradient(135deg, #b8942e, #c9a84c, #e8d48c, #c9a84c)',
    color: '#1a3a2a',
    shadow: '0 4px 20px rgba(201,168,76,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
    hoverShadow: '0 6px 30px rgba(201,168,76,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
  },
  forest: {
    bg: 'linear-gradient(135deg, #2d5a3e, #3d6b4e, #5a9e6a, #3d6b4e)',
    color: '#e8f4e8',
    shadow: '0 4px 20px rgba(61,107,78,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
    hoverShadow: '0 6px 30px rgba(61,107,78,0.5)',
  },
  water: {
    bg: 'linear-gradient(135deg, #3a8ea8, #4a9eb8, #7bc4d4, #4a9eb8)',
    color: '#fff',
    shadow: '0 4px 20px rgba(74,158,184,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverShadow: '0 6px 30px rgba(74,158,184,0.5)',
  },
  ember: {
    bg: 'linear-gradient(135deg, #c46828, #d4783c, #e8a060, #d4783c)',
    color: '#fff',
    shadow: '0 4px 20px rgba(212,120,60,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverShadow: '0 6px 30px rgba(212,120,60,0.5)',
  },
  ghost: {
    bg: 'rgba(250,246,240,0.08)',
    color: '#e8d48c',
    shadow: 'none',
    hoverShadow: '0 0 20px rgba(232,212,140,0.15)',
  },
};

export function GoldButton({ children, onClick, disabled, variant = 'gold', size = 'md', fullWidth, className = '' }: GoldButtonProps) {
  const v = variants[variant];
  const py = size === 'sm' ? 'py-2.5 px-5' : size === 'lg' ? 'py-4.5 px-10' : 'py-3.5 px-8';

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      onClick={disabled ? undefined : onClick}
      className={`${py} rounded-2xl relative overflow-hidden ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        background: disabled ? '#e8e0d4' : v.bg,
        color: disabled ? '#a0a0a0' : v.color,
        fontFamily: "'Noto Sans KR', sans-serif",
        boxShadow: disabled ? 'none' : v.shadow,
        opacity: disabled ? 0.6 : 1,
        border: variant === 'ghost' ? '1px solid rgba(232,212,140,0.2)' : 'none',
      }}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && variant !== 'ghost' && (
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 1 }}
        />
      )}
    </motion.button>
  );
}
