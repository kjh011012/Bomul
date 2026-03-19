import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { RuneToken } from '../components/RuneToken';
import { GoldButton } from '../components/GoldButton';
import type { RuneType } from '../context/GameContext';

export function ReportPage() {
  const navigate = useNavigate();
  const { state, calculateEnding, resetGame } = useGame();
  const ending = calculateEnding();

  const endingNames: Record<string, string> = {
    forest_listener: '숲을 듣는 가족', path_weaver: '길을 잇는 가족',
    wave_guardian: '물결의 수호자', ember_pioneer: '불씨의 개척자',
    knot_treasure: '매듭의 보물단', phoenix_guide: '봉황의 길잡이',
    balance_heir: '균형의 후계자', family_guard: '가족 수호단',
    hidden_1: '전설의 수호자 ✨', hidden_2: '완벽한 동반자 💫',
  };

  const relics: { type: RuneType; label: string; count: number }[] = [
    { type: 'wave', label: '물결', count: state.flowRelic },
    { type: 'ember', label: '불씨', count: state.emberRelic },
    { type: 'trail', label: '발자국', count: state.trailRelic },
    { type: 'knot', label: '매듭', count: state.bondRelic },
  ];

  const maxRelic = relics.reduce((a, b) => a.count > b.count ? a : b);
  const totalRelics = relics.reduce((sum, r) => sum + r.count, 0);
  const clearedCount = state.stagesCleared.filter(Boolean).length;
  const obtainedItems = state.inventory.filter(i => i.obtained).length;

  const tips = [
    state.flowRelic < 2 ? '물결 룬을 더 모으면 다른 보물고가 열릴지도!' : null,
    state.emberRelic < 2 ? '불씨의 길을 더 탐험하면 새로운 엔딩을!' : null,
    clearedCount < 10 ? '아직 열리지 않은 숨은 봉인이 남아 있어요.' : null,
    state.hintUseCount > 3 ? '힌트를 줄이면 숨은 엔딩을 발견할 수도!' : null,
  ].filter(Boolean);

  return (
    <div className="h-full w-full flex flex-col overflow-auto" style={{ background: '#FAF6F0' }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4 text-center" style={{
        background: 'linear-gradient(180deg, #1a3a2a, #2a4a3a)',
        borderRadius: '0 0 24px 24px',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(232,212,140,0.1)', border: '1px solid rgba(232,212,140,0.15)' }}
          >
            <span className="text-xs">✦</span>
            <span className="text-xs text-[#c9a84c]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {state.teamName} 탐험단
            </span>
          </motion.div>
          <h1 className="text-2xl text-[#e8d48c] mb-1" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            여정 리포트
          </h1>
        </motion.div>
      </div>

      <div className="px-5 -mt-4">
        {/* Ending card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #fff, #faf6f0)',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 4px 20px rgba(201,168,76,0.08)',
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.03), transparent)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
          />
          <p className="text-[10px] text-[#c9a84c] tracking-widest mb-1 relative z-10">ENDING</p>
          <h2 className="text-xl text-[#1a3a2a] relative z-10" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            {endingNames[ending] || '봉황의 길잡이'}
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {[
            { value: `${clearedCount}/10`, label: '해제한 봉인', icon: '✦', delay: 0.3 },
            { value: `${obtainedItems}`, label: '수집한 유물', icon: '💎', delay: 0.35 },
            { value: `${state.hintUseCount}`, label: '사용한 힌트', icon: '🐦', delay: 0.4 },
            { value: `${state.roleSwapSuccess}`, label: '역할 교환', icon: '🤝', delay: 0.45 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: stat.delay }}
              className="rounded-xl p-4 text-center relative overflow-hidden"
              style={{
                background: '#fff',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                border: '1px solid rgba(26,58,42,0.04)',
              }}
            >
              <span className="text-xs absolute top-2 right-3 opacity-40">{stat.icon}</span>
              <p className="text-2xl text-[#1a3a2a]">{stat.value}</p>
              <p className="text-[11px] text-[#a0a090] mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Relic distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl p-4 mt-4"
          style={{
            background: '#fff',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            border: '1px solid rgba(26,58,42,0.04)',
          }}
        >
          <p className="text-sm text-[#6b4e3d] mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            유물 성향 분포
          </p>
          <div className="flex justify-around mb-3">
            {relics.map(r => (
              <div key={r.type} className="flex flex-col items-center gap-1.5">
                <RuneToken type={r.type} size="sm" selected={r === maxRelic} />
                <div className="text-center">
                  <span className="text-sm text-[#1a3a2a]">{r.count}</span>
                  {totalRelics > 0 && (
                    <div className="w-8 h-1 rounded-full mt-1 mx-auto" style={{
                      background: `linear-gradient(90deg, ${r === maxRelic ? '#c9a84c' : '#e8e0d4'} ${(r.count / Math.max(1, totalRelics)) * 100}%, transparent 0)`,
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#c9a84c] text-center" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            이번엔 {maxRelic.label}의 기운이 가장 강했어요
          </p>
        </motion.div>

        {/* Memory sentence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl p-5 mt-4 text-center"
          style={{ background: 'linear-gradient(145deg, #1a3a2a, #2a4a3a)', boxShadow: '0 4px 16px rgba(26,58,42,0.15)' }}
        >
          <p className="text-[10px] text-[#c9a84c] tracking-widest mb-2">FAMILY MEMORY</p>
          <p className="text-[#e8dcc0] leading-relaxed" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            "여러분은 {maxRelic.label === '물결' ? '길을 듣고 찾아내는' : maxRelic.label === '불씨' ? '용기로 길을 밝히는' : maxRelic.label === '발자국' ? '관찰로 세상을 읽는' : '함께 걸으며 이어가는'} 가족이었어요."
          </p>
        </motion.div>

        {/* Hidden endings grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl p-4 mt-4"
          style={{
            background: 'rgba(26,58,42,0.02)',
            border: '1px dashed rgba(26,58,42,0.1)',
          }}
        >
          <p className="text-xs text-[#a0a090] mb-3">발견한 엔딩: 1/8+</p>
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))', color: '#8a6a30', border: '1px solid rgba(201,168,76,0.15)' }}>
              {endingNames[ending]}
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(0,0,0,0.02)', color: '#c0c0c0', border: '1px solid rgba(0,0,0,0.03)' }}>
                ???
              </div>
            ))}
          </div>
          <p className="text-xs text-[#c9a84c] mt-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            아직 열리지 않은 보물이 있어요 ✨
          </p>
        </motion.div>

        {/* Tips */}
        {tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="rounded-xl p-4 mt-4"
            style={{
              background: 'linear-gradient(145deg, rgba(201,168,76,0.04), rgba(201,168,76,0.08))',
              border: '1px solid rgba(201,168,76,0.12)',
            }}
          >
            <p className="text-xs text-[#c9a84c] mb-2">🐦 봉이의 귓속말</p>
            {tips.map((tip, i) => (
              <p key={i} className="text-sm text-[#6b4e3d] mb-1" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                · {tip}
              </p>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-6 mb-8 space-y-3">
          <GoldButton
            onClick={() => { resetGame(); navigate('/'); }}
            fullWidth
            size="lg"
          >
            다른 길로 다시 탐험하기
          </GoldButton>
          <button
            onClick={() => navigate('/map')}
            className="w-full py-3 rounded-2xl text-sm"
            style={{ color: '#a0a090', fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            보물지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
