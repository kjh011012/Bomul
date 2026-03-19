import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';

const slides = [
  {
    bg: 'linear-gradient(180deg, #1A3A2A 0%, #2D4A2D 50%, #1A2E1A 100%)',
    text: '오래전, 고라데이의 깊은 골짜기에는\n산과 물, 바람과 돌의 흐름을 읽는\n수호자들이 있었습니다.',
    subtext: '',
    emoji: '🏔️',
  },
  {
    bg: 'linear-gradient(180deg, #1A2E1A 0%, #3A2A1A 50%, #2A1A0A 100%)',
    text: '그들은 마을의 가장 소중한 보물을\n10개의 봉인과 4개의 유물 자물쇠 뒤에\n숨겨 두었습니다.',
    subtext: '금은보화가 아닌,\n감각, 용기, 길 찾기, 협동의 기억이 담긴 보물고.',
    emoji: '🔒',
  },
  {
    bg: 'linear-gradient(180deg, #2A1A0A 0%, #1A1A2A 50%, #0A0A1A 100%)',
    text: '어느 날 봉황의 울음이 멈추고,\n봉인은 흩어지고,\n지도를 읽는 법도 잊혀졌습니다.',
    subtext: '이제, 여러분의 가족이\n잃어버린 봉인을 다시 깨울 차례입니다.',
    emoji: '🌙',
  },
];

export function IntroCinematic() {
  const { dispatch } = useGame();
  const [slideIndex, setSlideIndex] = useState(0);

  const current = slides[slideIndex];

  const next = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      dispatch({ type: 'SET_SCREEN', payload: 'teamName' });
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: current.bg }}>
      {/* Ambient particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/20"
          style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={slideIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center h-full px-8"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-6xl mb-10"
          >
            {current.emoji}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-amber-100 text-center text-lg whitespace-pre-line mb-6"
            style={{ fontFamily: 'Noto Serif KR', fontWeight: 400, lineHeight: 2 }}
          >
            {current.text}
          </motion.p>

          {current.subtext && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
              className="text-amber-200/70 text-center text-sm whitespace-pre-line"
              style={{ fontFamily: 'Noto Sans KR', lineHeight: 1.8 }}
            >
              {current.subtext}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === slideIndex ? 'bg-amber-400 w-6' : 'bg-amber-400/30'}`} />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={next}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200"
        style={{ fontFamily: 'Noto Sans KR' }}
      >
        {slideIndex < slides.length - 1 ? '다음' : '모험 준비하기'}
      </motion.button>
    </div>
  );
}
