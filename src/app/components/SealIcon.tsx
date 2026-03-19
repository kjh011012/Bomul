import { motion } from 'motion/react';

interface SealIconProps {
  index: number;
  cleared: boolean;
  active?: boolean;
  onClick?: () => void;
  label?: string;
}

export function SealIcon({ index, cleared, active, onClick, label }: SealIconProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="flex flex-col items-center gap-1"
    >
      <motion.div
        animate={
          active
            ? {
                boxShadow: [
                  '0 0 12px rgba(201,168,76,0.4), 0 0 24px rgba(201,168,76,0.15)',
                  '0 0 20px rgba(201,168,76,0.7), 0 0 40px rgba(201,168,76,0.25)',
                  '0 0 12px rgba(201,168,76,0.4), 0 0 24px rgba(201,168,76,0.15)',
                ],
              }
            : cleared
            ? { boxShadow: '0 0 12px rgba(201,168,76,0.3)' }
            : {}
        }
        transition={active ? { repeat: Infinity, duration: 1.8 } : {}}
        className="w-14 h-14 rounded-full flex items-center justify-center border-2 relative overflow-hidden"
        style={{
          background: cleared
            ? 'linear-gradient(145deg, #c9a84c, #e8d48c)'
            : active
            ? 'linear-gradient(145deg, #f5f0e5, #e8e0d0)'
            : 'rgba(26,58,42,0.06)',
          borderColor: cleared
            ? '#b8942e'
            : active
            ? '#c8956c'
            : 'rgba(26,58,42,0.1)',
        }}
      >
        {/* Inner ring for cleared */}
        {cleared && (
          <div className="absolute inset-1.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.35)' }} />
        )}

        {cleared ? (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-lg"
            style={{ color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
          >
            ✦
          </motion.span>
        ) : (
          <>
            <span className="text-base" style={{ color: active ? '#c8956c' : 'rgba(26,58,42,0.2)' }}>
              {active ? '◎' : '⛓'}
            </span>
            {active && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(200,149,108,0.3)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </>
        )}

        {/* Subtle overlay */}
        {!cleared && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 rounded-full" />
        )}
      </motion.div>

      <span
        className="text-[10px] text-center max-w-16 leading-tight"
        style={{
          color: cleared ? '#6b4e3d' : active ? '#1a3a2a' : '#a0a0a0',
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        {label || `봉인 ${index + 1}`}
      </span>
    </motion.button>
  );
}
