import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ParticleField } from '../components/ParticleField';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SplashPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1545828363-51ed76c86636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMEtvcmVhbiUyMGZvcmVzdCUyMG1vcm5pbmclMjBtaXN0JTIwdHJhaWx8ZW58MXx8fHwxNzczODUwODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Mystical forest"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,25,15,0.75) 0%, rgba(20,40,28,0.6) 40%, rgba(15,30,20,0.85) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

      {/* Firefly particles */}
      <ParticleField count={25} color="rgba(232,212,140,0.5)" style="firefly" speed="slow" />

      {/* Decorative top vine */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        style={{
          background: 'linear-gradient(180deg, rgba(61,107,78,0.4), transparent)',
          maskImage: 'linear-gradient(180deg, black, transparent)',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.2 }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(232,212,140,0.15), 0 0 80px rgba(201,168,76,0.08)',
              '0 0 60px rgba(232,212,140,0.3), 0 0 120px rgba(201,168,76,0.15)',
              '0 0 40px rgba(232,212,140,0.15), 0 0 80px rgba(201,168,76,0.08)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-36 h-36 rounded-full flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(145deg, #c9a84c, #e8d48c, #c9a84c)',
          }}
        >
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
          <div className="absolute inset-4 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
          <motion.span
            animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
          >
            🐦
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="mt-8 text-center z-10 px-8"
      >
        <h1
          className="text-3xl tracking-wide"
          style={{
            fontFamily: "'Noto Serif KR', serif",
            color: '#e8d48c',
            textShadow: '0 2px 20px rgba(201,168,76,0.3), 0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          보물을 찾아서
        </h1>
        <motion.div
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '60%' } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="h-[1px] mx-auto mt-3 mb-3"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 0.65 } : {}}
          transition={{ delay: 0.5 }}
          className="text-[#b8c8b0] text-sm tracking-widest"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          고라데이의 숨은 봉인
        </motion.p>
      </motion.div>

      {/* Subtitle badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="mt-6 flex items-center gap-3 z-10"
      >
        {['🏔️ 야외', '👨‍👩‍👧 가족', '🧩 퍼즐'].map((badge, i) => (
          <motion.div
            key={badge}
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15 }}
            className="px-3 py-1.5 rounded-full text-xs backdrop-blur-sm"
            style={{
              background: 'rgba(250,246,240,0.08)',
              border: '1px solid rgba(232,212,140,0.15)',
              color: '#b8c8b0',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            {badge}
          </motion.div>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : {}}
        className="mt-12 z-10"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/intro/1')}
          className="px-14 py-4 rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #b8942e, #c9a84c, #e8d48c, #c9a84c)',
            color: '#1a3a2a',
            fontFamily: "'Noto Sans KR', sans-serif",
            boxShadow: '0 4px 24px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <span className="relative z-10 tracking-wide">모험을 시작하기</span>
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 1.5 }}
          />
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 0.35 } : {}}
        className="absolute bottom-6 text-[#b8c8b0] text-[11px] tracking-wider z-10"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        가족과 함께 떠나는 야외 보물 탐험
      </motion.p>
    </div>
  );
}
