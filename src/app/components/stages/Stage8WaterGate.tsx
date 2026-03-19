import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { StageWrapper } from './StageWrapper';
import { StageClear } from '../StageClear';

const relicSlots = ['🌊', '🔥', '👣'];

export function Stage8WaterGate() {
  const { dispatch } = useGame();
  const [phase, setPhase] = useState<'ar' | 'timing' | 'pipe' | 'clear'>('ar');
  const [gateOpen, setGateOpen] = useState(false);
  const [placed, setPlaced] = useState<boolean[]>([false, false, false]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [pipeConnected, setPipeConnected] = useState([false, false, false, false]);

  // Gate opens and closes periodically
  useEffect(() => {
    if (phase === 'timing') {
      const iv = setInterval(() => {
        setGateOpen(prev => !prev);
      }, 1500);
      return () => clearInterval(iv);
    }
  }, [phase]);

  const handleTimingTap = () => {
    if (gateOpen && currentSlot < 3) {
      const newPlaced = [...placed];
      newPlaced[currentSlot] = true;
      setPlaced(newPlaced);
      setCurrentSlot(currentSlot + 1);
      if (currentSlot === 2) {
        setTimeout(() => setPhase('pipe'), 800);
      }
    }
  };

  const togglePipe = (idx: number) => {
    const n = [...pipeConnected];
    n[idx] = !n[idx];
    setPipeConnected(n);
    if (n.every(Boolean)) {
      setTimeout(() => setPhase('clear'), 800);
    }
  };

  if (phase === 'clear') {
    return (
      <StageClear
        stageIndex={8}
        stageName="폭포의 수문"
        message="여기까지 왔다니, 정말 대단해요. 물길이 열리고 있어요!"
        relicId="big_relic"
        relicType="wave"
        relicName="대형 유물 파편"
        relicEmoji="💎"
      />
    );
  }

  return (
    <StageWrapper
      stageNumber={8}
      stageName="폭포의 수문"
      roleLabel="👨‍👧 함께"
      bongiMessage="여기까지 왔다니, 정말 대단해요."
      hints={['수문이 열릴 때 타이밍 맞춰 탭하세요.', '아이가 타이밍을 외치고, 부모가 입력하세요.']}
      bg="linear-gradient(180deg, #0A1A3A 0%, #1A2A4A 50%, #0A1A2A 100%)"
    >
      {phase === 'ar' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <motion.div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative mb-6"
            style={{ background: 'linear-gradient(135deg, #0A1A3A, #1A2A4A)' }}
          >
            {/* Giant water gate */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-7xl">💦</span>
                <p className="text-blue-300/60 text-xs mt-2" style={{ fontFamily: 'Noto Sans KR' }}>거대한 수문이 가로막고 있어요</p>
              </motion.div>
            </div>
            {/* Water particles */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-3 bg-blue-400/40 rounded-full"
                style={{ left: `${10 + Math.random() * 80}%`, top: '-5%' }}
                animate={{ y: [0, 400], opacity: [0.5, 0] }}
                transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </motion.div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPhase('timing')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
            style={{ fontFamily: 'Noto Sans KR', fontWeight: 700 }}
          >
            💦 수문 봉인에 도전!
          </motion.button>
        </div>
      )}

      {phase === 'timing' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-blue-200 text-sm mb-2 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            🔍 아이가 "지금!" 외치면 📜 부모가 탭!
          </p>

          {/* Gate visualization */}
          <div className="relative w-64 h-40 mb-6">
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute left-0 right-0 bg-blue-500/30"
                animate={{ height: gateOpen ? '10%' : '100%' }}
                transition={{ duration: 0.3 }}
                style={{ top: 0 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl transition-opacity ${gateOpen ? 'opacity-100' : 'opacity-20'}`}>
                  {gateOpen ? '🚪' : '🔒'}
                </span>
              </div>
            </div>
          </div>

          {/* Relic slots */}
          <div className="flex gap-4 mb-6">
            {relicSlots.map((emoji, i) => (
              <div key={i} className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 ${
                placed[i] ? 'border-blue-400 bg-blue-500/30' : 'border-blue-400/20 bg-[#0A1A3A]'
              }`}>
                {placed[i] ? <span className="text-2xl">{emoji}</span> : <span className="text-xs text-blue-400/30">{i + 1}</span>}
              </div>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleTimingTap}
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
              gateOpen ? 'border-green-400 bg-green-500/30' : 'border-red-400/30 bg-red-500/10'
            }`}
          >
            <span className="text-3xl">{gateOpen ? '✋' : '⏳'}</span>
          </motion.button>
          <p className="text-blue-300/50 text-xs mt-2" style={{ fontFamily: 'Noto Sans KR' }}>
            {gateOpen ? '지금! 탭하세요!' : '기다리세요...'}
          </p>
        </div>
      )}

      {phase === 'pipe' && (
        <div className="flex flex-col items-center justify-center h-full px-6">
          <p className="text-blue-200 text-sm mb-4 text-center" style={{ fontFamily: 'Noto Sans KR' }}>
            물길을 연결해 수문을 완전히 열어주세요!
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {['↗️ 수로 1', '↘️ 수로 2', '↙️ 수로 3', '↖️ 수로 4'].map((label, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePipe(i)}
                className={`py-6 px-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                  pipeConnected[i] ? 'border-cyan-400 bg-cyan-500/20' : 'border-blue-400/20 bg-[#0A1A3A]'
                }`}
              >
                <span className="text-2xl">{pipeConnected[i] ? '🌊' : '🔧'}</span>
                <span className="text-xs text-blue-200" style={{ fontFamily: 'Noto Sans KR' }}>{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </StageWrapper>
  );
}
