import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';
import type { RuneType } from '../../context/GameContext';

// Stages 6-10 with unique mechanics
const stageData: Record<number, {
  title: string; subtitle: string; color: string; bgGrad: string;
  icon: string; instruction: string; bongiMsg: string; successMsg: string;
  relicType: RuneType; relicId: string;
}> = {
  6: {
    title: '돌목걸이 공방', subtitle: '스테이지 6', color: '#c9a84c', icon: '📿',
    bgGrad: 'linear-gradient(180deg, #faf4e8, #f0e8d4)',
    instruction: '돌 3개를 올바른 슬롯에 배치하세요', bongiMsg: '와, 이건 진짜 예뻐요.',
    successMsg: '이 목걸이는 마지막 열쇠가 될 거예요.', relicType: 'knot', relicId: 'r4',
  },
  7: {
    title: '그림자 나침반', subtitle: '스테이지 7', color: '#8a8a7a', icon: '🧭',
    bgGrad: 'linear-gradient(180deg, #f0efe8, #e0ddd4)',
    instruction: '그림자와 룬을 정렬하세요', bongiMsg: '이번엔 서로의 눈이 되어 주세요.',
    successMsg: '딱 맞았어요! 그림자가 길이 되었어요.', relicType: 'trail', relicId: 'r6',
  },
  8: {
    title: '도깨비 흔적 수색', subtitle: '스테이지 8', color: '#d4783c', icon: '🔍',
    bgGrad: 'linear-gradient(180deg, #f4f0e8, #e8e0d4)',
    instruction: '숨은 표식 3개를 찾으세요', bongiMsg: '좋아요, 이제 진짜 탐험가 같아요!',
    successMsg: '하나씩 찾으면 돼요.', relicType: 'ember', relicId: 'r7',
  },
  9: {
    title: '폭포의 수문', subtitle: '스테이지 9', color: '#4a9eb8', icon: '🌊',
    bgGrad: 'linear-gradient(180deg, #e8f0f4, #d4e0e8)',
    instruction: '타이밍에 맞춰 유물을 넣으세요', bongiMsg: '여기까지 왔다니, 정말 대단해요.',
    successMsg: '물길이 열리고 있어요!', relicType: 'wave', relicId: 'r9',
  },
  10: {
    title: '봉황의 보물고', subtitle: '최종 스테이지', color: '#c9a84c', icon: '🏆',
    bgGrad: 'linear-gradient(180deg, #1a3a2a, #2a4a3a)',
    instruction: '모든 유물을 올바른 슬롯에 배치하세요', bongiMsg: '여기까지 함께 와줘서 고마워요.',
    successMsg: '보물고가 여러분을 기다리고 있었어요.', relicType: 'knot', relicId: 'r10',
  },
};

// Stage 6: Necklace Craft (drag slots)
function NecklaceCraft({ onComplete }: { onComplete: () => void }) {
  const stones = [
    { id: 'blue', icon: '🔵', label: '하늘돌' },
    { id: 'green', icon: '🟢', label: '숲돌' },
    { id: 'amber', icon: '🟠', label: '호박돌' },
  ];
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [available, setAvailable] = useState(stones.map(s => s.id));

  const placeStone = (slotIdx: number) => {
    if (available.length === 0) return;
    const stone = available[0];
    const newSlots = [...slots];
    if (newSlots[slotIdx]) {
      setAvailable(a => [...a, newSlots[slotIdx]!]);
    }
    newSlots[slotIdx] = stone;
    setSlots(newSlots);
    setAvailable(a => a.filter(s => s !== stone));

    if (newSlots.every(s => s !== null)) {
      setTimeout(onComplete, 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Necklace frame */}
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path d="M20,10 Q100,100 180,10" fill="none" stroke="#c9a84c" strokeWidth="3" strokeDasharray="5 3" />
        </svg>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-around items-end pb-2">
          {slots.map((s, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => placeStone(i)}
              className="w-12 h-12 rounded-full flex items-center justify-center border-2"
              style={{
                background: s ? 'rgba(201,168,76,0.2)' : '#f0ebe3',
                borderColor: s ? '#c9a84c' : 'rgba(201,168,76,0.2)',
              }}
            >
              {s ? <span className="text-2xl">{stones.find(st => st.id === s)?.icon}</span> : <span className="text-xs text-[#c9a84c]">+</span>}
            </motion.button>
          ))}
        </div>
      </div>
      {/* Available stones */}
      <div className="flex gap-3">
        {stones.filter(s => available.includes(s.id)).map(s => (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)' }}>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <span className="text-xs text-[#6b4e3d]">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#8a8a7a] text-center">슬롯을 눌러 돌을 배치하세요</p>
    </div>
  );
}

// Stage 7: Shadow Align (tilt simulation)
function ShadowAlign({ onComplete }: { onComplete: () => void }) {
  const [angle, setAngle] = useState(0);
  const target = 45;
  const [holding, setHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);

  const isAligned = Math.abs(angle - target) < 8;

  const adjustAngle = (delta: number) => {
    setAngle(a => Math.max(-90, Math.min(90, a + delta)));
  };

  const startHold = () => {
    if (!isAligned) return;
    setHolding(true);
    const id = setInterval(() => {
      setHoldTime(t => {
        if (t >= 100) {
          clearInterval(id);
          onComplete();
          return 100;
        }
        return t + 3;
      });
    }, 30);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48">
        {/* Shadow */}
        <motion.div
          animate={{ rotate: angle }}
          className="absolute bottom-4 left-1/2 w-1 origin-bottom"
          style={{ height: 80, background: '#6b4e3d', marginLeft: -1 }}
        />
        {/* Target */}
        <div className="absolute bottom-4 left-1/2 w-0.5 origin-bottom opacity-30"
          style={{ height: 80, background: '#c9a84c', marginLeft: -1, transform: `rotate(${target}deg)` }} />
        {/* Center */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#6b4e3d]" />
      </div>

      <div className="flex gap-4">
        <button onClick={() => adjustAngle(-5)} className="w-14 h-14 rounded-full bg-[#f0ebe3] text-2xl">←</button>
        <motion.button
          onPointerDown={startHold}
          disabled={!isAligned}
          className="w-14 h-14 rounded-full flex items-center justify-center text-sm"
          style={{
            background: isAligned ? 'linear-gradient(135deg, #c9a84c, #e8d48c)' : '#e8e0d4',
            color: isAligned ? '#1a3a2a' : '#8a8a7a',
          }}
        >
          {holdTime > 0 ? `${holdTime}%` : '고정'}
        </motion.button>
        <button onClick={() => adjustAngle(5)} className="w-14 h-14 rounded-full bg-[#f0ebe3] text-2xl">→</button>
      </div>
      <p className="text-xs text-[#8a8a7a]">{isAligned ? '✨ 정렬됨! 고정 버튼을 길게 누르세요' : '그림자를 금색 선에 맞추세요'}</p>
    </div>
  );
}

// Stage 8: Hidden Trace Radar
function TraceRadar({ onComplete }: { onComplete: () => void }) {
  const [found, setFound] = useState<number[]>([]);
  const traces = [
    { x: 25, y: 30 }, { x: 70, y: 45 }, { x: 40, y: 75 },
  ];
  const [tapOrder, setTapOrder] = useState<number[]>([]);
  const [phase, setPhase] = useState<'search' | 'remember'>('search');

  const handleFind = (idx: number) => {
    if (found.includes(idx) || phase !== 'search') return;
    const newFound = [...found, idx];
    setFound(newFound);
    if (newFound.length === 3) {
      setTimeout(() => setPhase('remember'), 500);
    }
  };

  const handleRemember = (idx: number) => {
    const newOrder = [...tapOrder, idx];
    setTapOrder(newOrder);
    if (newOrder.length === 3) {
      // Check if order matches found order
      if (newOrder.every((o, i) => o === found[i])) {
        onComplete();
      } else {
        setTapOrder([]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2a3a2a, #1a2a1a)' }}>
        {/* Radar sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
          style={{ background: 'linear-gradient(90deg, #3d6b4e80, transparent)' }}
        />
        {/* Radar rings */}
        {[1, 2, 3].map(r => (
          <div key={r} className="absolute top-1/2 left-1/2 rounded-full border"
            style={{
              width: r * 80, height: r * 80,
              marginLeft: -r * 40, marginTop: -r * 40,
              borderColor: 'rgba(61,107,78,0.2)',
            }} />
        ))}
        {/* Traces */}
        {traces.map((t, i) => (
          <motion.button
            key={i}
            onClick={() => phase === 'search' ? handleFind(i) : handleRemember(i)}
            animate={found.includes(i) ? { scale: [1, 1.2, 1], opacity: 1 } : { opacity: [0.2, 0.5, 0.2] }}
            transition={found.includes(i) ? {} : { repeat: Infinity, duration: 2, delay: i * 0.5 }}
            className="absolute w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              left: `${t.x}%`, top: `${t.y}%`,
              transform: 'translate(-50%, -50%)',
              background: found.includes(i)
                ? tapOrder.includes(i) ? '#c9a84c' : '#d4783c'
                : 'rgba(212,120,60,0.3)',
            }}
          >
            <span className="text-lg">{found.includes(i) ? '✦' : '·'}</span>
          </motion.button>
        ))}
      </div>
      <p className="text-xs text-[#8a8a7a] text-center">
        {phase === 'search'
          ? `반짝이는 표식을 찾으세요 (${found.length}/3)`
          : `발견 순서대로 다시 탭하세요 (${tapOrder.length}/3)`}
      </p>
    </div>
  );
}

// Stage 9: Water Gate Timing
function WaterGate({ onComplete }: { onComplete: () => void }) {
  const [gateOpen, setGateOpen] = useState(false);
  const [placed, setPlaced] = useState(0);
  const target = 3;

  // Gate opens/closes periodically
  useEffect(() => {
    const id = setInterval(() => setGateOpen(g => !g), 2000);
    return () => clearInterval(id);
  }, []);

  const handlePlace = () => {
    if (!gateOpen) return;
    setPlaced(p => {
      const next = p + 1;
      if (next >= target) onComplete();
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Water gate visual */}
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #4a9eb830, #4a9eb810)' }}>
          {/* Gate */}
          <motion.div
            animate={{ height: gateOpen ? '20%' : '80%' }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0"
            style={{ background: 'linear-gradient(180deg, #6b4e3d, #8a6a50)' }}
          />
          {/* Status */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-sm" style={{ color: gateOpen ? '#3d6b4e' : '#d4783c' }}>
              {gateOpen ? '🌊 수문 열림!' : '⛔ 닫힘...'}
            </span>
          </div>
        </div>
      </div>

      {/* Place button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handlePlace}
        className="px-8 py-4 rounded-2xl text-lg"
        style={{
          background: gateOpen ? 'linear-gradient(135deg, #4a9eb8, #7bc4d4)' : '#e8e0d4',
          color: gateOpen ? '#fff' : '#8a8a7a',
        }}
      >
        유물 넣기 ({placed}/{target})
      </motion.button>
      <p className="text-xs text-[#8a8a7a]">수문이 열릴 때 타이밍에 맞춰 버튼을 누르세요</p>
    </div>
  );
}

// Stage 10: Final Treasure
function FinalTreasure({ onComplete }: { onComplete: () => void }) {
  const [locks, setLocks] = useState([false, false, false, false]);
  const [centralHold, setCentralHold] = useState(0);
  const [allLocked, setAllLocked] = useState(false);

  const toggleLock = (idx: number) => {
    const newLocks = [...locks];
    newLocks[idx] = !newLocks[idx];
    setLocks(newLocks);
    if (newLocks.every(Boolean)) setAllLocked(true);
  };

  const handleCentralHold = () => {
    if (!allLocked) return;
    const id = setInterval(() => {
      setCentralHold(p => {
        if (p >= 100) {
          clearInterval(id);
          onComplete();
          return 100;
        }
        return p + 2;
      });
    }, 30);
  };

  const runeIcons = ['〰', '🔆', '⟡', '∞'];
  const runeColors = ['#4a9eb8', '#d4783c', '#3d6b4e', '#c9a84c'];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-56 h-56">
        {/* 4 locks */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i * 90 - 45) * (Math.PI / 180);
          const r = 80;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              animate={locks[i] ? { boxShadow: `0 0 20px ${runeColors[i]}60` } : {}}
              onClick={() => toggleLock(i)}
              className="absolute w-14 h-14 rounded-full flex items-center justify-center border-2"
              style={{
                left: `calc(50% + ${Math.cos(angle) * r}px - 28px)`,
                top: `calc(50% + ${Math.sin(angle) * r}px - 28px)`,
                background: locks[i] ? `${runeColors[i]}20` : '#f0ebe3',
                borderColor: locks[i] ? runeColors[i] : 'rgba(26,58,42,0.15)',
              }}
            >
              <span className="text-xl" style={{ color: runeColors[i] }}>{runeIcons[i]}</span>
            </motion.button>
          );
        })}
        {/* Central seal */}
        <motion.div
          onPointerDown={handleCentralHold}
          animate={allLocked ? {
            boxShadow: ['0 0 20px rgba(201,168,76,0.3)', '0 0 40px rgba(201,168,76,0.6)', '0 0 20px rgba(201,168,76,0.3)'],
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: allLocked ? 'linear-gradient(135deg, #c9a84c, #e8d48c)' : '#e8e0d4',
          }}
        >
          <span className="text-3xl">{centralHold >= 100 ? '🏆' : '🐦'}</span>
        </motion.div>
      </div>
      {allLocked && centralHold < 100 && (
        <p className="text-xs text-[#c9a84c]">둘이 함께 봉황 봉인을 길게 누르세요! ({centralHold}%)</p>
      )}
      {!allLocked && (
        <p className="text-xs text-[#8a8a7a]">4개의 자물쇠를 모두 열어주세요 ({locks.filter(Boolean).length}/4)</p>
      )}
    </div>
  );
}

export function GenericStagePuzzle() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const num = Number(stageId);
  const { addRelic, obtainItem, clearStage, addRoute, setNecklace, addRoleSwap } = useGame();
  const [complete, setComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const data = stageData[num];

  useEffect(() => {
    if (!data) {
      navigate('/map');
    }
  }, [data, navigate]);

  if (!data) {
    return null;
  }

  const isStage10 = num === 10;
  const textColor = isStage10 ? '#e8d48c' : '#1a3a2a';
  const subColor = isStage10 ? '#b8c8b0' : '#6b7b6b';

  const handleComplete = () => {
    addRelic(data.relicType);
    obtainItem(data.relicId, num);
    clearStage(num - 1);
    addRoute(`stage${num}_complete`);
    if (num === 6) setNecklace(['blue', 'green', 'amber']);
    if (num === 7) addRoleSwap();
    setComplete(true);
  };

  const renderPuzzle = () => {
    switch (num) {
      case 6: return <NecklaceCraft onComplete={handleComplete} />;
      case 7: return <ShadowAlign onComplete={handleComplete} />;
      case 8: return <TraceRadar onComplete={handleComplete} />;
      case 9: return <WaterGate onComplete={handleComplete} />;
      case 10: return <FinalTreasure onComplete={handleComplete} />;
      default: return null;
    }
  };

  const stageHints: Record<number, string[]> = {
    6: ['슬롯을 눌러 돌을 하나씩 배치하세요', '3개 모두 채우면 완성!'],
    7: ['화살표로 그림자를 금색 선에 맞추세요', '정렬 후 고정 버튼을 길게 누르세요'],
    8: ['반짝이는 표식 3개를 먼저 찾으세요', '발견 순서대로 다시 탭하세요'],
    9: ['수문이 열릴 때 빠르게 버튼을 누르세요', '타이밍이 핵심이에요'],
    10: ['4개 자물쇠를 모두 활성화하세요', '봉황 봉인을 길게 누르세요'],
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: data.bgGrad }}>
      <GameHeader
        title={data.title}
        subtitle={data.subtitle}
        stageNum={num}
        accentColor={data.color}
        dark={isStage10}
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={stageHints[num] || ['주변을 잘 살펴보세요']}
      />

      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: `${data.color}15`, border: `1px solid ${data.color}30` }}>
          <span>{data.icon}</span>
          <p className="text-sm" style={{ color: isStage10 ? '#c8d8c0' : `${data.color}dd`, fontFamily: "'Noto Sans KR', sans-serif" }}>
            {complete ? data.successMsg : data.instruction}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        {!complete ? renderPuzzle() : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-center">
            <motion.div
              animate={{ boxShadow: [`0 0 30px ${data.color}40`, `0 0 60px ${data.color}80`, `0 0 30px ${data.color}40`] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `linear-gradient(135deg, ${data.color}, ${data.color}80)` }}
            >
              <span className="text-5xl">{num === 10 ? '🏆' : '✦'}</span>
            </motion.div>
            <p style={{ color: textColor, fontFamily: "'Noto Serif KR', serif" }}>
              {num === 10 ? '보물고가 열렸어요!' : '봉인이 해제되었어요!'}
            </p>
          </motion.div>
        )}
      </div>

      <div className="px-5 pb-6">
        {complete ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BongiBubble message={data.successMsg} />
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => navigate(num === 10 ? '/ending' : `/stage/${num}/clear`)}
              className="w-full py-4 rounded-2xl text-lg"
              style={{
                background: `linear-gradient(135deg, ${data.color}, ${data.color}aa)`,
                color: isStage10 ? '#1a3a2a' : '#fff',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
              {num === 10 ? '엔딩 보기' : '보상 확인하기'}
            </motion.button>
          </motion.div>
        ) : (
          <BongiBubble message={data.bongiMsg} delay={300} />
        )}
      </div>
    </div>
  );
}