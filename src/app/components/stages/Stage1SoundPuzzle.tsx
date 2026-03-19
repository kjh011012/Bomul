import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const PADS = [
  { id: 0, color: '#60A5FA', label: '흐름', emoji: '💧' },
  { id: 1, color: '#34D399', label: '이끼', emoji: '🌿' },
  { id: 2, color: '#A78BFA', label: '안개', emoji: '🌫️' },
  { id: 3, color: '#F472B6', label: '바위', emoji: '🪨' },
];

export function Stage1SoundPuzzle() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'listen' | 'play' | 'memory' | 'clear'>('ar');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSequence = useCallback(() => {
    const seq = Array.from({ length: round + 2 }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    return seq;
  }, [round]);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setActiveIndex(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveIndex(null);
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (phase === 'listen') {
      const seq = generateSequence();
      setTimeout(() => playSequence(seq), 500);
    }
  }, [phase, round]);

  const handlePadTap = (id: number) => {
    if (isPlaying || phase !== 'play') return;
    const newInput = [...playerInput, id];
    setPlayerInput(newInput);
    setActiveIndex(id);
    setTimeout(() => setActiveIndex(null), 200);

    if (newInput.length === sequence.length) {
      const correct = newInput.every((v, i) => v === sequence[i]);
      if (correct) {
        if (round >= 2) {
          setPhase('memory');
        } else {
          setRound(r => r + 1);
          setPlayerInput([]);
          setTimeout(() => setPhase('listen'), 800);
        }
      } else {
        setPlayerInput([]);
        setTimeout(() => setPhase('listen'), 800);
      }
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={1}
        stageName="물길의 메아리 문"
        message="귀를 기울이면 길이 먼저 말을 걸어요. 이 봉인은 물소리에 반응해요."
        relicId="wave1"
        relicType="wave"
        relicName="물결 유물"
        relicEmoji="🌊"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={1}
      stageName="물길의 메아리 문"
      roleLabel="🔍 아이: 방향 찾기"
      bongiMessage="귀를 기울이면 길이 먼저 말을 걸어요."
      hints={['소리 순서를 기억하세요.', '아이가 방향을 듣고, 부모가 입력하세요.']}
      bg="linear-gradient(180deg, #0F2A3A 0%, #1A3A4A 50%, #1A2E1A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #0F2A3A, #1A3A4A)' }}
          >
            {/* Water ripple effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-40 h-40 rounded-full border border-blue-400/20"
                style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
                animate={{ scale: [0.5 + i * 0.3, 1 + i * 0.3], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🌊
              </motion.span>
            </div>

            <motion.div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-blue-500/80 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white">물결 감지</span>
            </motion.div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setPhase('listen'); }}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            🌊 메아리 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {(phase === 'listen' || phase === 'play') && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-blue-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            {phase === 'listen' ? '🎵 소리 순서를 기억하세요!' : '📜 부모님이 순서대로 눌러주세요!'}
          </p>
          <p className="text-blue-300/50 text-xs mb-8" style={{ fontFamily: 'Noto Sans KR' }}>
            라운드 {round}/2 · {sequence.length}개 순서
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {PADS.map(pad => (
              <motion.button
                key={pad.id}
                whileTap={{ scale: 0.9 }}
                animate={{
                  scale: activeIndex === pad.id ? 1.1 : 1,
                  boxShadow: activeIndex === pad.id ? `0 0 30px ${pad.color}80` : 'none',
                }}
                onClick={() => {
                  if (phase === 'listen' && !isPlaying) setPhase('play');
                  handlePadTap(pad.id);
                }}
                className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center border-2 transition-all"
                style={{
                  backgroundColor: activeIndex === pad.id ? pad.color + '40' : '#1A2E1A',
                  borderColor: activeIndex === pad.id ? pad.color : pad.color + '30',
                }}
              >
                <span className="text-3xl mb-1">{pad.emoji}</span>
                <span className="text-xs" style={{ color: pad.color, fontFamily: 'Noto Sans KR' }}>{pad.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-1">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${i < playerInput.length ? 'bg-blue-400' : 'bg-blue-400/20'}`}
              />
            ))}
          </div>
        </div>
      )}

      {phase === 'memory' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-blue-200 text-center mb-6" style={{ fontFamily: 'Noto Serif KR' }}>
            사라지는 물방울 문양을 기억하세요!
          </p>
          <MemoryMini onComplete={() => setPhase('clear')} />
        </div>
      )}
    </StageWrapper>
  );
}

function MemoryMini({ onComplete }: { onComplete: () => void }) {
  const symbols = ['💧', '🌀', '🫧'];
  const [showSymbols, setShowSymbols] = useState(true);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSymbols(false);
      setShuffled([...symbols].sort(() => Math.random() - 0.5));
    }, 3000);
  }, []);

  const handleSelect = (s: string) => {
    const newSel = [...selected, s];
    setSelected(newSel);
    if (newSel.length === 3) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <div>
      {showSymbols ? (
        <div className="flex gap-4">
          {symbols.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.5 }}
              className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center"
            >
              <span className="text-3xl">{s}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-blue-200/60 text-xs" style={{ fontFamily: 'Noto Sans KR' }}>순서대로 탭하세요!</p>
          <div className="flex gap-4">
            {shuffled.filter(s => !selected.includes(s)).map((s, i) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(s)}
                className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center"
              >
                <span className="text-3xl">{s}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
