import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BongiBubble } from './BongiBubble';

export function TeamNaming() {
  const { dispatch } = useGame();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_TEAM_NAME', payload: name.trim() });
      dispatch({ type: 'SET_SCREEN', payload: 'roleIntro' });
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1A3A2A 0%, #2D4A2D 100%)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BongiBubble message="우리 탐험대의 이름을 지어주세요! 이 이름은 보물고에 영원히 새겨질 거예요." />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 w-full max-w-sm"
        >
          <p className="text-amber-300/60 text-center text-xs mb-3" style={{ fontFamily: 'Noto Sans KR' }}>
            탐험대 이름
          </p>
          <div className="relative">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={12}
              placeholder="예: 용감한 봉황 가족"
              className="w-full text-center text-xl py-4 bg-transparent border-b-2 border-amber-400/40 text-amber-100 placeholder:text-amber-400/30 focus:outline-none focus:border-amber-400"
              style={{ fontFamily: 'Noto Serif KR' }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 h-0.5 bg-amber-400"
              animate={{ width: name ? '100%' : '0%', x: name ? '-50%' : '0%' }}
              style={{ translateX: '-50%' }}
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: name.trim() ? 1 : 0.3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="mt-10 px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg disabled:opacity-30"
          style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
        >
          탐험대 결성!
        </motion.button>
      </div>
    </div>
  );
}
