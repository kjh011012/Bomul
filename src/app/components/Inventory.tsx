import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { ArrowLeft } from 'lucide-react';

export function Inventory() {
  const { state, dispatch } = useGame();

  const runeTokens = [
    { type: 'wave', name: '물결', icon: '🌊', color: '#60A5FA', value: state.flowRelic },
    { type: 'ember', name: '불씨', icon: '🔥', color: '#F97316', value: state.emberRelic },
    { type: 'trail', name: '발자국', icon: '👣', color: '#4ADE80', value: state.trailRelic },
    { type: 'bond', name: '매듭', icon: '🪢', color: '#C8943E', value: state.bondRelic },
  ];

  const obtained = state.inventory.filter(r => r.obtained);
  const notObtained = state.inventory.filter(r => !r.obtained);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1A2E1A 0%, #2D4A2D 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'map' })}
          className="w-9 h-9 rounded-full bg-[#2D4A2D] border border-amber-400/20 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="text-amber-300" />
        </motion.button>
        <h2 className="text-amber-200" style={{ fontFamily: 'Noto Serif KR' }}>유물 보관함</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Rune Tokens */}
        <p className="text-amber-400/50 text-xs mb-3 mt-2" style={{ fontFamily: 'Noto Sans KR' }}>룬 토큰의 기운</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {runeTokens.map((rune) => (
            <div key={rune.type} className="flex flex-col items-center p-3 rounded-xl bg-[#1A2E1A] border border-amber-400/10">
              <span className="text-2xl mb-1">{rune.icon}</span>
              <p className="text-xs text-amber-200/60" style={{ fontFamily: 'Noto Sans KR' }}>{rune.name}</p>
              <div className="flex gap-0.5 mt-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < rune.value ? 'bg-amber-400' : 'bg-amber-400/10'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Obtained relics */}
        <p className="text-amber-400/50 text-xs mb-3" style={{ fontFamily: 'Noto Sans KR' }}>
          발견한 유물 ({obtained.length}/{state.inventory.length})
        </p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {obtained.map((relic, i) => (
            <motion.div
              key={relic.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/30 flex flex-col items-center"
            >
              <span className="text-2xl mb-1">{relic.icon}</span>
              <p className="text-[10px] text-amber-200 text-center" style={{ fontFamily: 'Noto Sans KR' }}>{relic.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Not yet obtained */}
        {notObtained.length > 0 && (
          <>
            <p className="text-amber-400/30 text-xs mb-3" style={{ fontFamily: 'Noto Sans KR' }}>아직 잠든 유물</p>
            <div className="grid grid-cols-4 gap-2">
              {notObtained.map((relic) => (
                <div key={relic.id} className="p-3 rounded-xl bg-[#1A2E1A]/50 border border-amber-400/5 flex flex-col items-center">
                  <span className="text-2xl opacity-10">❓</span>
                  <p className="text-[10px] text-amber-200/20 text-center mt-1" style={{ fontFamily: 'Noto Sans KR' }}>???</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
