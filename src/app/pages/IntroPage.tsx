import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { ParticleField } from '../components/ParticleField';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const introData = [
  {
    bg: 'linear-gradient(180deg, #0d1f16 0%, #1a3a2a 100%)',
    title: '오래전, 이 골짜기에는',
    body: '산과 물, 바람과 돌의 흐름을 읽는\n수호자들이 있었어요.',
    icon: '🏔️',
    accent: '#4a9eb8',
    image: 'https://images.unsplash.com/photo-1769291632684-ddc42137875d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5saWdodCUyMGZvcmVzdCUyMGNhbm9weSUyMG1hZ2ljYWx8ZW58MXx8fHwxNzczODUwODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    bg: 'linear-gradient(180deg, #1a2a10 0%, #2a4a20 100%)',
    title: '그들은 가장 소중한 보물을',
    body: '10개의 봉인과 4개의 유물 자물쇠 뒤에\n숨겨 두었어요.',
    icon: '🔐',
    accent: '#c9a84c',
    image: 'https://images.unsplash.com/photo-1676480166342-2902ebf81c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwc3RvbmUlMjBydWlucyUyMG1vc3MlMjBjb3ZlcmVkJTIwdGVtcGxlfGVufDF8fHx8MTc3Mzg1MDgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    bg: 'linear-gradient(180deg, #2a1a10 0%, #3a2a1a 100%)',
    title: '하지만 봉황의 울음이 멈추고',
    body: '봉인은 흩어지고, 지도를 읽는 법도\n잊혀졌어요.\n\n이제, 여러분의 차례예요.',
    icon: '🪶',
    accent: '#d4783c',
    image: 'https://images.unsplash.com/photo-1761234652554-3f27bd0fb9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZW5jaGFudGVkJTIwZm9yZXN0JTIwcGF0aCUyMG5pZ2h0JTIwbGFudGVybnxlbnwxfHx8fDE3NzM4NTA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function IntroPage() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const idx = Number(step) - 1;
  const data = introData[idx] || introData[0];
  const isLast = idx >= 2;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <ImageWithFallback
        src={data.image}
        alt="Scene"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: data.bg, opacity: 0.7 }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)' }} />

      <ParticleField count={12} color={`${data.accent}50`} style="firefly" speed="slow" />

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center px-8 z-10"
        >
          {/* Icon with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.15 }}
            className="w-28 h-28 rounded-full flex items-center justify-center mb-8 relative"
            style={{
              background: `${data.accent}15`,
              border: `2px solid ${data.accent}30`,
              boxShadow: `0 0 40px ${data.accent}15`,
            }}
          >
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              style={{ border: `1px solid ${data.accent}15` }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <span className="text-5xl" style={{ filter: `drop-shadow(0 0 15px ${data.accent}40)` }}>{data.icon}</span>
          </motion.div>

          <h2
            className="text-2xl mb-4"
            style={{
              fontFamily: "'Noto Serif KR', serif",
              color: '#e8d48c',
              textShadow: '0 2px 15px rgba(0,0,0,0.5)',
            }}
          >
            {data.title}
          </h2>

          <p
            className="whitespace-pre-line leading-[1.9] text-[15px]"
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              color: '#c8d8c0',
              textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            }}
          >
            {data.body}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-10 w-full px-8 flex items-center justify-between z-10">
        {/* Dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: i === idx ? 1.2 : 1 }}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 20 : 8,
                height: 8,
                background: i === idx
                  ? 'linear-gradient(90deg, #c9a84c, #e8d48c)'
                  : 'rgba(232,212,140,0.2)',
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(isLast ? '/team' : `/intro/${idx + 2}`)}
          className="px-8 py-3 rounded-full relative overflow-hidden"
          style={{
            background: isLast
              ? 'linear-gradient(135deg, #b8942e, #c9a84c, #e8d48c)'
              : 'rgba(232,212,140,0.12)',
            color: isLast ? '#1a3a2a' : '#e8d48c',
            fontFamily: "'Noto Sans KR', sans-serif",
            border: isLast ? 'none' : '1px solid rgba(232,212,140,0.2)',
            boxShadow: isLast ? '0 4px 20px rgba(201,168,76,0.35)' : 'none',
          }}
        >
          {isLast ? '시작하기' : '다음'}
        </motion.button>
      </div>
    </div>
  );
}
