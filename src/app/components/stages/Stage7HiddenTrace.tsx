import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const markPositions = [
  { x: 25, y: 30 },
  { x: 70, y: 55 },
  { x: 40, y: 75 },
];

export function Stage7HiddenTrace() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'search' | 'memory' | 'clear'>('ar');
  const [found, setFound] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [memoryOrder, setMemoryOrder] = useState<number[]>([]);
  const [memoryInput, setMemoryInput] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (phase === 'search' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (phase === 'search' && (found.length === 3 || timeLeft === 0)) {
      setTimeout(() => setPhase('memory'), 500);
    }
  }, [phase, timeLeft, found.length]);

  const handleFind = (idx: number) => {
    if (!found.includes(idx)) {
      const newFound = [...found, idx];
      setFound(newFound);
      setMemoryOrder(newFound);
    }
  };

  const handleMemoryTap = (idx: number) => {
    const newInput = [...memoryInput, idx];
    setMemoryInput(newInput);
    if (newInput.length === memoryOrder.length) {
      setTimeout(() => setPhase('clear'), 500);
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={7}
        stageName="도깨비 흔적 수색"
        message="좋아요, 이제 진짜 탐험가 같아요!"
        relicId="ember2"
        relicType="ember"
        relicName="화전 기억"
        relicEmoji="✨"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={7}
      stageName="도깨비 흔적 수색"
      roleLabel="🔍 아이: 수색"
      bongiMessage="조급해하지 않아도 괜찮아요. 하나씩 찾으면 돼요."
      hints={['화면 곳곳에 숨은 표식을 탭하세요.', '깜빡이는 곳을 주의 깊게 보세요.']}
      bg="linear-gradient(180deg, #2A1A2A 0%, #3A2A1A 50%, #1A1A2A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #2A1A2A, #3A2A1A)' }}
          >
            <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-red-500/80 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white">흔적 탐지기</span>
            </div>

            {/* Radar pulse */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-400/30"
                animate={{ width: [0, 200], height: [0, 200], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">👹</span>
            </div>
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('search')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            👹 도깨비 흔적을 수색하자!
          </motion.button>
        </div>
      )}

      {phase === 'search' && (
        <div className="flex flex-col h-full">
          <div className="flex justify-between px-4 py-2">
            <span className="text-red-300 text-sm" style={{ fontFamily: 'Noto Sans KR' }}>
              {found.length}/3 발견
            </span>
            <span className={`text-sm ${timeLeft <= 10 ? 'text-red-400' : 'text-amber-300'}`} style={{ fontFamily: 'Noto Sans KR' }}>
              ⏱️ {timeLeft}초
            </span>
          </div>

          <div className="flex-1 relative mx-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #2A1A2A, #3A2A1A)' }}>
            {/* Hidden marks */}
            {markPositions.map((pos, idx) => {
              const isFound = found.includes(idx);
              return (
                <motion.button
                  key={idx}
                  className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => handleFind(idx)}
                  animate={isFound ? {} : { opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                >
                  {isFound ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 rounded-full bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center"
                    >
                      <span className="text-xl">✨</span>
                    </motion.div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-dashed border-red-400/20 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-red-400/30"
                      />
                    </div>
                  )}
                </motion.button>
              );
            })}

            {/* Radar sweep */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-0.5 h-32 bg-gradient-to-b from-red-400/50 to-transparent"
              style={{ transformOrigin: 'top center', translateX: '-50%' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="p-4">
            <p className="text-center text-red-200/60 text-xs" style={{ fontFamily: 'Noto Sans KR' }}>
              {found.length < 3 ? '🔍 화면을 탭해서 숨은 표식을 찾으세요!' : '✨ 모두 찾았어요!'}
            </p>
          </div>
        </div>
      )}

      {phase === 'memory' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-amber-200 text-center mb-2" style={{ fontFamily: 'Noto Serif KR' }}>
            발견 순서대로 다시 탭하세요!
          </p>
          <p className="text-amber-300/50 text-xs mb-8" style={{ fontFamily: 'Noto Sans KR' }}>
            📜 부모님이 기억한 순서로!
          </p>

          <div className="flex gap-4">
            {memoryOrder.map((markIdx, i) => {
              const done = memoryInput.includes(markIdx);
              return (
                <motion.button
                  key={markIdx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !done && handleMemoryTap(markIdx)}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 ${
                    done ? 'border-amber-400 bg-amber-500/30' : 'border-amber-400/20 bg-[#2A1A2A]'
                  }`}
                >
                  <span className="text-3xl">{done ? '✨' : '❓'}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </StageWrapper>
  );
}
