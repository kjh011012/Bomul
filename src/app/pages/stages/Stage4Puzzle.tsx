import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';

// 슬라이딩 패널 퍼즐 - 공기길을 열어 불씨 살리기
const GRID_SIZE = 4;
type Cell = 'empty' | 'block' | 'air' | 'ember';

const initialGrid: Cell[][] = [
  ['block', 'air', 'block', 'block'],
  ['block', 'block', 'air', 'block'],
  ['air', 'block', 'block', 'air'],
  ['block', 'air', 'block', 'ember'],
];

const solvedGrid: Cell[][] = [
  ['air', 'air', 'block', 'block'],
  ['block', 'air', 'block', 'block'],
  ['block', 'air', 'air', 'block'],
  ['block', 'block', 'air', 'ember'],
];

export function Stage4Puzzle() {
  const navigate = useNavigate();
  const { addRelic, obtainItem, clearStage, addRoute } = useGame();
  const [grid, setGrid] = useState<Cell[][]>(initialGrid.map(r => [...r]));
  const [orderPhase, setOrderPhase] = useState(false);
  const [orderItems] = useState(['🔥', '💨', '🌡️', '🪨']);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const correctOrder = ['💨', '🔥', '🌡️', '🪨']; // air, fire, warmth, ash
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const toggleCell = useCallback((r: number, c: number) => {
    if (orderPhase || complete) return;
    if (grid[r][c] === 'ember') return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === 'air' ? 'block' : 'air';
    setGrid(newGrid);

    // Check if air path exists from top to ember
    // Simplified: check if there's a connected path of 'air' cells
    const airCount = newGrid.flat().filter(c => c === 'air').length;
    if (airCount >= 5) {
      setOrderPhase(true);
    }
  }, [grid, orderPhase, complete]);

  const addToOrder = (item: string) => {
    if (userOrder.includes(item)) return;
    const newOrder = [...userOrder, item];
    setUserOrder(newOrder);

    if (newOrder.length === 4) {
      const isCorrect = newOrder.every((o, i) => o === correctOrder[i]);
      if (isCorrect) {
        addRelic('ember');
        obtainItem('r2', 4);
        clearStage(3);
        addRoute('stage4_fire');
        setComplete(true);
      } else {
        setTimeout(() => setUserOrder([]), 500);
      }
    }
  };

  const cellColor = (cell: Cell) => {
    switch (cell) {
      case 'air': return 'linear-gradient(135deg, rgba(212,120,60,0.15), rgba(212,120,60,0.05))';
      case 'block': return 'linear-gradient(135deg, #8a7a6a, #6b5a4a)';
      case 'ember': return 'linear-gradient(135deg, #d4783c, #e8a060)';
      default: return '#f0ebe3';
    }
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #f4efe8, #e8dcd0)' }}>
      <GameHeader
        title="움막 화덕의 비밀"
        subtitle="스테이지 4"
        stageNum={4}
        accentColor="#d4783c"
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={['공기길을 충분히 만든 후 바람→불→온기→재 순서!', '블록 5개 이상을 공기칸으로 바꾸세요']}
      />

      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: 'rgba(212,120,60,0.1)', border: '1px solid rgba(212,120,60,0.2)' }}>
          <span>🔥</span>
          <p className="text-sm text-[#a05a30]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {orderPhase && !complete
              ? '불씨·연기·온기·재의 순서를 맞춰보세요'
              : complete
              ? '불씨가 다시 살아났어요!'
              : '블록을 눌러 공기길을 열어 불씨를 살려보세요'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        {!orderPhase ? (
          <>
            {/* Sliding grid */}
            <div className="w-full max-w-[280px] rounded-2xl p-3"
              style={{ background: 'rgba(107,78,61,0.15)', border: '2px solid rgba(107,78,61,0.2)' }}>
              <div className="grid grid-cols-4 gap-2">
                {grid.map((row, r) => row.map((cell, c) => (
                  <motion.button
                    key={`${r}-${c}`}
                    whileTap={{ scale: 0.9 }}
                    animate={cell === 'ember' ? {
                      boxShadow: ['0 0 10px rgba(212,120,60,0.3)', '0 0 20px rgba(212,120,60,0.6)', '0 0 10px rgba(212,120,60,0.3)']
                    } : {}}
                    transition={cell === 'ember' ? { repeat: Infinity, duration: 1.5 } : {}}
                    onClick={() => toggleCell(r, c)}
                    className="aspect-square rounded-lg flex items-center justify-center"
                    style={{ background: cellColor(cell) }}
                  >
                    {cell === 'ember' && <span className="text-xl">🔥</span>}
                    {cell === 'air' && <span className="text-xs opacity-40">〰</span>}
                  </motion.button>
                )))}
              </div>
            </div>
            <p className="text-xs text-[#8a8a7a] mt-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              어두운 블록을 눌러 공기길(밝은 칸)으로 바꾸세요
            </p>
          </>
        ) : !complete ? (
          /* Order puzzle */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[280px]">
            <div className="flex gap-2 mb-6 justify-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-xl flex items-center justify-center border-2"
                  style={{
                    background: userOrder[i] ? 'rgba(212,120,60,0.1)' : '#f0ebe3',
                    borderColor: userOrder[i] ? '#d4783c' : 'rgba(107,78,61,0.1)',
                  }}>
                  <span className="text-2xl">{userOrder[i] || ''}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              {orderItems.map(item => (
                <motion.button
                  key={item}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addToOrder(item)}
                  disabled={userOrder.includes(item)}
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all"
                  style={{
                    background: userOrder.includes(item) ? '#e8e0d440' : '#f0ebe3',
                    borderColor: userOrder.includes(item) ? 'rgba(0,0,0,0)' : '#d4783c40',
                    opacity: userOrder.includes(item) ? 0.3 : 1,
                  }}
                >
                  <span className="text-2xl">{item}</span>
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-center text-[#8a8a7a] mt-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              💡 바람이 먼저, 불이 다음... 무엇이 남을까?
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <motion.div
              animate={{ boxShadow: ['0 0 30px rgba(212,120,60,0.3)', '0 0 60px rgba(212,120,60,0.6)', '0 0 30px rgba(212,120,60,0.3)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4783c, #e8a060)' }}
            >
              <span className="text-5xl">🔥</span>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="px-5 pb-6">
        {complete ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BongiBubble message="따뜻함은 늘 누군가 함께 지켜낸 거예요." />
            <GoldButton onClick={() => navigate('/stage/4/clear')} fullWidth size="lg" variant="ember">
              보상 확인하기
            </GoldButton>
          </motion.div>
        ) : (
          <BongiBubble message={orderPhase ? '순서가 중요해요. 천천히 생각해보세요.' : '화덕 속 봉인이 숨을 쉬고 있어요.'} delay={300} />
        )}
      </div>
    </div>
  );
}