import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BongiBubble } from './BongiBubble';

export function RoleIntro() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '역할을 나눠볼까요?',
      content: (
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-[#2D4A2D] border border-amber-400/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔍</span>
              <h3 className="text-amber-200" style={{ fontFamily: 'Noto Serif KR' }}>탐험가 (아이)</h3>
            </div>
            <p className="text-amber-100/60 text-sm" style={{ fontFamily: 'Noto Sans KR' }}>
              표식을 찾고, 방향을 고르고, 느낀 것을 말해주세요.
              여러분의 눈과 손이 봉인을 깨웁니다.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-5 rounded-2xl bg-[#3A2A1A] border border-amber-400/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📜</span>
              <h3 className="text-amber-200" style={{ fontFamily: 'Noto Serif KR' }}>해독가 (부모)</h3>
            </div>
            <p className="text-amber-100/60 text-sm" style={{ fontFamily: 'Noto Sans KR' }}>
              퍼즐을 풀고, 패턴을 해독하고, 아이의 발견을 연결해주세요.
              여러분의 지혜가 길을 엽니다.
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      title: '봉이를 소개할게요',
      content: (
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl"
          >
            <motion.span
              className="text-5xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🔥
            </motion.span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <BongiBubble message={`안녕하세요, ${state.teamName} 탐험대! 저는 봉이예요. 작은 봉황 정령이죠. 여러분이 봉인을 풀 때마다 제가 더 선명해질 거예요. 함께 보물고를 열어봐요!`} />
          </motion.div>
        </div>
      ),
    },
    {
      title: '탐험 키트',
      content: (
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {[
            { icon: '🪙', name: '룬 토큰 4개', desc: '물결·불씨·발자국·매듭' },
            { icon: '🗺️', name: '보물지도 봉투', desc: '비밀의 지도 조각' },
            { icon: '👜', name: '유물 파편 주머니', desc: '발견한 유물을 모아요' },
            { icon: '📿', name: '돌목걸이 줄', desc: '열쇠가 될 거예요' },
            { icon: '🔑', name: '최종 열쇠판', desc: '보물고의 마지막 열쇠' },
            { icon: '⭐', name: '봉이 탐험 패스', desc: '탐험대의 증표' },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-3 rounded-xl bg-[#2D4A2D]/80 border border-amber-400/10"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-amber-100 text-xs mt-1" style={{ fontFamily: 'Noto Sans KR', fontWeight: 500 }}>{item.name}</p>
              <p className="text-amber-200/40 text-xs" style={{ fontFamily: 'Noto Sans KR' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1A3A2A 0%, #2D4A2D 100%)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.h2
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-amber-200 text-xl mb-8"
          style={{ fontFamily: 'Noto Serif KR' }}
        >
          {current.title}
        </motion.h2>
        {current.content}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-amber-400 w-6' : 'bg-amber-400/30'}`} />
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else dispatch({ type: 'SET_SCREEN', payload: 'map' });
          }}
          className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
          style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
        >
          {step < steps.length - 1 ? '다음' : '탐험 시작!'}
        </motion.button>
      </div>
    </div>
  );
}
