import { motion } from 'motion/react';
import { useGame, RuneType } from '../context/GameContext';
import { BongiBubble } from './BongiBubble';

interface StageClearProps {
  stageIndex: number;
  stageName: string;
  message: string;
  relicId: string;
  relicType: RuneType;
  relicName: string;
  relicEmoji: string;
}

export function StageClear({ stageIndex, stageName, message, relicId, relicType, relicName, relicEmoji }: StageClearProps) {
  const { state, dispatch } = useGame();

  const handleContinue = () => {
    dispatch({ type: 'COMPLETE_STAGE', payload: stageIndex });
    dispatch({ type: 'ADD_RELIC', payload: { id: relicId, runeType: relicType } });
    dispatch({ type: 'SET_SCREEN', payload: 'map' });
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, #1A3A2A 0%, #3A2A1A 100%)' }}>
      {/* Burst particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 mb-6"
      >
        <span className="text-5xl">{relicEmoji}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-amber-100 text-xl mb-2"
        style={{ fontFamily: 'Noto Serif KR' }}
      >
        봉인 해제!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.7 }}
        className="text-amber-200 text-sm mb-6"
        style={{ fontFamily: 'Noto Sans KR' }}
      >
        {stageName}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mx-6 mb-4"
      >
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center">
          <p className="text-amber-300 text-xs mb-1" style={{ fontFamily: 'Noto Sans KR' }}>획득한 유물</p>
          <p className="text-amber-100" style={{ fontFamily: 'Noto Serif KR' }}>{relicEmoji} {relicName}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mx-6 mb-4"
      >
        <div className="flex items-center gap-2 justify-center mb-2">
          <span className="text-xs text-amber-300/60" style={{ fontFamily: 'Noto Sans KR' }}>보물고 봉인</span>
          <span className="text-xs text-amber-400">{state.sealCount + 1}/10</span>
        </div>
        <div className="w-48 h-2 rounded-full bg-[#1A2E1A] overflow-hidden mx-auto">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
            initial={{ width: `${state.chestProgress}%` }}
            animate={{ width: `${Math.min(100, (state.sealCount + 1) * 10)}%` }}
            transition={{ delay: 1.5, duration: 1 }}
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="w-full px-6">
        <BongiBubble message={message} variant="success" />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleContinue}
        className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
        style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
      >
        지도로 돌아가기
      </motion.button>
    </div>
  );
}
