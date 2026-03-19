import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const stones = [
  { id: 'jade', name: '옥빛', emoji: '🟢', color: '#22C55E' },
  { id: 'amber', name: '호박', emoji: '🟠', color: '#F59E0B' },
  { id: 'obsidian', name: '흑요석', emoji: '⚫', color: '#374151' },
  { id: 'quartz', name: '수정', emoji: '⚪', color: '#E5E7EB' },
  { id: 'ruby', name: '홍옥', emoji: '🔴', color: '#EF4444' },
];

export function Stage5NecklaceCraft() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'select' | 'arrange' | 'pattern' | 'clear'>('ar');
  const [selected, setSelected] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>(['', '', '']);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const handleSlotPlace = (stoneId: string) => {
    const nextEmpty = slots.indexOf('');
    if (nextEmpty !== -1) {
      const newSlots = [...slots];
      newSlots[nextEmpty] = stoneId;
      setSlots(newSlots);
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={5}
        stageName="돌목걸이 공방"
        message="와, 이건 진짜 예뻐요. 이 목걸이는 마지막 열쇠가 될 거예요."
        relicId="necklace"
        relicType="bond"
        relicName="돌목걸이"
        relicEmoji="📿"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={5}
      stageName="돌목걸이 공방"
      roleLabel="🔍 아이: 돌 선택"
      bongiMessage="와, 이건 진짜 예뻐요."
      hints={['돌 3개를 골라 목걸이를 만들어보세요.', '어떤 조합이든 멋진 목걸이가 될 거예요.']}
      bg="linear-gradient(180deg, #2A2A3A 0%, #3A2A3A 50%, #2A1A2A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #2A2A3A, #3A2A3A)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="text-6xl"
              >
                📿
              </motion.div>
            </div>
            {/* Floating light particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-purple-400/40"
                style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('select')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            📿 공방 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'select' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-purple-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            🔍 아이가 마음에 드는 돌 3개를 골라주세요!
          </p>
          <p className="text-purple-300/50 text-xs mb-6" style={{ fontFamily: 'Noto Sans KR' }}>
            {selected.length}/3개 선택됨
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {stones.map(s => {
              const isSelected = selected.includes(s.id);
              return (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSelect(s.id)}
                  className={`w-20 h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                    isSelected ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-purple-400/15 bg-[#2A2A3A]'
                  }`}
                >
                  <span className="text-3xl mb-1">{s.emoji}</span>
                  <span className="text-[10px] text-purple-200/60">{s.name}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {selected.length === 3 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPhase('arrange')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
            >
              돌 배치하기!
            </motion.button>
          )}
        </div>
      )}

      {phase === 'arrange' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-purple-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            📜 부모님이 돌을 슬롯에 배치해주세요!
          </p>

          {/* Necklace frame */}
          <div className="relative w-64 h-48 mb-6">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              <path d="M 30 10 Q 100 130 170 10" stroke="#A78BFA" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.3" />
            </svg>
            {[0, 1, 2].map(i => {
              const positions = [{ x: 55, y: 60 }, { x: 128, y: 100 }, { x: 200, y: 60 }];
              const stoneId = slots[i];
              const stone = stones.find(s => s.id === stoneId);
              return (
                <motion.div
                  key={i}
                  className={`absolute w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    stone ? 'border-purple-400 bg-purple-500/30' : 'border-dashed border-purple-400/30 bg-[#2A2A3A]'
                  }`}
                  style={{ left: positions[i].x - 28, top: positions[i].y - 28 }}
                >
                  {stone ? <span className="text-2xl">{stone.emoji}</span> : <span className="text-xs text-purple-400/30">{i + 1}</span>}
                </motion.div>
              );
            })}
          </div>

          {/* Available stones to place */}
          <div className="flex gap-3 mb-6">
            {selected.filter(id => !slots.includes(id)).map(id => {
              const stone = stones.find(s => s.id === id)!;
              return (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSlotPlace(id)}
                  className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center"
                >
                  <span className="text-2xl">{stone.emoji}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSlots(['', '', ''])}
              className="px-5 py-2 rounded-full bg-[#2A2A3A] border border-purple-400/20 text-purple-200 text-sm"
            >
              다시 놓기
            </motion.button>
            {slots.every(s => s !== '') && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dispatch({ type: 'SET_NECKLACE', payload: slots });
                  setPhase('clear');
                }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm"
                style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
              >
                목걸이 완성!
              </motion.button>
            )}
          </div>
        </div>
      )}
    </StageWrapper>
  );
}
