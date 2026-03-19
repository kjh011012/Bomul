import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const textures = [
  { id: 'bark', name: '나무껍질', emoji: '🪵', color: '#8B6F47' },
  { id: 'stone', name: '돌', emoji: '🪨', color: '#9CA3AF' },
  { id: 'leaf', name: '잎', emoji: '🍃', color: '#4ADE80' },
  { id: 'soil', name: '흙', emoji: '🟤', color: '#92400E' },
];

const correctOrder = ['leaf', 'bark', 'stone', 'soil'];

export function Stage2TextureDial() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'dial' | 'connect' | 'hold' | 'clear'>('ar');
  const [dialPositions, setDialPositions] = useState<string[]>(['', '', '', '']);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);

  const handleDialSelect = (slot: number, textureId: string) => {
    const newPos = [...dialPositions];
    newPos[slot] = textureId;
    setDialPositions(newPos);
  };

  const allFilled = dialPositions.every(p => p !== '');

  const startHold = () => {
    setHolding(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setPhase('clear');
      }
    }, 30);
    const up = () => {
      clearInterval(interval);
      setHolding(false);
      setHoldProgress(0);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointerup', up);
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={2}
        stageName="숲피부 자물쇠"
        message="정말 좋아요. 숲이 여러분을 조금 믿기 시작했어요."
        relicId="bond2"
        relicType="bond"
        relicName="숲 봉인 조각"
        relicEmoji="🌿"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={2}
      stageName="숲피부 자물쇠"
      roleLabel="🔍 아이: 촉감 설명"
      bongiMessage="아이가 느낀 말이 열쇠예요."
      hints={['나무, 돌, 잎, 흙의 순서를 생각해보세요.', '자연에서 가장 부드러운 것부터 시작해보세요.']}
      bg="linear-gradient(180deg, #1A3A2A 0%, #2D5A2D 50%, #1A3A1A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #1A3A2A, #2D5A2D)' }}
          >
            {/* Floating runes */}
            {textures.map((t, i) => (
              <motion.div
                key={t.id}
                className="absolute text-3xl"
                style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 20}%` }}
                animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              >
                {t.emoji}
              </motion.div>
            ))}

            <motion.div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500/80 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white">숲 감지</span>
            </motion.div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('dial')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            🌿 숲피부 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'dial' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-green-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            🔍 아이가 촉감을 설명하고, 📜 부모가 룬 다이얼을 맞추세요!
          </p>

          {/* Dial slots */}
          <div className="flex gap-3 mb-8 mt-4">
            {[0, 1, 2, 3].map(slot => {
              const selected = textures.find(t => t.id === dialPositions[slot]);
              return (
                <motion.div
                  key={slot}
                  className={`w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center ${
                    selected ? 'border-green-400 bg-green-500/20' : 'border-green-400/20 bg-[#1A2E1A]'
                  }`}
                  animate={selected ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {selected ? (
                    <>
                      <span className="text-2xl">{selected.emoji}</span>
                      <span className="text-[9px] text-green-200 mt-1">{selected.name}</span>
                    </>
                  ) : (
                    <span className="text-xs text-green-400/30">{slot + 1}</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Texture options */}
          <p className="text-green-300/50 text-xs mb-3" style={{ fontFamily: 'Noto Sans KR' }}>재질을 순서대로 배치하세요</p>
          <div className="flex gap-3 mb-6">
            {textures.filter(t => !dialPositions.includes(t.id)).map(t => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const nextEmpty = dialPositions.indexOf('');
                  if (nextEmpty !== -1) handleDialSelect(nextEmpty, t.id);
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-amber-400/20"
                style={{ backgroundColor: t.color + '30' }}
              >
                <span className="text-2xl">{t.emoji}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setDialPositions(['', '', '', ''])}
              className="px-5 py-2 rounded-full bg-[#1A2E1A] border border-green-400/20 text-green-200 text-sm"
              style={{ fontFamily: 'Noto Sans KR' }}
            >
              다시 놓기
            </motion.button>
            {allFilled && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('hold')}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm"
                style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
              >
                자물쇠 해제!
              </motion.button>
            )}
          </div>
        </div>
      )}

      {phase === 'hold' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-green-200 text-center mb-8" style={{ fontFamily: 'Noto Serif KR' }}>
            👨‍👧 둘이 동시에 꾹 눌러<br />자물쇠를 해제하세요!
          </p>

          <motion.button
            onPointerDown={startHold}
            className="w-40 h-40 rounded-full flex items-center justify-center relative"
            style={{ background: `conic-gradient(#4ADE80 ${holdProgress * 3.6}deg, #1A2E1A ${holdProgress * 3.6}deg)` }}
          >
            <div className="w-36 h-36 rounded-full bg-[#1A3A2A] flex items-center justify-center">
              <motion.span
                animate={holding ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-4xl"
              >
                {holdProgress >= 100 ? '🔓' : '🔒'}
              </motion.span>
            </div>
          </motion.button>

          <p className="text-green-300/50 text-xs mt-4" style={{ fontFamily: 'Noto Sans KR' }}>
            {holding ? '꾸욱 누르고 계세요...' : '꾹 누르세요!'}
          </p>
        </div>
      )}
    </StageWrapper>
  );
}
