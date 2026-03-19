import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { ParticleField } from '../components/ParticleField';
import { GoldButton } from '../components/GoldButton';

export function BongiIntroPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const dialogues = [
    '안녕하세요! 저는 봉이예요.',
    '작은 봉황 정령이에요.\n봉인이 풀릴 때마다 저도 더 선명해져요.',
    '막히면 살짝 방향을 알려줄게요.\n성공하면 진심으로 기뻐할 거예요!',
    '자, 이제 보물지도를 펼쳐볼까요?',
  ];

  const isLast = step === dialogues.length - 1;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden px-8"
      style={{ background: 'linear-gradient(180deg, #1a3a2a 0%, #0d1f16 100%)' }}>

      <ParticleField count={20} color="rgba(232,212,140,0.4)" style="firefly" speed="slow" />

      {/* Background glow */}
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      {/* Bongi character */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 40px rgba(232,212,140,0.15), 0 0 80px rgba(201,168,76,0.05)',
            '0 0 60px rgba(232,212,140,0.3), 0 0 120px rgba(201,168,76,0.1)',
            '0 0 40px rgba(232,212,140,0.15), 0 0 80px rgba(201,168,76,0.05)',
          ],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="w-40 h-40 rounded-full flex items-center justify-center mb-8 relative z-10"
        style={{ background: 'linear-gradient(145deg, #c9a84c, #e8d48c, #c9a84c)' }}
      >
        <div className="absolute inset-2 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
        <div className="absolute inset-4 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
        <motion.span
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-7xl"
          style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.3))' }}
        >
          🐦
        </motion.span>
      </motion.div>

      {/* Name */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[#e8d48c] text-2xl mb-6 z-10"
        style={{
          fontFamily: "'Noto Serif KR', serif",
          textShadow: '0 2px 15px rgba(201,168,76,0.3)',
        }}
      >
        봉이
      </motion.h2>

      {/* Dialogue box */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl p-5 text-center min-h-[110px] flex items-center justify-center z-10 relative overflow-hidden"
        style={{
          background: 'rgba(250,246,240,0.07)',
          border: '1px solid rgba(232,212,140,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Subtle shine */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(232,212,140,0.03), transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        />
        <p
          className="text-[#e8dcc0] whitespace-pre-line leading-[1.9] relative z-10"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {dialogues[step]}
        </p>
      </motion.div>

      {/* Dots */}
      <div className="flex gap-2.5 mt-6 z-10">
        {dialogues.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === step ? 1.2 : 1 }}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 18 : 8,
              height: 8,
              background: i === step
                ? 'linear-gradient(90deg, #c9a84c, #e8d48c)'
                : 'rgba(232,212,140,0.15)',
              borderRadius: 4,
            }}
          />
        ))}
      </div>

      <motion.div className="mt-8 z-10">
        {isLast ? (
          <GoldButton onClick={() => navigate('/kit')} size="lg">
            보물지도 펼치기
          </GoldButton>
        ) : (
          <GoldButton onClick={() => setStep(step + 1)} variant="ghost" size="md">
            다음
          </GoldButton>
        )}
      </motion.div>
    </div>
  );
}
