import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const directions = [
  { id: 'north', label: '산 위쪽', emoji: '⬆️', angle: 0 },
  { id: 'east', label: '동쪽 숲', emoji: '➡️', angle: 90 },
  { id: 'south', label: '마을 쪽', emoji: '⬇️', angle: 180 },
  { id: 'west', label: '계곡 쪽', emoji: '⬅️', angle: 270 },
];

export function Stage4EchoDirection() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'direction' | 'maze' | 'clear'>('ar');
  const [targetDir, setTargetDir] = useState(directions[Math.floor(Math.random() * 4)]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [mazePos, setMazePos] = useState({ x: 0, y: 0 });
  const [mazeComplete, setMazeComplete] = useState(false);
  const goalPos = { x: 2, y: 2 };

  const handleDirectionChoice = (dir: string) => {
    setChosen(dir);
    dispatch({ type: 'ADD_ROUTE', payload: dir });
    setTimeout(() => setPhase('maze'), 800);
  };

  const moveMaze = (dx: number, dy: number) => {
    const nx = Math.max(0, Math.min(2, mazePos.x + dx));
    const ny = Math.max(0, Math.min(2, mazePos.y + dy));
    setMazePos({ x: nx, y: ny });
    if (nx === goalPos.x && ny === goalPos.y) {
      setMazeComplete(true);
      setTimeout(() => setPhase('clear'), 800);
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={4}
        stageName="심마니의 외침"
        message="어떤 길이든, 여러분의 길이 될 수 있어요."
        relicId="trail1"
        relicType="trail"
        relicName="발자국 유물"
        relicEmoji="👣"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={4}
      stageName="심마니의 외침"
      roleLabel="🔍 아이: 방향 선택"
      bongiMessage="이번엔 조금 더 모험해볼까요?"
      hints={['메아리가 가장 크게 울리는 방향을 고르세요.', '아이의 직감을 믿어보세요.']}
      bg="linear-gradient(180deg, #1A3A2A 0%, #2A4A1A 50%, #1A2E0A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #1A3A2A, #2A4A1A)' }}
          >
            {/* Echo rings spreading in multiple directions */}
            {directions.map((d, i) => (
              <motion.div
                key={d.id}
                className="absolute w-20 h-1 bg-green-400/30 rounded"
                style={{
                  left: '50%', top: '50%',
                  transform: `translate(-50%, -50%) rotate(${d.angle}deg)`,
                  transformOrigin: 'left center',
                }}
                animate={{ width: [20, 100, 20], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >🏃</motion.span>
            </div>
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('direction')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            🏃 갈림길을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'direction' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-green-200 text-center mb-2" style={{ fontFamily: 'Noto Serif KR' }}>
            메아리가 울려퍼져요!
          </p>
          <p className="text-green-300/60 text-xs mb-8 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            🔍 아이가 먼저 방향을 고르고, 📜 부모가 확인해주세요
          </p>

          <div className="relative w-64 h-64 mb-6">
            {/* Compass center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full border-2 border-dashed border-green-400/30 flex items-center justify-center"
              >
                <span className="text-2xl">🧭</span>
              </motion.div>
            </div>

            {/* Direction buttons */}
            {directions.map(d => {
              const positions: Record<string, string> = {
                north: 'top-0 left-1/2 -translate-x-1/2',
                east: 'right-0 top-1/2 -translate-y-1/2',
                south: 'bottom-0 left-1/2 -translate-x-1/2',
                west: 'left-0 top-1/2 -translate-y-1/2',
              };
              return (
                <motion.button
                  key={d.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDirectionChoice(d.id)}
                  className={`absolute ${positions[d.id]} w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${
                    chosen === d.id ? 'border-green-400 bg-green-500/30' : 'border-green-400/20 bg-[#1A2E1A]'
                  }`}
                >
                  <span className="text-xl">{d.emoji}</span>
                  <span className="text-[9px] text-green-200/60">{d.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'maze' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-green-200 text-sm mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            짧은 경로를 탈출하세요! 🏃
          </p>

          {/* Simple 3x3 grid maze */}
          <div className="grid grid-cols-3 gap-1 mb-6">
            {Array.from({ length: 9 }).map((_, i) => {
              const x = i % 3, y = Math.floor(i / 3);
              const isPlayer = mazePos.x === x && mazePos.y === y;
              const isGoal = goalPos.x === x && goalPos.y === y;
              return (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                    isPlayer ? 'bg-green-500/40 border-2 border-green-400' :
                    isGoal ? 'bg-amber-500/20 border-2 border-amber-400/50' :
                    'bg-[#1A2E1A] border border-green-400/10'
                  }`}
                >
                  {isPlayer && <span className="text-2xl">🏃</span>}
                  {isGoal && !isPlayer && (
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl">⭐</motion.span>
                  )}
                </div>
              );
            })}
          </div>

          {/* D-pad controls */}
          <div className="grid grid-cols-3 gap-1 w-36">
            <div />
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => moveMaze(0, -1)} className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center text-lg">⬆️</motion.button>
            <div />
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => moveMaze(-1, 0)} className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center text-lg">⬅️</motion.button>
            <div className="w-12 h-12 rounded-xl bg-[#1A2E1A] flex items-center justify-center"><span className="text-sm">👣</span></div>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => moveMaze(1, 0)} className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center text-lg">➡️</motion.button>
            <div />
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => moveMaze(0, 1)} className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center text-lg">⬇️</motion.button>
            <div />
          </div>
        </div>
      )}
    </StageWrapper>
  );
}
