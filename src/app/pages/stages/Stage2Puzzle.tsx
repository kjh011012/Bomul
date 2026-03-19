import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';

// 소리 기억 패드 퍼즐
const PAD_COLORS = ['#4a9eb8', '#3d6b4e', '#d4783c', '#c9a84c'];
const PAD_LABELS = ['물방울', '바람', '새소리', '돌소리'];

export function Stage2Puzzle() {
  const navigate = useNavigate();
  const { addRelic, obtainItem, clearStage, addRoute } = useGame();
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<'watch' | 'play' | 'memory' | 'done'>('watch');
  const [memoryIcons, setMemoryIcons] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<boolean[]>([]);
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Generate sequence
  useEffect(() => {
    const seq = Array.from({ length: 3 + round }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    playSequence(seq);
  }, [round]);

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    setPhase('watch');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActivePad(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActivePad(null);
    }
    setIsPlaying(false);
    setPhase('play');
    setPlayerSeq([]);
  };

  const handlePadPress = useCallback((idx: number) => {
    if (isPlaying || phase !== 'play') return;
    setActivePad(idx);
    setTimeout(() => setActivePad(null), 200);

    const newSeq = [...playerSeq, idx];
    setPlayerSeq(newSeq);

    // Check
    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      // Wrong - but friendly
      setPlayerSeq([]);
      playSequence(sequence);
      return;
    }

    if (newSeq.length === sequence.length) {
      if (round < 3) {
        setRound(r => r + 1);
      } else {
        // Move to memory mini-game
        setPhase('memory');
        const icons = ['💧', '🌿', '🪨'];
        const shuffled = [...icons, ...icons].sort(() => Math.random() - 0.5);
        setMemoryIcons(shuffled);
        setMemoryFlipped(Array(6).fill(false));
      }
    }
  }, [isPlaying, phase, playerSeq, sequence, round]);

  // Memory mini-game
  const [memoryFirst, setMemoryFirst] = useState<number | null>(null);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  const handleMemoryFlip = (idx: number) => {
    if (memoryFlipped[idx] || memoryMatched.includes(idx)) return;
    const newFlipped = [...memoryFlipped];
    newFlipped[idx] = true;
    setMemoryFlipped(newFlipped);

    if (memoryFirst === null) {
      setMemoryFirst(idx);
    } else {
      if (memoryIcons[memoryFirst] === memoryIcons[idx]) {
        setMemoryMatched(m => [...m, memoryFirst, idx]);
        setMemoryFirst(null);
        if (memoryMatched.length + 2 === 6) {
          // All matched!
          setTimeout(() => {
            addRelic('wave');
            obtainItem('r5', 2);
            clearStage(1);
            addRoute('stage2_wave');
            setComplete(true);
            setPhase('done');
          }, 500);
        }
      } else {
        setTimeout(() => {
          const reset = [...memoryFlipped];
          reset[memoryFirst!] = false;
          reset[idx] = false;
          setMemoryFlipped(reset);
          setMemoryFirst(null);
        }, 800);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #e8f4f8, #d4e8f0)' }}>
      <GameHeader
        title="물길의 메아리 문"
        subtitle="스테이지 2"
        stageNum={2}
        accentColor="#4a9eb8"
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={['소리 순서를 잘 기억하세요. 빛나는 패드를 주목!', '같은 문양끼리 짝을 맞추세요']}
      />

      {/* Instruction */}
      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: 'rgba(74,158,184,0.1)', border: '1px solid rgba(74,158,184,0.2)' }}>
          <span>🌊</span>
          <p className="text-sm text-[#3a7a8a]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {phase === 'watch' ? '소리 순서를 기억하세요...'
              : phase === 'play' ? '같은 순서로 눌러보세요!'
              : phase === 'memory' ? '사라지는 물방울 문양을 맞춰보세요'
              : '봉인이 열렸어요!'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        {phase !== 'memory' && phase !== 'done' ? (
          /* Sound pads */
          <div className="grid grid-cols-2 gap-4 w-full max-w-[280px]">
            {PAD_COLORS.map((color, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: activePad === i ? 1.08 : 1,
                  opacity: activePad === i ? 1 : 0.7,
                  boxShadow: activePad === i ? `0 0 30px ${color}60` : '0 0 0px transparent',
                }}
                onClick={() => handlePadPress(i)}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2"
                style={{
                  background: `linear-gradient(135deg, ${color}30, ${color}15)`,
                  borderColor: activePad === i ? color : `${color}30`,
                }}
              >
                <motion.div
                  animate={activePad === i ? { scale: [1, 1.3, 1] } : {}}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${color}25` }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ background: color }} />
                </motion.div>
                <span className="text-xs" style={{ color, fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {PAD_LABELS[i]}
                </span>
              </motion.button>
            ))}
          </div>
        ) : phase === 'memory' ? (
          /* Memory mini-game */
          <div>
            <p className="text-center text-sm text-[#3a7a8a] mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              같은 문양끼리 짝을 맞춰보세요
            </p>
            <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
              {memoryIcons.map((icon, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  animate={memoryMatched.includes(i) ? { scale: 0.95, opacity: 0.5 } : {}}
                  onClick={() => handleMemoryFlip(i)}
                  className="aspect-square rounded-xl flex items-center justify-center border-2"
                  style={{
                    background: memoryFlipped[i] || memoryMatched.includes(i)
                      ? 'linear-gradient(135deg, #4a9eb820, #4a9eb810)'
                      : 'linear-gradient(135deg, #d4e8f0, #c4d8e0)',
                    borderColor: memoryFlipped[i] ? '#4a9eb8' : 'rgba(74,158,184,0.2)',
                  }}
                >
                  <span className="text-3xl">
                    {memoryFlipped[i] || memoryMatched.includes(i) ? icon : '?'}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Progress indicator */}
        {phase === 'play' && (
          <div className="flex gap-2 mt-6">
            {sequence.map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full"
                style={{ background: i < playerSeq.length ? '#4a9eb8' : 'rgba(74,158,184,0.2)' }} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="px-5 pb-6">
        {!complete ? (
          <BongiBubble
            message={phase === 'watch' ? '귀를 기울이면 길이 먼저 말을 걸어요.' : '좋아요, 이 봉인은 물소리에 반응해요.'}
            delay={300}
          />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BongiBubble message="물길이 열렸어요! 다음 봉인이 기다리고 있어요." />
            <GoldButton onClick={() => navigate('/stage/2/clear')} fullWidth size="lg" variant="water">
              보상 확인하기
            </GoldButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}