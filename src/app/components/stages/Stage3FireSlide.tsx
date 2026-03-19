import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

// Sliding puzzle: arrange tiles to create air path for fire
const GRID_SIZE = 3;
const GOAL = [1, 2, 3, 4, 0, 5, 6, 7, 8]; // 0 = empty
const initialTiles = [1, 3, 2, 4, 7, 5, 0, 6, 8];
const tileIcons: Record<number, { emoji: string; name: string }> = {
  1: { emoji: '🔥', name: '불씨' },
  2: { emoji: '💨', name: '바람' },
  3: { emoji: '🌫️', name: '연기' },
  4: { emoji: '🪵', name: '장작' },
  5: { emoji: '🌡️', name: '온기' },
  6: { emoji: '⚡', name: '불꽃' },
  7: { emoji: '🪨', name: '화덕' },
  8: { emoji: '🌿', name: '재' },
};

export function Stage3FireSlide() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'sort' | 'slide' | 'clear'>('ar');
  const [tiles, setTiles] = useState(initialTiles);
  const [sortItems, setSortItems] = useState(['🔥 불씨', '🌫️ 연기', '🌡️ 온기', '🌿 재']);
  const [sortDone, setSortDone] = useState(false);

  const emptyIdx = tiles.indexOf(0);
  const canMove = (idx: number) => {
    const row = Math.floor(idx / GRID_SIZE), col = idx % GRID_SIZE;
    const eRow = Math.floor(emptyIdx / GRID_SIZE), eCol = emptyIdx % GRID_SIZE;
    return (Math.abs(row - eRow) + Math.abs(col - eCol)) === 1;
  };

  const moveTile = (idx: number) => {
    if (!canMove(idx)) return;
    const newTiles = [...tiles];
    [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
    setTiles(newTiles);
    if (JSON.stringify(newTiles) === JSON.stringify(GOAL)) {
      setTimeout(() => setPhase('clear'), 800);
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={3}
        stageName="움막 화덕의 비밀"
        message="따뜻함은 늘 누군가 함께 지켜낸 거예요. 불씨가 다시 살아났어요."
        relicId="ember1"
        relicType="ember"
        relicName="불씨 유물"
        relicEmoji="🔥"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={3}
      stageName="움막 화덕의 비밀"
      roleLabel="📜 부모: 논리 해독"
      bongiMessage="따뜻함은 늘 누군가 함께 지켜낸 거예요."
      hints={['공기길을 열어 불씨에게 바람이 닿게 해주세요.', '빈 칸 옆 타일만 움직일 수 있어요.']}
      bg="linear-gradient(180deg, #3A2A1A 0%, #4A3A2A 50%, #2A1A0A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #3A2A1A, #4A3A2A)' }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-6xl">🔥</span>
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-0 right-0 text-center"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-amber-400/60 text-xs" style={{ fontFamily: 'Noto Sans KR' }}>화덕 봉인이 감지되었어요</span>
            </motion.div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('sort')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            🔥 화덕 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'sort' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-orange-200 text-sm mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            🔍 아이가 관찰하고, 📜 부모가 순서를 정해주세요!
          </p>
          <p className="text-orange-300/60 text-xs mb-6" style={{ fontFamily: 'Noto Sans KR' }}>
            불이 살아나는 순서대로 정렬하세요
          </p>

          <div className="flex flex-col gap-2 mb-6 w-full max-w-xs">
            {sortItems.map((item, i) => (
              <motion.div
                key={item}
                layout
                className="py-3 px-4 rounded-xl bg-orange-500/10 border border-orange-400/20 flex justify-between items-center"
              >
                <span className="text-orange-100 text-sm" style={{ fontFamily: 'Noto Sans KR' }}>{item}</span>
                <div className="flex gap-1">
                  {i > 0 && (
                    <button
                      onClick={() => {
                        const n = [...sortItems];
                        [n[i], n[i - 1]] = [n[i - 1], n[i]];
                        setSortItems(n);
                      }}
                      className="w-7 h-7 rounded bg-orange-400/20 text-orange-200 text-xs"
                    >↑</button>
                  )}
                  {i < sortItems.length - 1 && (
                    <button
                      onClick={() => {
                        const n = [...sortItems];
                        [n[i], n[i + 1]] = [n[i + 1], n[i]];
                        setSortItems(n);
                      }}
                      className="w-7 h-7 rounded bg-orange-400/20 text-orange-200 text-xs"
                    >↓</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('slide')}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            다음 단계로!
          </motion.button>
        </div>
      )}

      {phase === 'slide' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-orange-200 text-sm mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            슬라이딩 패널을 밀어 공기길을 열어주세요!
          </p>

          <div className="grid grid-cols-3 gap-1.5 mb-6">
            {tiles.map((tile, idx) => (
              <motion.button
                key={idx}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => moveTile(idx)}
                className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center ${
                  tile === 0
                    ? 'bg-transparent'
                    : canMove(idx)
                      ? 'bg-orange-500/30 border-2 border-orange-400/50'
                      : 'bg-[#2A1A0A] border border-orange-400/10'
                }`}
                whileTap={tile !== 0 ? { scale: 0.95 } : {}}
              >
                {tile !== 0 && (
                  <>
                    <span className="text-2xl">{tileIcons[tile].emoji}</span>
                    <span className="text-[10px] text-orange-200/60 mt-1">{tileIcons[tile].name}</span>
                  </>
                )}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTiles(initialTiles)}
            className="px-6 py-2 rounded-full bg-[#2A1A0A] border border-orange-400/20 text-orange-200 text-sm"
            style={{ fontFamily: 'Noto Sans KR' }}
          >
            처음부터 다시
          </motion.button>
        </div>
      )}
    </StageWrapper>
  );
}
