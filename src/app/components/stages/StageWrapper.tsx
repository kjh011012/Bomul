import { motion } from 'motion/react';
import { ReactNode, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { BongiBubble } from '../BongiBubble';
import { HintModal } from '../HintModal';

interface StageWrapperProps {
  stageNumber: number;
  stageName: string;
  roleLabel: string;
  bongiMessage: string;
  hints: string[];
  bg?: string;
  children: ReactNode;
}

export function StageWrapper({ stageNumber, stageName, roleLabel, bongiMessage, hints, bg, children }: StageWrapperProps) {
  const { dispatch } = useGame();
  const [showHint, setShowHint] = useState(false);
  const [showBongi, setShowBongi] = useState(true);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: bg || 'linear-gradient(180deg, #1A3A2A 0%, #2D4A2D 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 z-20">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'map' })}
            className="w-9 h-9 rounded-full bg-black/20 flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-amber-200" />
          </motion.button>
          <div>
            <p className="text-amber-400/60 text-[10px]" style={{ fontFamily: 'Noto Sans KR' }}>STAGE {stageNumber + 1}</p>
            <p className="text-amber-100 text-sm" style={{ fontFamily: 'Noto Serif KR' }}>{stageName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300/60 px-2 py-1 rounded-full bg-amber-400/10" style={{ fontFamily: 'Noto Sans KR' }}>
            {roleLabel}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHint(true)}
            className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center"
          >
            <HelpCircle size={16} className="text-amber-300" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Bongi */}
      {showBongi && (
        <div className="absolute bottom-4 left-0 right-0 z-30">
          <BongiBubble message={bongiMessage} onDismiss={() => setShowBongi(false)} />
        </div>
      )}

      <HintModal show={showHint} onClose={() => setShowHint(false)} stageHints={hints} />
    </div>
  );
}
