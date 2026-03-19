import { motion } from 'motion/react';
import type { RuneType } from '../context/GameContext';

const runeConfig: Record<RuneType, { symbol: string; label: string; color: string; bgGrad: string; glowColor: string }> = {
  wave: { symbol: '〰', label: '물결', color: '#4a9eb8', bgGrad: 'linear-gradient(145deg, #3a8ea8, #4a9eb8, #7bc4d4)', glowColor: 'rgba(74,158,184,0.4)' },
  ember: { symbol: '🔆', label: '불씨', color: '#d4783c', bgGrad: 'linear-gradient(145deg, #c46828, #d4783c, #e8a060)', glowColor: 'rgba(212,120,60,0.4)' },
  trail: { symbol: '⟡', label: '발자국', color: '#3d6b4e', bgGrad: 'linear-gradient(145deg, #2d5a3e, #3d6b4e, #6b9e7a)', glowColor: 'rgba(61,107,78,0.4)' },
  knot: { symbol: '∞', label: '매듭', color: '#c9a84c', bgGrad: 'linear-gradient(145deg, #b8942e, #c9a84c, #e8d48c)', glowColor: 'rgba(201,168,76,0.4)' },
};

interface RuneTokenProps {
  type: RuneType;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function RuneToken({ type, selected, onClick, size = 'md', disabled }: RuneTokenProps) {
  const cfg = runeConfig[type];
  const s = size === 'sm' ? 48 : size === 'md' ? 64 : 80;

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.88 }}
      whileHover={disabled ? {} : { scale: 1.06 }}
      animate={selected ? {
        boxShadow: [`0 0 15px ${cfg.glowColor}`, `0 0 30px ${cfg.glowColor}`, `0 0 15px ${cfg.glowColor}`],
      } : {}}
      transition={selected ? { repeat: Infinity, duration: 1.8 } : {}}
      onClick={disabled ? undefined : onClick}
      className="rounded-full flex flex-col items-center justify-center border-2 transition-all relative"
      style={{
        width: s,
        height: s,
        background: selected ? cfg.bgGrad : '#f5f0e5',
        borderColor: selected ? cfg.color : 'rgba(26,58,42,0.12)',
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {/* Inner ring */}
      {selected && (
        <div className="absolute inset-1 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.3)' }} />
      )}
      <span
        className={size === 'sm' ? 'text-base' : 'text-xl'}
        style={{ color: selected ? '#fff' : cfg.color, textShadow: selected ? '0 1px 3px rgba(0,0,0,0.2)' : 'none' }}
      >
        {cfg.symbol}
      </span>
      <span
        className="text-[10px] mt-0.5"
        style={{
          color: selected ? 'rgba(255,255,255,0.9)' : cfg.color,
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        {cfg.label}
      </span>
    </motion.button>
  );
}
