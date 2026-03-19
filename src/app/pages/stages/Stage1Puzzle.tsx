import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { RuneToken } from '../../components/RuneToken';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';
import type { RuneType } from '../../context/GameContext';

// 지도 조각 맞추기 퍼즐
const GRID = 3;
const PIECES = Array.from({ length: GRID * GRID }, (_, i) => i);

export function Stage1Puzzle() {
  const navigate = useNavigate();
  const { addRelic, obtainItem, clearStage, addRoute } = useGame();
  const [pieces, setPieces] = useState(() => [...PIECES].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [runePhase, setRunePhase] = useState(false);
  const [selectedRune, setSelectedRune] = useState<RuneType | null>(null);
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const colors = ['#3d6b4e', '#4a9eb8', '#c9a84c', '#6b4e3d', '#d4783c', '#8a8a7a', '#c8956c', '#1a3a2a', '#e8d48c'];

  const handlePieceClick = useCallback((idx: number) => {
    if (solved || runePhase) return;
    if (selected === null) {
      setSelected(idx);
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[idx]] = [newPieces[idx], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);

      // Check if only last piece is wrong (to trigger rune phase)
      const correctCount = newPieces.filter((p, i) => p === i).length;
      if (correctCount >= GRID * GRID - 1) {
        setRunePhase(true);
      }
      if (newPieces.every((p, i) => p === i)) {
        setSolved(true);
        setRunePhase(true);
      }
    }
  }, [selected, pieces, solved, runePhase]);

  const handleRuneSelect = (type: RuneType) => {
    setSelectedRune(type);
    // Auto-complete the puzzle
    setPieces([...PIECES]);
    setSolved(true);
    setTimeout(() => {
      addRelic(type);
      obtainItem('r1', 1);
      clearStage(0);
      addRoute(`stage1_${type}`);
      setComplete(true);
    }, 800);
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #FAF6F0, #e8dcc0)' }}>
      {/* Header */}
      <GameHeader
        title="잠든 지도의 첫 장"
        subtitle="스테이지 1"
        stageNum={1}
        accentColor="#c9a84c"
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={['가장자리 문양의 색이 연결되는 순서를 찾아보세요', '숫자 순서대로 맞추면 돼요']}
      />

      {/* Puzzle instruction */}
      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span>🗺️</span>
          <p className="text-sm text-[#6b4e3d]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {runePhase && !complete
              ? '마지막 조각! 룬 토큰을 선택하세요'
              : complete
              ? '지도가 깨어났어요!'
              : '조각을 눌러 자리를 바꿔보세요'}
          </p>
        </div>
      </div>

      {/* Puzzle grid */}
      <div className="px-5 flex-1 flex flex-col items-center justify-center">
        <div className="rounded-2xl p-3 w-full max-w-[300px] aspect-square"
          style={{ background: 'rgba(107,78,61,0.1)', border: '2px solid rgba(107,78,61,0.15)' }}>
          <div className="grid grid-cols-3 gap-1.5 w-full h-full">
            {pieces.map((piece, idx) => {
              const isCorrect = piece === idx;
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: selected === idx ? 1.05 : 1,
                    borderColor: selected === idx ? '#c9a84c' : isCorrect && solved ? '#3d6b4e' : 'rgba(0,0,0,0)',
                  }}
                  onClick={() => handlePieceClick(idx)}
                  className="rounded-lg border-2 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colors[piece]}40, ${colors[piece]}20)`,
                  }}
                >
                  {/* Map pattern on each piece */}
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle at ${30 + piece * 10}% ${40 + piece * 8}%, ${colors[piece]}, transparent)`,
                    }} />
                  <span className="text-xs" style={{ color: colors[piece], opacity: 0.6 }}>
                    {solved && isCorrect ? '✦' : piece + 1}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Rune selection phase */}
        {runePhase && !complete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-[#6b4e3d] mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              룬 토큰을 비춰 마지막 봉인을 여세요
            </p>
            <div className="flex justify-center gap-3">
              {(['wave', 'ember', 'trail', 'knot'] as const).map(type => (
                <RuneToken
                  key={type}
                  type={type}
                  size="md"
                  selected={selectedRune === type}
                  onClick={() => handleRuneSelect(type)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom */}
      <div className="px-5 pb-6">
        {!complete && (
          <BongiBubble
            message={runePhase ? '둘이 함께 토큰을 골라보세요!' : '와, 지도가 반응했어요!'}
            delay={500}
          />
        )}

        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <BongiBubble message="첫 장이 깨어났어요. 정말 잘했어요!" />
            <div className="mt-3">
              <GoldButton onClick={() => navigate('/stage/1/clear')} fullWidth size="lg">
                보상 확인하기
              </GoldButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}