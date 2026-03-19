import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { SealIcon } from '../components/SealIcon';
import { ChestProgressRing } from '../components/ChestProgressRing';
import { GoldButton } from '../components/GoldButton';
import { Backpack } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const stageNames = [
  '잠든 지도의 첫 장', '물길의 메아리 문', '숲피부 자물쇠',
  '움막 화덕의 비밀', '심마니의 외침', '돌목걸이 공방',
  '그림자 나침반', '도깨비 흔적 수색', '폭포의 수문', '봉황의 보물고',
];

const stageHints = [
  '첫 표식이 기다리는 곳', '물이 먼저 말을 거는 곳', '손끝이 먼저 기억하는 곳',
  '따뜻함이 남아 있는 숨은 자리', '메아리가 갈라지는 곳', '돌과 빛이 만나는 자리',
  '그림자가 길게 눕는 자리', '흔적이 숨어 있는 넓은 터', '물길이 모이는 큰 문 앞',
  '봉황이 잠든 마지막 봉인',
];

const sealPositions = [
  { x: 45, y: 12 }, { x: 20, y: 22 }, { x: 72, y: 20 },
  { x: 35, y: 35 }, { x: 62, y: 40 }, { x: 22, y: 52 },
  { x: 74, y: 54 }, { x: 48, y: 62 }, { x: 30, y: 76 },
  { x: 52, y: 90 },
];

export function MapPage() {
  const navigate = useNavigate();
  const { state } = useGame();

  const nextStage = state.stagesCleared.findIndex(c => !c);
  const currentStage = nextStage === -1 ? 9 : nextStage;
  const allCleared = state.stagesCleared.every(Boolean);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: '#FAF6F0' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between relative z-10">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 mb-0.5"
          >
            <span className="text-xs">✦</span>
            <p className="text-xs text-[#c9a84c] tracking-wide" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {state.teamName || '탐험단'}
            </p>
          </motion.div>
          <h2 className="text-lg text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            보물지도
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/inventory')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(26,58,42,0.04)',
              border: '1px solid rgba(26,58,42,0.06)',
            }}
          >
            <Backpack size={18} color="#6b4e3d" />
          </motion.button>
          <ChestProgressRing progress={state.chestProgress} size={52} />
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative mx-3 mb-3 rounded-2xl overflow-hidden border"
        style={{
          borderColor: 'rgba(107,78,61,0.2)',
          boxShadow: '0 4px 24px rgba(107,78,61,0.08), inset 0 2px 20px rgba(107,78,61,0.08)',
        }}>

        {/* Map background image */}
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1618385418700-35dc948cdeec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdHJlYXN1cmUlMjBtYXAlMjB2aW50YWdlJTIwcGFyY2htZW50fGVufDF8fHx8MTc3Mzg1MDgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Treasure map"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Parchment overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #e8dcc0cc, #d8ccaacc, #c8b890cc)',
        }} />

        {/* Paper grain texture */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Decorative compass rose */}
        <motion.div
          className="absolute top-4 right-4 opacity-15"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        >
          <span className="text-4xl">🧭</span>
        </motion.div>

        {/* Connecting paths */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
          {sealPositions.slice(0, -1).map((pos, i) => {
            const next = sealPositions[i + 1];
            const cleared = state.stagesCleared[i];
            return (
              <motion.line
                key={i}
                x1={`${pos.x}%`} y1={`${pos.y}%`}
                x2={`${next.x}%`} y2={`${next.y}%`}
                stroke={cleared ? '#c9a84c' : '#8a7a6a'}
                strokeWidth={cleared ? 2.5 : 1}
                strokeDasharray={cleared ? '0' : '5 4'}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.08 }}
              />
            );
          })}
        </svg>

        {/* Seal icons */}
        {sealPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 200 }}
          >
            <SealIcon
              index={i}
              cleared={state.stagesCleared[i]}
              active={i === currentStage}
              label={stageNames[i]}
              onClick={() => {
                if (i <= currentStage) navigate(`/stage/${i + 1}`);
              }}
            />
          </motion.div>
        ))}

        {/* Central treasure chest silhouette */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <span className="text-6xl" style={{
            filter: `blur(${Math.max(0, 4 - state.chestProgress / 25)}px)`,
            opacity: 0.12 + state.chestProgress / 200,
          }}>
            📦
          </span>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="px-5 pb-5"
      >
        <div className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: 'linear-gradient(145deg, rgba(201,168,76,0.06), rgba(201,168,76,0.12))',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-xl">🐦</span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#6b4e3d] truncate" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {allCleared ? '모든 봉인이 열렸어요!' : (
                <>다음: <span style={{ color: '#c9a84c' }}>{stageHints[currentStage]}</span></>
              )}
            </p>
          </div>
          <GoldButton
            onClick={() => allCleared ? navigate('/ending') : navigate(`/stage/${currentStage + 1}`)}
            size="sm"
          >
            {allCleared ? '엔딩' : '출발!'}
          </GoldButton>
        </div>
      </motion.div>
    </div>
  );
}
