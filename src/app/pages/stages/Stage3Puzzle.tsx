import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BongiBubble } from '../../components/BongiBubble';
import { GameHeader } from '../../components/GameHeader';
import { GoldButton } from '../../components/GoldButton';
import { HintModal } from '../../components/HintModal';

// 회전형 룰 다이얼 잠금장치
const TEXTURES = [
  { id: 'bark', label: '나무껍질', icon: '🌳', color: '#6b4e3d' },
  { id: 'stone', label: '돌', icon: '🪨', color: '#8a8a7a' },
  { id: 'leaf', label: '잎', icon: '🍃', color: '#3d6b4e' },
  { id: 'soil', label: '흙', icon: '🟤', color: '#a0785a' },
];

const CORRECT_ORDER = [2, 0, 3, 1]; // leaf, bark, soil, stone

export function Stage3Puzzle() {
  const navigate = useNavigate();
  const { addRelic, obtainItem, clearStage, addRoute } = useGame();
  const [dials, setDials] = useState([0, 0, 0, 0]);
  const [holdPhase, setHoldPhase] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [holdInterval, setHoldIntervalId] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const rotateDial = (idx: number) => {
    if (holdPhase || complete) return;
    const newDials = [...dials];
    newDials[idx] = (newDials[idx] + 1) % 4;
    setDials(newDials);

    // Check if correct
    if (newDials.every((d, i) => d === CORRECT_ORDER[i])) {
      setHoldPhase(true);
    }
  };

  const startHold = () => {
    if (!holdPhase || complete) return;
    const id = window.setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          window.clearInterval(id);
          addRelic('trail');
          obtainItem('r3', 3);
          clearStage(2);
          addRoute('stage3_texture');
          setComplete(true);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    setHoldIntervalId(id);
  };

  const endHold = () => {
    if (holdInterval) {
      window.clearInterval(holdInterval);
      setHoldIntervalId(null);
    }
    if (!complete) setHoldProgress(0);
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #f0f4e8, #e0e8d4)' }}>
      <GameHeader
        title="숲피부 자물쇠"
        subtitle="스테이지 3"
        stageNum={3}
        accentColor="#3d6b4e"
        showHint
        onHintPress={() => setShowHint(true)}
      />

      <HintModal
        show={showHint}
        onClose={() => setShowHint(false)}
        stageHints={['잎 → 나무껍질 → 흙 → 돌 순서로 다이얼을 맞춰보세요', '둘이 동시에 길게 누르세요']}
      />

      <div className="px-5 mb-4">
        <div className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: 'rgba(61,107,78,0.1)', border: '1px solid rgba(61,107,78,0.2)' }}>
          <span>🌿</span>
          <p className="text-sm text-[#3d6b4e]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {holdPhase && !complete
              ? '둘이 동시에 길게 눌러 자물쇠를 여세요!'
              : complete
              ? '숲이 여러분을 믿기 시작했어요!'
              : '🧒 아이가 느낀 재질을 👨‍👩‍👧 부모가 다이얼로 맞춰보세요'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 flex flex-col items-center justify-center">
        {!holdPhase ? (
          <>
            {/* Dial mechanism */}
            <div className="w-64 h-64 rounded-full relative flex items-center justify-center"
              style={{ background: 'radial-gradient(circle, #d8ccaa, #c8b890)', border: '4px solid #6b4e3d40', boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.1)' }}>

              {/* Center */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center z-10"
                style={{ background: 'linear-gradient(135deg, #6b4e3d, #8a6a50)', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                <span className="text-2xl">⛓</span>
              </div>

              {/* 4 dials */}
              {[0, 1, 2, 3].map(i => {
                const angle = (i * 90 - 45) * (Math.PI / 180);
                const r = 90;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                const tex = TEXTURES[dials[i]];
                const isCorrect = dials[i] === CORRECT_ORDER[i];

                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.9, rotate: 15 }}
                    onClick={() => rotateDial(i)}
                    className="absolute w-16 h-16 rounded-full flex flex-col items-center justify-center border-2"
                    style={{
                      left: `calc(50% + ${x}px - 32px)`,
                      top: `calc(50% + ${y}px - 32px)`,
                      background: isCorrect ? `${tex.color}30` : '#f0ebe3',
                      borderColor: isCorrect ? tex.color : 'rgba(107,78,61,0.2)',
                    }}
                  >
                    <span className="text-xl">{tex.icon}</span>
                    <span className="text-[9px]" style={{ color: tex.color, fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {tex.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Texture reference */}
            <div className="flex gap-3 mt-6">
              {TEXTURES.map(t => (
                <div key={t.id} className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ background: `${t.color}10` }}>
                  <span>{t.icon}</span>
                  <span className="text-[10px]" style={{ color: t.color }}>{t.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : !complete ? (
          /* Hold to unlock */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <p className="text-sm text-[#3d6b4e] mb-6 text-center" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              둘이 함께 아래 버튼을 길게 누르세요
            </p>
            <motion.div
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              className="w-40 h-40 rounded-full flex items-center justify-center relative cursor-pointer select-none"
              style={{
                background: 'linear-gradient(135deg, #3d6b4e, #6b9e7a)',
                boxShadow: `0 0 ${holdProgress / 2}px rgba(61,107,78,0.5)`,
              }}
            >
              <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e8d48c" strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - holdProgress / 100)}
                  strokeLinecap="round" />
              </svg>
              <span className="text-4xl">🤝</span>
            </motion.div>
            <p className="text-xs text-[#8a8a7a] mt-3">{Math.round(holdProgress)}%</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="text-6xl"
          >✦</motion.div>
        )}
      </div>

      <div className="px-5 pb-6">
        {complete ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BongiBubble message="정말 좋아요. 숲이 여러분을 조금 믿기 시작했어요." />
            <GoldButton onClick={() => navigate('/stage/3/clear')} fullWidth size="lg" variant="forest">
              보상 확인하기
            </GoldButton>
          </motion.div>
        ) : (
          <BongiBubble
            message={holdPhase ? '둘이 동시에 꾹 눌러주세요!' : '아이가 느낀 말이 열쇠예요.'}
            delay={300}
          />
        )}
      </div>
    </div>
  );
}