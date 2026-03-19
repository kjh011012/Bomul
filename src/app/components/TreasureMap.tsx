import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { MapPin, Backpack, HelpCircle } from 'lucide-react';

const stageData = [
  { id: 0, name: '잠든 지도의 첫 장', hint: '표식이 숨쉬는 곳', x: 50, y: 85, emoji: '🗺️' },
  { id: 1, name: '물길의 메아리 문', hint: '물이 먼저 말을 거는 곳', x: 30, y: 75, emoji: '🌊' },
  { id: 2, name: '숲피부 자물쇠', hint: '손끝이 먼저 기억하는 곳', x: 70, y: 68, emoji: '🌿' },
  { id: 3, name: '움막 화덕의 비밀', hint: '따뜻함이 남아 있는 숨은 자리', x: 25, y: 58, emoji: '🔥' },
  { id: 4, name: '심마니의 외침', hint: '메아리가 갈라지는 갈림길', x: 65, y: 50, emoji: '🏃' },
  { id: 5, name: '돌목걸이 공방', hint: '돌이 노래하는 곳', x: 40, y: 42, emoji: '📿' },
  { id: 6, name: '그림자 나침반', hint: '그림자가 길게 눕는 자리', x: 70, y: 33, emoji: '🧭' },
  { id: 7, name: '도깨비 흔적 수색', hint: '발소리가 울리는 넓은 터', x: 30, y: 25, emoji: '👹' },
  { id: 8, name: '폭포의 수문', hint: '물줄기가 봉인을 감싼 곳', x: 55, y: 17, emoji: '💦' },
  { id: 9, name: '봉황의 보물고', hint: '모든 길이 모이는 곳', x: 50, y: 8, emoji: '👑' },
];

export function TreasureMap() {
  const { state, dispatch } = useGame();

  const canPlay = (id: number) => id <= state.stageIndex;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1A3A2A 0%, #2D4A2D 40%, #3A2A1A 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
        <div>
          <p className="text-amber-400/60 text-xs" style={{ fontFamily: 'Noto Sans KR' }}>{state.teamName} 탐험대</p>
          <p className="text-amber-200 text-sm" style={{ fontFamily: 'Noto Serif KR' }}>보물지도</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'inventory' })}
            className="w-10 h-10 rounded-full bg-[#2D4A2D] border border-amber-400/20 flex items-center justify-center"
          >
            <Backpack size={18} className="text-amber-300" />
          </motion.button>
        </div>
      </div>

      {/* Chest Progress */}
      <div className="mx-5 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-amber-300/60" style={{ fontFamily: 'Noto Sans KR' }}>보물고 봉인</span>
          <span className="text-xs text-amber-400" style={{ fontFamily: 'Noto Sans KR' }}>{state.sealCount}/10</span>
        </div>
        <div className="h-2 rounded-full bg-[#1A2E1A] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
            animate={{ width: `${state.chestProgress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden mx-3 rounded-2xl border border-amber-400/10" style={{ background: 'radial-gradient(ellipse at center, #3D5A3D 0%, #1A2E1A 100%)' }}>
        {/* Path lines connecting stages */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {stageData.slice(0, -1).map((s, i) => {
            const next = stageData[i + 1];
            const completed = state.stagesCompleted[i];
            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={next.x} y2={next.y}
                stroke={completed ? '#C8943E' : '#4A6741'}
                strokeWidth="0.5"
                strokeDasharray={completed ? '0' : '2 2'}
                opacity={completed ? 0.6 : 0.2}
              />
            );
          })}
        </svg>

        {/* Stage nodes */}
        {stageData.map((stage) => {
          const completed = state.stagesCompleted[stage.id];
          const active = canPlay(stage.id);
          const isCurrent = stage.id === state.stageIndex;

          return (
            <motion.button
              key={stage.id}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
              whileTap={active ? { scale: 0.9 } : {}}
              onClick={() => {
                if (active) {
                  dispatch({ type: 'SET_SCREEN', payload: `stage${stage.id}` });
                }
              }}
            >
              {isCurrent && (
                <motion.div
                  className="absolute w-14 h-14 rounded-full border-2 border-amber-400/50"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${
                completed ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 shadow-lg shadow-amber-500/30' :
                active ? 'bg-[#2D4A2D] border-amber-400/50' :
                'bg-[#1A2E1A] border-[#3A4A3A] opacity-40'
              }`}>
                {completed ? (
                  <span className="text-lg">{stage.emoji}</span>
                ) : active ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin size={16} className="text-amber-300" />
                  </motion.div>
                ) : (
                  <span className="text-sm opacity-30">🔒</span>
                )}
              </div>
              <p className={`mt-1 text-[10px] max-w-[80px] text-center ${
                completed ? 'text-amber-300' : active ? 'text-amber-200/60' : 'text-amber-200/20'
              }`} style={{ fontFamily: 'Noto Sans KR' }}>
                {active ? stage.name : stage.hint}
              </p>
            </motion.button>
          );
        })}

        {/* Central treasure chest silhouette */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: [0.05 + state.chestProgress * 0.005, 0.1 + state.chestProgress * 0.005] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-6xl" style={{ filter: `blur(${Math.max(0, 4 - state.chestProgress / 25)}px)` }}>👑</span>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <div className="p-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (state.stageIndex < 10) {
              dispatch({ type: 'SET_SCREEN', payload: `stage${state.stageIndex}` });
            }
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg flex items-center justify-center gap-2"
          style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
        >
          {state.stageIndex < 10 ? (
            <>
              <MapPin size={18} />
              다음 봉인으로 출발
            </>
          ) : (
            <>
              <span>👑</span>
              보물고 열기
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
