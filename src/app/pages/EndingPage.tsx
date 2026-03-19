import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { ParticleField } from '../components/ParticleField';
import { GoldButton } from '../components/GoldButton';
import type { EndingType } from '../context/GameContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const endingData: Record<EndingType, {
  title: string; subtitle: string; bg: string; textColor: string;
  icon: string; description: string; memory: string; image: string;
}> = {
  forest_listener: {
    title: '숲을 듣는 가족', subtitle: '자연의 소리에 귀 기울인 여정',
    bg: 'linear-gradient(180deg, #0d1f16, #1a3a2a, #2a5a3a)',
    textColor: '#b8e8b0', icon: '🌿',
    description: '여러분은 숲의 속삭임을 가장 먼저 알아들은 가족이에요.',
    memory: '발자국과 관찰의 기운이 강했어요.',
    image: 'https://images.unsplash.com/photo-1545828363-51ed76c86636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMEtvcmVhbiUyMGZvcmVzdCUyMG1vcm5pbmclMjBtaXN0JTIwdHJhaWx8ZW58MXx8fHwxNzczODUwODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  path_weaver: {
    title: '길을 잇는 가족', subtitle: '모든 갈래�� 하나로 연결한 여정',
    bg: 'linear-gradient(180deg, #1a2a10, #2a4a20, #4a6a3a)',
    textColor: '#d4e8b0', icon: '🛤️',
    description: '여러분은 흩어진 길을 하나로 이어낸 가족이에요.',
    memory: '직감과 추적이 조화를 이뤘어요.',
    image: 'https://images.unsplash.com/photo-1769291632684-ddc42137875d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5saWdodCUyMGZvcmVzdCUyMGNhbm9weSUyMG1hZ2ljYWx8ZW58MXx8fHwxNzczODUwODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  wave_guardian: {
    title: '물결의 수호자', subtitle: '물의 흐름을 따라간 여정',
    bg: 'linear-gradient(180deg, #0d1a2a, #1a3a4a, #3a6a7a)',
    textColor: '#b0d8e8', icon: '🌊',
    description: '여러분은 물길의 메아리를 따라 보물을 찾아낸 가족이에요.',
    memory: '물결 유물의 기운이 가장 강했어요.',
    image: 'https://images.unsplash.com/photo-1752487650659-3bef7f38f2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBjYXNjYWRlJTIwcm9ja3MlMjBuYXR1cmUlMjBzdHJlYW18ZW58MXx8fHwxNzczODUwODM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  ember_pioneer: {
    title: '불씨의 개척자', subtitle: '용기로 길을 밝힌 여정',
    bg: 'linear-gradient(180deg, #1a1008, #3a2a1a, #6a3a1a)',
    textColor: '#e8ccb0', icon: '🔥',
    description: '여러분은 꺼져가는 불씨를 다시 살려낸 가족이에요.',
    memory: '불씨 유물과 용기의 기운이 넘쳤어요.',
    image: 'https://images.unsplash.com/photo-1761140623139-840b6f04a3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZmlyZSUyMHdhcm0lMjBuaWdodCUyMGZvcmVzdCUyMGVtYmVyc3xlbnwxfHx8fDE3NzM4NTA4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  knot_treasure: {
    title: '매듭의 보물단', subtitle: '협동으로 모든 것을 연결한 여정',
    bg: 'linear-gradient(180deg, #1a1a08, #3a3010, #6a5a20)',
    textColor: '#f0e8c0', icon: '🪢',
    description: '여러분은 가장 단단한 매듭으로 보물을 지켜낸 가족이에요.',
    memory: '매듭과 협동의 기운이 가장 강했어요.',
    image: 'https://images.unsplash.com/photo-1676480166342-2902ebf81c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwc3RvbmUlMjBydWlucyUyMG1vc3MlMjBjb3ZlcmVkJTIwdGVtcGxlfGVufDF8fHx8MTc3Mzg1MDgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  phoenix_guide: {
    title: '봉황의 길잡이', subtitle: '봉이의 빛을 따라간 여정',
    bg: 'linear-gradient(180deg, #1a1008, #2a2010, #4a3a20)',
    textColor: '#f0e8d0', icon: '🐦',
    description: '여러분은 봉황의 길을 끝까지 따라간 가족이에요.',
    memory: '봉이와 함께한 순간이 가장 빛났어요.',
    image: 'https://images.unsplash.com/photo-1769291632684-ddc42137875d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5saWdodCUyMGZvcmVzdCUyMGNhbm9weSUyMG1hZ2ljYWx8ZW58MXx8fHwxNzczODUwODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  balance_heir: {
    title: '균형의 후계자', subtitle: '모든 기운을 고르게 모은 여정',
    bg: 'linear-gradient(180deg, #0d1a1a, #1a3a3a, #3a5a4a)',
    textColor: '#c8e8d0', icon: '⚖️',
    description: '여러분은 물, 불, 땅, 바람을 모두 품은 균형의 가족이에요.',
    memory: '모든 유물이 고르게 빛났어요.',
    image: 'https://images.unsplash.com/photo-1545828363-51ed76c86636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMEtvcmVhbiUyMGZvcmVzdCUyMG1vcm5pbmclMjBtaXN0JTIwdHJhaWx8ZW58MXx8fHwxNzczODUwODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  family_guard: {
    title: '가족 수호단', subtitle: '서로를 지키며 나아간 여정',
    bg: 'linear-gradient(180deg, #1a0d0d, #3a2a2a, #5a4a3a)',
    textColor: '#f0dcc0', icon: '🛡️',
    description: '여러분은 서로의 힘으로 모든 봉인을 열어낸 가족이에요.',
    memory: '역할 교환과 협동의 순간이 특별했어요.',
    image: 'https://images.unsplash.com/photo-1676480166342-2902ebf81c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwc3RvbmUlMjBydWlucyUyMG1vc3MlMjBjb3ZlcmVkJTIwdGVtcGxlfGVufDF8fHx8MTc3Mzg1MDgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  hidden_1: {
    title: '전설의 수호자', subtitle: '숨은 엔딩',
    bg: 'linear-gradient(180deg, #0d0d1a, #1a1a2a, #2a2a4a)',
    textColor: '#c0c0e0', icon: '✨',
    description: '힌트 없이 균형 있게 모든 봉인을 푼 전설의 가족!',
    memory: '모든 기운이 완벽하게 조화를 이뤘어요.',
    image: 'https://images.unsplash.com/photo-1735886158689-f55047c15452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMGZpcmV3b3JrcyUyMGdvbGRlbiUyMHNwYXJrbGUlMjBjb25mZXR0aXxlbnwxfHx8fDE3NzM4NTA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  hidden_2: {
    title: '완벽한 동반자', subtitle: '숨은 엔딩',
    bg: 'linear-gradient(180deg, #1a0d1a, #2a1a2a, #4a2a3a)',
    textColor: '#e0c0d0', icon: '💫',
    description: '최고의 협동과 역할 교환을 완수한 완벽한 팀!',
    memory: '둘의 호흡이 완벽했어요.',
    image: 'https://images.unsplash.com/photo-1712280801139-b045c71aa8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0cmVhc3VyZSUyMGNoZXN0JTIwamV3ZWxzJTIwZ2xvd2luZ3xlbnwxfHx8fDE3NzM4NTA4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
};

export function EndingPage() {
  const navigate = useNavigate();
  const { state, calculateEnding } = useGame();
  const ending = calculateEnding();
  const data = endingData[ending];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background image */}
      <ImageWithFallback
        src={data.image}
        alt="Ending scene"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: data.bg, opacity: 0.8 }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0,0,0,0.4) 100%)' }} />

      <ParticleField count={20} color={`${data.textColor}40`} style="firefly" speed="slow" />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.5 }}
        className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative z-10"
        style={{
          background: `${data.textColor}15`,
          border: `2px solid ${data.textColor}30`,
          boxShadow: `0 0 50px ${data.textColor}15`,
        }}
      >
        <motion.div
          className="absolute inset-[-8px] rounded-full"
          style={{ border: `1px solid ${data.textColor}15` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl"
          style={{ filter: `drop-shadow(0 0 20px ${data.textColor}40)` }}
        >
          {data.icon}
        </motion.span>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center z-10"
      >
        <p className="text-xs tracking-widest mb-2"
          style={{ color: `${data.textColor}80`, fontFamily: "'Noto Sans KR', sans-serif" }}>
          {data.subtitle}
        </p>
        <h1 className="text-3xl mb-5"
          style={{
            color: data.textColor,
            fontFamily: "'Noto Serif KR', serif",
            textShadow: `0 2px 20px ${data.textColor}30`,
          }}>
          {data.title}
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '50%' }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="h-[1px] mx-auto mb-5"
          style={{ background: `linear-gradient(90deg, transparent, ${data.textColor}60, transparent)` }}
        />

        <p className="mb-3 leading-relaxed text-[15px]"
          style={{ color: `${data.textColor}cc`, fontFamily: "'Noto Sans KR', sans-serif" }}>
          {data.description}
        </p>
        <p className="text-sm"
          style={{ color: `${data.textColor}70`, fontFamily: "'Noto Sans KR', sans-serif" }}>
          {data.memory}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-10 text-center z-10 w-full"
      >
        <p className="text-xs mb-6"
          style={{ color: `${data.textColor}50`, fontFamily: "'Noto Sans KR', sans-serif" }}>
          "{state.teamName}" 탐험단의 여정
        </p>

        <GoldButton onClick={() => navigate('/report')} fullWidth variant="ghost" size="lg">
          여정 리포트 보기
        </GoldButton>
      </motion.div>
    </div>
  );
}
