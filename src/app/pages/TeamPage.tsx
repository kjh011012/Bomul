import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BongiBubble } from '../components/BongiBubble';
import { GoldButton } from '../components/GoldButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function TeamPage() {
  const navigate = useNavigate();
  const { setTeamName } = useGame();
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      setTeamName(name.trim());
      navigate('/role');
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: '#FAF6F0' }}>
      {/* Header with forest image */}
      <div className="h-36 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769291632684-ddc42137875d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5saWdodCUyMGZvcmVzdCUyMGNhbm9weSUyMG1hZ2ljYWx8ZW58MXx8fHwxNzczODUwODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Forest canopy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,58,42,0.5), rgba(26,58,42,0.7))' }} />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(232,212,140,0.15) 0%, transparent 60%)' }}
        />
        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 400 30" className="w-full block" preserveAspectRatio="none" style={{ marginBottom: '-1px' }}>
            <path d="M0,30 Q200,0 400,30 L400,30 L0,30 Z" fill="#FAF6F0" />
          </svg>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-2 flex flex-col">
        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            탐험단 이름을 지어주세요
          </h1>
          <p className="text-[#8a8a7a] mt-2 text-sm" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            이 이름이 보물지도에 새겨질 거예요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <div className="relative">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={12}
              placeholder="예: 별빛 탐험대"
              className="w-full px-5 py-4 rounded-2xl text-center text-lg border-2 outline-none transition-all"
              style={{
                background: focused ? '#fff' : '#f5f0e8',
                borderColor: name ? '#c9a84c' : focused ? '#c8956c' : 'rgba(26,58,42,0.08)',
                color: '#1a3a2a',
                fontFamily: "'Noto Serif KR', serif",
                boxShadow: focused ? '0 4px 20px rgba(201,168,76,0.12)' : 'none',
              }}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full"
              style={{ background: 'linear-gradient(90deg, #c9a84c, #e8d48c)' }}
              animate={{ width: name ? '85%' : '0%' }}
              transition={{ duration: 0.3 }}
            />
            {/* Decorative corners when focused */}
            {focused && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
                  style={{ borderColor: '#c9a84c40' }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
                  style={{ borderColor: '#c9a84c40' }}
                />
              </>
            )}
          </div>
          <p className="text-right text-xs mt-2" style={{ color: '#a0a090' }}>{name.length}/12</p>
        </motion.div>

        {/* Suggested names */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {['봉황 탐험대', '숲빛 가족단', '보물 사냥꾼', '길따라 모험단'].map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              onClick={() => setName(s)}
              className="px-4 py-2 rounded-full text-sm border transition-all"
              style={{
                background: name === s ? 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))' : 'rgba(26,58,42,0.02)',
                borderColor: name === s ? '#c9a84c' : 'rgba(26,58,42,0.08)',
                color: name === s ? '#8a6a30' : '#8a8a7a',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex-1" />

        <BongiBubble
          message="멋진 이름이 될 거예요! 이름이 정해지면 탐험이 시작돼요."
          delay={800}
          emotion="happy"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="py-6"
        >
          <GoldButton onClick={handleStart} disabled={!name.trim()} fullWidth size="lg">
            탐험 준비 완료!
          </GoldButton>
        </motion.div>
      </div>
    </div>
  );
}