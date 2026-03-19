import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';

// 방향/메아리 추적 퍼즐 + 미로 탈출
const DIRECTIONS = [
  { label: '북쪽 숲길', icon: '🌲', angle: 0, type: 'trail' as const },
  { label: '동쪽 물길', icon: '🌊', angle: 90, type: 'wave' as const },
  { label: '남쪽 불꽃길', icon: '🔥', angle: 180, type: 'ember' as const },
];

export function Stage5Puzzle() {
  const navigate = useNavigate();
  const { addRelic, obtainItem, clearStage, addRoute } = useGame();
  const [phase, setPhase] = useState<'echo' | 'maze' | 'choose' | 'done'>('echo');
  const [echoActive, setEchoActive] = useState<number | null>(null);
  const [correctDir, setCorrectDir] = useState(0);
  const [echoRound, setEchoRound] = useState(0);
  const [mazePos, setMazePos] = useState({ x: 0, y: 0 });
  const [chosenPath, setChosenPath] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Echo animation
  useEffect(() => {
    if (phase !== 'echo') return;
    const correct = Math.floor(Math.random() * 3);
    setCorrectDir(correct);
    // Flash the correct direction
    const t = setTimeout(() => {
      setEchoActive(correct);
      setTimeout(() => setEchoActive(null), 1000);
    }, 500);
    return () => clearTimeout(t);
  }, [phase, echoRound]);

  const handleEchoSelect = (idx: number) => {
    if (idx === correctDir) {
      if (echoRound >= 2) {
        setPhase('maze');
      } else {
        setEchoRound(r => r + 1);
      }
    }
  };

  // Simple maze
  const MAZE_SIZE = 5;
  const walls = new Set(['1,0', '1,1', '3,1', '3,2', '1,3', '2,3']);
  const exit = { x: 4, y: 4 };

  const moveMaze = (dx: number, dy: number) => {
    const nx = mazePos.x + dx;
    const ny = mazePos.y + dy;
    if (nx < 0 || nx >= MAZE_SIZE || ny < 0 || ny >= MAZE_SIZE) return;
    if (walls.has(`${nx},${ny}`)) return;
    setMazePos({ x: nx, y: ny });
    if (nx === exit.x && ny === exit.y) {
      setPhase('choose');
    }
  };

  const handlePathChoice = (idx: number) => {
    setChosenPath(idx);
    const dir = DIRECTIONS[idx];
    addRelic(dir.type);
    obtainItem(idx === 0 ? 'r3' : idx === 1 ? 'r1' : 'r2', 5);
    clearStage(4);
    addRoute(`stage5_${dir.type}`);
    setComplete(true);
    setPhase('done');
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #f0f4e8, #e0e8d4)' }}>
      <GameHeader
        title="심마니의 외침"
        subtitle="스테이지 5"
        stageNum={5}
        accentColor="#3d6b4e"
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={['빛나는 방향을 잘 기억하세요', '미로에서 벽을 피해 출구로!']}
      />

      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: 'rgba(61,107,78,0.1)', border: '1px solid rgba(61,107,78,0.2)' }}>
          <span>{phase === 'echo' ? '👂' : phase === 'maze' ? '🏃' : '🔀'}</span>
          <p className="text-sm text-[#3d6b4e]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {phase === 'echo' ? '메아리가 울려오는 방향을 맞춰보세요'
              : phase === 'maze' ? '미로를 빠져나가세요!'
              : phase === 'choose' ? '어떤 길로 가시겠어요?'
              : '길이 열렸어요!'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        {phase === 'echo' && (
          <div className="relative w-64 h-64">
            {/* Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6b4e3d, #8a6a50)' }}>
              <span className="text-2xl">👤</span>
            </div>
            {/* Directions */}
            {DIRECTIONS.map((dir, i) => {
              const angle = (i * 120 - 90) * (Math.PI / 180);
              const r = 100;
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  animate={echoActive === i ? {
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0px transparent', '0 0 30px rgba(201,168,76,0.5)', '0 0 0px transparent'],
                  } : {}}
                  onClick={() => handleEchoSelect(i)}
                  className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center border-2"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * r}px - 32px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 32px)`,
                    background: echoActive === i ? 'linear-gradient(135deg, #c9a84c, #e8d48c)' : '#f0ebe3',
                    borderColor: echoActive === i ? '#c9a84c' : 'rgba(26,58,42,0.15)',
                  }}
                >
                  <span className="text-xl">{dir.icon}</span>
                  <span className="text-[8px]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{dir.label}</span>
                </motion.button>
              );
            })}
            {/* Echo rings */}
            {echoActive !== null && (
              <>
                {[0, 1, 2].map(ring => (
                  <motion.div
                    key={ring}
                    initial={{ scale: 0.3, opacity: 0.6 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, delay: ring * 0.3 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2"
                    style={{ borderColor: 'rgba(201,168,76,0.3)' }}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {phase === 'maze' && (
          <div>
            <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${MAZE_SIZE}, 48px)` }}>
              {Array.from({ length: MAZE_SIZE }).map((_, y) =>
                Array.from({ length: MAZE_SIZE }).map((_, x) => {
                  const isWall = walls.has(`${x},${y}`);
                  const isPlayer = mazePos.x === x && mazePos.y === y;
                  const isExit = x === exit.x && y === exit.y;
                  return (
                    <div key={`${x}-${y}`} className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: isWall ? '#6b4e3d' : isPlayer ? '#c9a84c' : isExit ? '#3d6b4e40' : '#f0ebe3',
                        border: isExit ? '2px dashed #3d6b4e' : '1px solid rgba(0,0,0,0.05)',
                      }}>
                      {isPlayer && <span className="text-lg">🏃</span>}
                      {isExit && !isPlayer && <span className="text-lg">🚪</span>}
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <button onClick={() => moveMaze(0, -1)} className="w-12 h-12 rounded-lg bg-[#3d6b4e20] text-lg">↑</button>
              <div className="flex gap-1">
                <button onClick={() => moveMaze(-1, 0)} className="w-12 h-12 rounded-lg bg-[#3d6b4e20] text-lg">←</button>
                <div className="w-12 h-12" />
                <button onClick={() => moveMaze(1, 0)} className="w-12 h-12 rounded-lg bg-[#3d6b4e20] text-lg">→</button>
              </div>
              <button onClick={() => moveMaze(0, 1)} className="w-12 h-12 rounded-lg bg-[#3d6b4e20] text-lg">↓</button>
            </div>
          </div>
        )}

        {phase === 'choose' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
            <p className="text-center text-sm text-[#6b4e3d] mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              세 갈래 길 중 하나를 선택하세요.<br/>어떤 길이든, 여러분의 길이 될 수 있어요.
            </p>
            {DIRECTIONS.map((dir, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePathChoice(i)}
                className="w-full p-4 rounded-xl flex items-center gap-4 border-2 text-left"
                style={{ background: '#fff', borderColor: 'rgba(26,58,42,0.1)' }}
              >
                <span className="text-3xl">{dir.icon}</span>
                <div>
                  <p className="text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>{dir.label}</p>
                  <p className="text-xs text-[#8a8a7a]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {i === 0 ? '추적과 관찰의 길' : i === 1 ? '직감과 흐름의 길' : '용기와 돌파의 길'}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {phase === 'done' && chosenPath !== null && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-center">
            <span className="text-6xl block mb-4">{DIRECTIONS[chosenPath].icon}</span>
            <p className="text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>{DIRECTIONS[chosenPath].label}을 선택했어요!</p>
          </motion.div>
        )}
      </div>

      <div className="px-5 pb-6">
        {complete ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BongiBubble message="어떤 길이든, 여러분의 길이 될 수 있어요." />
            <GoldButton onClick={() => navigate('/stage/5/clear')} fullWidth size="lg" variant="forest">
              보상 확인하기
            </GoldButton>
          </motion.div>
        ) : (
          <BongiBubble message={phase === 'echo' ? '이번엔 조금 더 모험해볼까요?' : '서두르지 않아도 괜찮아요.'} delay={300} />
        )}
      </div>
    </div>
  );
}