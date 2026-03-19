import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';

export function SplashScreen() {
  const { dispatch } = useGame();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A2E1A 0%, #2D4A2D 30%, #1A3A2A 70%, #0F1F0F 100%)' }}
    >
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Phoenix feather glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(200,148,62,0.3) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Bongi character */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl mb-8 z-10"
      >
        <motion.span
          className="text-4xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔥
        </motion.span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-3xl text-amber-100 mb-2 z-10"
        style={{ fontFamily: 'Noto Serif KR', fontWeight: 700 }}
      >
        보물을 찾아서
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-amber-300/80 text-sm mb-12 z-10"
        style={{ fontFamily: 'Noto Serif KR' }}
      >
        고라데이의 숨은 봉인
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'intro1' })}
        className="z-10 px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
        style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
      >
        모험을 시작하기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 text-xs text-amber-200/50 z-10"
        style={{ fontFamily: 'Noto Sans KR' }}
      >
        부모와 아이가 함께하는 AR 보물찾기 어드벤처
      </motion.p>
    </motion.div>
  );
}
