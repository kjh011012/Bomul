import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { BongiBubble } from '../components/BongiBubble';
import { GoldButton } from '../components/GoldButton';

const roles = [
  {
    emoji: '🧒',
    title: '탐험가',
    who: '아이',
    subtitle: '발견하고 찾고 느끼는 역할',
    tasks: ['👀 숨은 표식을 먼저 발견해요', '✋ 자연을 만지고 설명해요', '🏃 방향을 감으로 선택해요'],
    gradient: 'linear-gradient(145deg, #e8f4e8, #d0e8d0)',
    borderColor: 'rgba(61,107,78,0.15)',
    iconBg: 'linear-gradient(145deg, #3d6b4e, #5a9e6a)',
    textColor: '#2d5a3e',
  },
  {
    emoji: '👨‍👩‍👧',
    title: '해독가',
    who: '부모',
    subtitle: '해석하고 풀고 조합하는 역할',
    tasks: ['🧩 퍼즐을 논리적으로 풀어요', '📖 패턴을 기억하고 입력해요', '🤝 아이의 발견을 해독해요'],
    gradient: 'linear-gradient(145deg, #f4efe8, #e8ddd0)',
    borderColor: 'rgba(107,78,61,0.15)',
    iconBg: 'linear-gradient(145deg, #6b4e3d, #c8956c)',
    textColor: '#6b4e3d',
  },
];

export function RolePage() {
  const navigate = useNavigate();
  const { state } = useGame();

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAF6F0, #f0ebe3)' }}>
      <div className="flex-1 px-6 pt-10 flex flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
          >
            <span className="text-xs">✦</span>
            <span className="text-xs text-[#c9a84c]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              "{state.teamName}" 탐험단
            </span>
          </motion.div>
          <h1 className="text-2xl text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            역할을 확인하세요
          </h1>
        </motion.div>

        {/* Role cards */}
        <div className="flex flex-col gap-4 mt-2">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="rounded-2xl p-5 border relative overflow-hidden"
              style={{ background: role.gradient, borderColor: role.borderColor }}
            >
              {/* Subtle pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5"
                style={{ background: `radial-gradient(circle, ${role.textColor}, transparent)` }} />

              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center relative"
                  style={{
                    background: role.iconBg,
                    boxShadow: `0 3px 12px ${role.textColor}30`,
                  }}
                >
                  <span className="text-2xl">{role.emoji}</span>
                </motion.div>
                <div>
                  <h3 className="text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                    {role.title} <span className="text-xs text-[#8a8a7a]">({role.who})</span>
                  </h3>
                  <p className="text-xs" style={{ color: role.textColor, fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {role.subtitle}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 ml-14">
                {role.tasks.map(task => (
                  <li key={task} className="text-sm" style={{ color: role.textColor, fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {task}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl p-4 text-center border relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #faf4e8, #f0e8d4)',
              borderColor: 'rgba(201,168,76,0.2)',
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.05), transparent)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />
            <p className="text-sm text-[#8a6a30] relative z-10" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              ✨ 함께 해야만 열리는 봉인이 있어요
            </p>
          </motion.div>
        </div>

        <div className="flex-1" />

        <BongiBubble
          message="둘이 힘을 합치면 어떤 봉인이든 열 수 있어요!"
          delay={1000}
          emotion="excited"
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="py-6">
          <GoldButton onClick={() => navigate('/bongi')} fullWidth size="lg">
            봉이를 만나러 가기
          </GoldButton>
        </motion.div>
      </div>
    </div>
  );
}
