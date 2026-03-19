import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, HelpCircle, Backpack } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  stageNum?: number;
  accentColor?: string;
  dark?: boolean;
  showBack?: boolean;
  showHint?: boolean;
  showInventory?: boolean;
  onHintPress?: () => void;
  rightContent?: React.ReactNode;
}

export function GameHeader({
  title, subtitle, stageNum, accentColor = '#c9a84c',
  dark = false, showBack = false, showHint = false, showInventory = false,
  onHintPress, rightContent,
}: GameHeaderProps) {
  const navigate = useNavigate();
  const textColor = dark ? '#e8d48c' : '#1a3a2a';
  const subColor = dark ? '#b8c8b0' : accentColor;

  return (
    <div className="px-5 pt-5 pb-3 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ background: dark ? 'rgba(250,246,240,0.1)' : 'rgba(26,58,42,0.06)' }}
            >
              <ArrowLeft size={18} color={dark ? '#e8d48c' : '#6b4e3d'} />
            </motion.button>
          )}
          <div>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs tracking-wider"
                style={{ color: subColor, fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                {subtitle}
              </motion.p>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg"
              style={{ color: textColor, fontFamily: "'Noto Serif KR', serif" }}
            >
              {title}
            </motion.h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showHint && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onHintPress}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm relative"
              style={{ background: dark ? 'rgba(250,246,240,0.1)' : 'rgba(201,168,76,0.12)' }}
            >
              <HelpCircle size={18} color={accentColor} />
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                style={{ background: '#d4783c' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.button>
          )}
          {showInventory && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/inventory')}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ background: dark ? 'rgba(250,246,240,0.1)' : 'rgba(26,58,42,0.06)' }}
            >
              <Backpack size={18} color={dark ? '#e8d48c' : '#6b4e3d'} />
            </motion.button>
          )}
          {stageNum && (
            <div className="flex gap-1 ml-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    background: i < stageNum ? accentColor : dark ? 'rgba(250,246,240,0.15)' : `${accentColor}25`,
                    transform: i === stageNum - 1 ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          )}
          {rightContent}
        </div>
      </div>
    </div>
  );
}
