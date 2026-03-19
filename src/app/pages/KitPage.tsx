import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { RuneToken } from '../components/RuneToken';
import { GoldButton } from '../components/GoldButton';

const kitItems = [
  { icon: '🪙', name: '룬 토큰 4개', desc: '물결 · 불씨 · 발자국 · 매듭', color: '#c9a84c' },
  { icon: '🗺️', name: '보물지도 봉투', desc: '봉인이 풀릴수록 선명해져요', color: '#6b4e3d' },
  { icon: '🎒', name: '유물 파편 주머니', desc: '찾은 유물을 모아두세요', color: '#3d6b4e' },
  { icon: '📿', name: '돌목걸이 줄', desc: '6번째 봉인에서 완성할 수 있어요', color: '#8a8a7a' },
  { icon: '🔑', name: '최종 열쇠판', desc: '마지막 보물고를 여는 열쇠', color: '#d4783c' },
  { icon: '🏷️', name: '봉이 탐험 패스', desc: '여러분의 탐험 증명서', color: '#4a9eb8' },
];

export function KitPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: '#FAF6F0' }}>
      <div className="px-6 pt-8 pb-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-2xl text-[#1a3a2a]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            탐험 키트
          </h1>
          <p className="text-sm text-[#8a8a7a] mt-1" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            모험에 필요한 도구를 확인하세요
          </p>
        </motion.div>
      </div>

      {/* Rune tokens showcase */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-4"
      >
        <div className="flex justify-center gap-4 py-4 px-3 rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))',
            border: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          {(['wave', 'ember', 'trail', 'knot'] as const).map((type, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <RuneToken type={type} size="sm" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Kit items */}
      <div className="flex-1 px-6 overflow-auto pb-4">
        <div className="space-y-2.5">
          {kitItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl border relative overflow-hidden"
              style={{
                background: '#fff',
                borderColor: 'rgba(26,58,42,0.06)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              {/* Accent line */}
              <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full" style={{ background: item.color, opacity: 0.4 }} />

              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `linear-gradient(145deg, ${item.color}12, ${item.color}06)` }}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div>
                <h4 className="text-[#1a3a2a]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{item.name}</h4>
                <p className="text-xs text-[#a0a090]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        <GoldButton onClick={() => navigate('/map')} fullWidth size="lg">
          보물지도 펼치기
        </GoldButton>
      </div>
    </div>
  );
}
