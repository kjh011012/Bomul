import { motion } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

// Map puzzle - drag pieces into correct positions
const pieces = [
  { id: 0, label: '산줄기', correctSlot: 0, emoji: '⛰️' },
  { id: 1, label: '물길', correctSlot: 1, emoji: '🌊' },
  { id: 2, label: '숲길', correctSlot: 2, emoji: '🌲' },
  { id: 3, label: '봉인터', correctSlot: 3, emoji: '🔮' },
];

export function Stage0MapPuzzle() {
  const { state, dispatch } = useGame();
  const [placed, setPlaced] = useState<(number | null)[]>([null, null, null, null]);
  const [phase, setPhase] = useState<'ar' | 'puzzle' | 'rune' | 'clear'>('ar');
  const [selectedRune, setSelectedRune] = useState<string | null>(null);

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={0}
        stageName="잠든 지도의 첫 장"
        message="와, 지도가 반응했어요! 첫 장이 깨어났어요. 정말 잘했어요."
        relicId="map1"
        relicType="trail"
        relicName="지도 파편 1"
        relicEmoji="🗺️"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={0}
      stageName="잠든 지도의 첫 장"
      roleLabel="🔍 아이: 표식 찾기"
      bongiMessage="와, 지도가 반응했어요! 조각을 맞춰보세요."
      hints={['지도의 가장자리 문양을 잘 살펴보세요.', '산줄기는 위쪽, 물길은 아래쪽이에요.']}
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          {/* Simulated AR camera view */}
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #2D4A2D, #1A2E1A)' }}
          >
            <div className="absolute inset-0 border-2 border-amber-400/30 rounded-2xl m-4">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <p className="text-amber-300/80 text-sm mb-2" style={{ fontFamily: 'Noto Sans KR' }}>카메라로 표식을 비춰주세요</p>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400/50 mx-auto flex items-center justify-center"
                >
                  <span className="text-2xl">🔍</span>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="absolute top-2 right-2 px-2 py-1 rounded-full bg-red-500/80 flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] text-white">AR SCAN</span>
            </motion.div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('puzzle')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            ✨ 봉인을 발견했어요!
          </motion.button>
        </div>
      )}

      {phase === 'puzzle' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-amber-200 text-sm mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            📜 해독가(부모)가 지도 조각을 맞춰주세요!
          </p>

          {/* Puzzle grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[0, 1, 2, 3].map(slot => {
              const placedPiece = placed[slot] !== null ? pieces[placed[slot]!] : null;
              return (
                <motion.div
                  key={slot}
                  className={`w-32 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center ${
                    placedPiece ? 'border-amber-400 bg-amber-500/20' : 'border-amber-400/30 bg-[#1A2E1A]'
                  }`}
                  layout
                >
                  {placedPiece ? (
                    <>
                      <span className="text-3xl">{placedPiece.emoji}</span>
                      <p className="text-xs text-amber-200 mt-1" style={{ fontFamily: 'Noto Sans KR' }}>{placedPiece.label}</p>
                    </>
                  ) : (
                    <p className="text-xs text-amber-400/30" style={{ fontFamily: 'Noto Sans KR' }}>빈 슬롯</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Available pieces */}
          <div className="flex gap-2 mb-6">
            {pieces.filter(p => !placed.includes(p.id)).map(piece => (
              <motion.button
                key={piece.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const nextEmpty = placed.indexOf(null);
                  if (nextEmpty !== -1) {
                    const newPlaced = [...placed];
                    newPlaced[nextEmpty] = piece.id;
                    setPlaced(newPlaced);
                  }
                }}
                className="w-16 h-16 rounded-xl bg-amber-500/30 border border-amber-400/40 flex flex-col items-center justify-center"
              >
                <span className="text-xl">{piece.emoji}</span>
                <span className="text-[10px] text-amber-200">{piece.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Reset & Confirm */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPlaced([null, null, null, null])}
              className="px-6 py-3 rounded-full bg-[#1A2E1A] border border-amber-400/20 text-amber-200 text-sm"
              style={{ fontFamily: 'Noto Sans KR' }}
            >
              다시 놓기
            </motion.button>
            {placed.every(p => p !== null) && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('rune')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm"
                style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
              >
                완성!
              </motion.button>
            )}
          </div>
        </div>
      )}

      {phase === 'rune' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-200 text-center mb-6"
            style={{ fontFamily: 'Noto Serif KR' }}
          >
            마지막 조각을 열려면<br />룬 토큰을 함께 비춰주세요!
          </motion.p>

          <div className="flex gap-4 mb-8">
            {(['wave', 'ember', 'trail', 'bond'] as const).map(rune => {
              const icons = { wave: '🌊', ember: '🔥', trail: '👣', bond: '🪢' };
              const names = { wave: '물결', ember: '불씨', trail: '발자국', bond: '매듭' };
              return (
                <motion.button
                  key={rune}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRune(rune)}
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 transition-all ${
                    selectedRune === rune ? 'border-amber-400 bg-amber-500/30 scale-110' : 'border-amber-400/20 bg-[#1A2E1A]'
                  }`}
                >
                  <span className="text-2xl">{icons[rune]}</span>
                  <span className="text-[9px] text-amber-200/60 mt-0.5">{names[rune]}</span>
                </motion.button>
              );
            })}
          </div>

          {selectedRune && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <p className="text-amber-300/60 text-xs mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
                👨‍👧 둘이 함께 아래 버튼을 누르세요!
              </p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  dispatch({ type: 'SELECT_RUNE', payload: selectedRune as any });
                  setPhase('clear');
                }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl"
                >
                  🔓
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </div>
      )}
    </StageWrapper>
  );
}
