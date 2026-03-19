import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { RuneToken } from '../components/RuneToken';
import { GameHeader } from '../components/GameHeader';
import type { RuneType } from '../context/GameContext';

export function InventoryPage() {
  const navigate = useNavigate();
  const { state } = useGame();
  const obtained = state.inventory.filter(i => i.obtained);
  const locked = state.inventory.filter(i => !i.obtained);

  const relicCounts: Record<RuneType, number> = {
    wave: state.flowRelic,
    ember: state.emberRelic,
    trail: state.trailRelic,
    knot: state.bondRelic,
  };

  return (
    <div className="h-full w-full flex flex-col" style={{ background: 'linear-gradient(180deg, #0d1f16, #1a3a2a)' }}>
      <GameHeader title="인벤토리" dark showBack />

      {/* Rune stats */}
      <div className="px-5 mb-4">
        <div className="flex justify-between gap-2">
          {(['wave', 'ember', 'trail', 'knot'] as const).map((type, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl"
              style={{
                background: 'rgba(250,246,240,0.03)',
                border: '1px solid rgba(232,212,140,0.08)',
              }}
            >
              <RuneToken type={type} size="sm" selected={relicCounts[type] > 0} />
              <span className="text-xs text-[#c9a84c]">{relicCounts[type]}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto px-5 pb-6">
        {obtained.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-[#c9a84c] mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              획득한 유물 ({obtained.length})
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {obtained.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center p-3 rounded-xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(201,168,76,0.1), rgba(201,168,76,0.04))',
                    border: '1px solid rgba(201,168,76,0.15)',
                  }}
                >
                  <span className="text-3xl mb-1.5">{item.icon}</span>
                  <span className="text-[11px] text-center text-[#e8dcc0] leading-tight"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {item.name}
                  </span>
                  {item.stageObtained && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(201,168,76,0.2)', color: '#c9a84c' }}>
                      S{item.stageObtained}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-[#5a7a60] mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          미발견 유물 ({locked.length})
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {locked.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="flex flex-col items-center p-3 rounded-xl"
              style={{
                background: 'rgba(250,246,240,0.02)',
                border: '1px solid rgba(250,246,240,0.04)',
              }}
            >
              <span className="text-3xl mb-1.5" style={{ filter: 'blur(4px) grayscale(1)', opacity: 0.2 }}>
                {item.icon}
              </span>
              <span className="text-[11px] text-center text-[#4a6a50]"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                ???
              </span>
            </motion.div>
          ))}
        </div>

        {/* Necklace slot */}
        <div className="mt-6 p-4 rounded-xl text-center"
          style={{
            background: 'rgba(250,246,240,0.02)',
            border: `1px ${state.hasNecklace ? 'solid' : 'dashed'} ${state.hasNecklace ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.1)'}`,
          }}>
          <span className="text-3xl mb-2 block"
            style={{
              opacity: state.hasNecklace ? 1 : 0.2,
              filter: state.hasNecklace ? 'none' : 'blur(2px)',
            }}>
            📿
          </span>
          <p className="text-xs" style={{
            color: state.hasNecklace ? '#c9a84c' : '#4a6a50',
            fontFamily: "'Noto Sans KR', sans-serif",
          }}>
            {state.hasNecklace ? '돌목걸이 완성!' : '돌목걸이 — 6번째 봉인에서 제작'}
          </p>
        </div>

        {/* Map fragments bar */}
        <div className="mt-4 p-4 rounded-xl"
          style={{ background: 'rgba(250,246,240,0.02)', border: '1px solid rgba(250,246,240,0.04)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#c9a84c]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              지도 파편
            </p>
            <span className="text-xs text-[#5a7a60]">{state.mapFragments}/10</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex-1 h-2 rounded-full"
                style={{
                  background: i < state.mapFragments
                    ? 'linear-gradient(90deg, #c9a84c, #e8d48c)'
                    : 'rgba(250,246,240,0.05)',
                  boxShadow: i < state.mapFragments ? '0 0 4px rgba(201,168,76,0.3)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
