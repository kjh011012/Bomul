import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

export function Stage6ShadowAlign() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'align' | 'hold' | 'clear'>('ar');
  const [rotation, setRotation] = useState(45);
  const [holdTime, setHoldTime] = useState(0);
  const targetRotation = 180;
  const tolerance = 15;
  const isAligned = Math.abs(rotation - targetRotation) < tolerance;

  const startHold = () => {
    if (!isAligned) return;
    let t = 0;
    const iv = setInterval(() => {
      t += 1;
      setHoldTime(t);
      if (t >= 30) { clearInterval(iv); setPhase('clear'); }
    }, 100);
    const up = () => { clearInterval(iv); setHoldTime(0); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointerup', up);
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={6}
        stageName="그림자 나침반"
        message="딱 맞았어요! 그림자가 길이 되었어요."
        relicId="trail2"
        relicType="trail"
        relicName="나침반 문양"
        relicEmoji="🧭"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={6}
      stageName="그림자 나침반"
      roleLabel="👨‍👧 역할 교환"
      bongiMessage="이번엔 서로의 눈이 되어 주세요."
      hints={['그림자와 룬을 겹치게 정렬하세요.', '한 명은 방향, 한 명은 폰을 고정하세요.']}
      bg="linear-gradient(180deg, #1A1A2A 0%, #2A2A3A 50%, #1A1A1A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #1A1A2A, #2A2A3A)' }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-6xl">🧭</span>
            </motion.div>
            {/* Shadow beams */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-24 bg-indigo-400/20"
                style={{ left: '50%', top: '50%', transformOrigin: 'top center', transform: `rotate(${deg}deg)` }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('align')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            🧭 그림자 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'align' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-indigo-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            그림자와 룬을 정렬하세요!
          </p>
          <p className="text-indigo-300/50 text-xs mb-6" style={{ fontFamily: 'Noto Sans KR' }}>
            한 명은 방향 안내, 한 명은 슬라이더 조작
          </p>

          {/* Alignment visualization */}
          <div className="relative w-64 h-64 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400/20" />
            {/* Target */}
            <div
              className="absolute w-1 h-24 bg-amber-400/50"
              style={{ left: '50%', top: '50%', transformOrigin: 'top center', transform: `translate(-50%, 0) rotate(${targetRotation}deg)` }}
            />
            {/* User's shadow */}
            <motion.div
              className={`absolute w-1.5 h-24 rounded ${isAligned ? 'bg-green-400' : 'bg-indigo-400'}`}
              style={{ left: '50%', top: '50%', transformOrigin: 'top center', transform: `translate(-50%, 0) rotate(${rotation}deg)` }}
            />
            {/* Center point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-400" />

            {isAligned && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-green-400 text-xs bg-black/50 px-3 py-1 rounded-full">✨ 정렬됨!</span>
              </motion.div>
            )}
          </div>

          {/* Rotation slider */}
          <input
            type="range"
            min={0}
            max={360}
            value={rotation}
            onChange={e => setRotation(Number(e.target.value))}
            className="w-64 mb-6 accent-indigo-400"
          />

          {isAligned && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <p className="text-indigo-300/60 text-xs mb-3" style={{ fontFamily: 'Noto Sans KR' }}>3초간 유지하세요!</p>
              <motion.button
                onPointerDown={startHold}
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{ background: `conic-gradient(#818CF8 ${holdTime * 12}deg, #1A1A2A ${holdTime * 12}deg)` }}
              >
                <div className="w-28 h-28 rounded-full bg-[#1A1A2A] flex items-center justify-center">
                  <span className="text-3xl">🧭</span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </StageWrapper>
  );
}
