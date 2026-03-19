import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { useGame } from '../context/GameContext';
import { RewardBurst } from '../components/RewardBurst';
import { GoldButton } from '../components/GoldButton';
import { ParticleField } from '../components/ParticleField';
import { useState } from 'react';

const stageRewards: Record<number, { name: string; icon: string; mapHint: string }> = {
  1: { name: '지도 파편', icon: '🗺️', mapHint: '첫 길이 생겼어요' },
  2: { name: '물빛 유물', icon: '💧', mapHint: '물길이 지도에 나타났어요' },
  3: { name: '숲잎 유물', icon: '🍃', mapHint: '숲이 지도에 새겨졌어요' },
  4: { name: '화전 유물', icon: '✨', mapHint: '따뜻한 빛이 지도에 번졌어요' },
  5: { name: '갈림길 유물', icon: '🔀', mapHint: '새로운 길이 열렸어요' },
  6: { name: '돌목걸이', icon: '📿', mapHint: '열쇠가 완성되었어요' },
  7: { name: '나침반 문양', icon: '🧭', mapHint: '방향이 선명해졌어요' },
  8: { name: '흔적 문양', icon: '🔍', mapHint: '보물고 자물쇠가 반응했어요' },
  9: { name: '수문 좌표', icon: '🌊', mapHint: '마지막 봉인이 보이기 시작했어요' },
  10: { name: '봉황의 보물', icon: '🏆', mapHint: '���물고가 열렸어요' },
};

export function StageClearPage() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const num = Number(stageId);
  const reward = stageRewards[num] || stageRewards[1];
  const { state } = useGame();
  const [burstDone, setBurstDone] = useState(false);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative"
      style={{ background: 'linear-gradient(180deg, #0d1f16, #1a3a2a)' }}>

      <ParticleField count={15} color="rgba(232,212,140,0.35)" style="sparkle" speed="normal" />

      <RewardBurst
        show={!burstDone}
        itemName={reward.name}
        itemIcon={reward.icon}
        onComplete={() => setBurstDone(true)}
      />

      {burstDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full px-6 flex flex-col items-center"
        >
          {/* Stage clear badge */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: 'linear-gradient(145deg, #c9a84c, #e8d48c)',
              boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
            }}
          >
            <div className="absolute inset-1.5 rounded-full" style={{ border: '1.5px solid rgba(255,255,255,0.3)' }} />
            <span className="text-3xl" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}>✦</span>
          </motion.div>

          <h2 className="text-2xl text-[#e8d48c] mb-1"
            style={{ fontFamily: "'Noto Serif KR', serif", textShadow: '0 2px 15px rgba(201,168,76,0.3)' }}>
            봉인 해제!
          </h2>
          <p className="text-[#7a9a80] mb-8" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            스테이지 {num} 완료
          </p>

          {/* Rewards */}
          <div className="w-full space-y-2.5 mb-8">
            {[
              { icon: reward.icon, title: reward.name, sub: '인벤토리에 추가됨' },
              { icon: '🗺️', title: reward.mapHint, sub: '보물지도 업데이트' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="rounded-xl p-4 flex items-center gap-4"
                style={{
                  background: 'rgba(250,246,240,0.04)',
                  border: '1px solid rgba(232,212,140,0.1)',
                }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[#e8d48c] text-sm" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{item.title}</p>
                  <p className="text-xs text-[#5a7a60]">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-xl p-4"
              style={{ background: 'rgba(250,246,240,0.04)', border: '1px solid rgba(232,212,140,0.1)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#e8d48c]">보물고 진행률</span>
                <span className="text-sm text-[#c9a84c]">{state.chestProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(250,246,240,0.06)' }}>
                <motion.div
                  initial={{ width: `${Math.max(0, state.chestProgress - 10)}%` }}
                  animate={{ width: `${state.chestProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #b8942e, #c9a84c, #e8d48c)',
                    boxShadow: '0 0 8px rgba(201,168,76,0.4)',
                  }}
                />
              </div>
            </motion.div>
          </div>

          <GoldButton onClick={() => navigate('/map')} fullWidth size="lg">
            보물지도로 돌아가기
          </GoldButton>
        </motion.div>
      )}
    </div>
  );
}
