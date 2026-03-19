import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

interface BongiBubbleProps {
  message: string;
  show?: boolean;
  onDismiss?: () => void;
  delay?: number;
  typing?: boolean;
  emotion?: 'happy' | 'thinking' | 'excited' | 'default';
}

const emotionMap = {
  happy: { bounce: [0, -6, 0], rotate: [0, 3, -3, 0], emoji: '🐦' },
  thinking: { bounce: [0, -3, 0], rotate: [0, -5, 0], emoji: '🐦' },
  excited: { bounce: [0, -10, 0], rotate: [0, 8, -8, 0], emoji: '🐦' },
  default: { bounce: [0, -5, 0], rotate: [0, 2, -2, 0], emoji: '🐦' },
};

export function BongiBubble({ message, show = true, onDismiss, delay = 0, typing = true, emotion = 'default' }: BongiBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [typingDone, setTypingDone] = useState(!typing);
  const intervalRef = useRef<number | null>(null);
  const emo = emotionMap[emotion];

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      setDisplayText('');
      setTypingDone(!typing);
    }
  }, [show, delay, typing]);

  useEffect(() => {
    if (visible && typing) {
      setDisplayText('');
      setTypingDone(false);
      let idx = 0;
      intervalRef.current = window.setInterval(() => {
        idx++;
        if (idx <= message.length) {
          setDisplayText(message.slice(0, idx));
        } else {
          setTypingDone(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 35);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    } else if (visible) {
      setDisplayText(message);
    }
  }, [visible, message, typing]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="flex items-end gap-2.5 px-3"
          onClick={onDismiss}
        >
          {/* Bongi character */}
          <motion.div
            animate={{ y: emo.bounce, rotate: emo.rotate }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(145deg, #e8d48c, #c9a84c)',
              boxShadow: '0 3px 12px rgba(201,168,76,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <span className="text-xl">{emo.emoji}</span>
            {/* Glow ring */}
            <motion.div
              className="absolute inset-[-3px] rounded-full"
              style={{ border: '2px solid rgba(232,212,140,0.3)' }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>

          {/* Speech bubble */}
          <div
            className="relative flex-1 rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(250,246,240,0.95), rgba(240,235,227,0.95))',
              border: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(201,168,76,0.1)',
            }}
          >
            <p className="text-[#2a3a2a] text-[14px] leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {displayText}
              {!typingDone && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block w-[2px] h-[14px] ml-0.5 align-text-bottom"
                  style={{ background: '#c9a84c' }}
                />
              )}
            </p>
            {/* Bubble tail */}
            <div
              className="absolute bottom-2 left-[-7px] w-3.5 h-3.5 rotate-45"
              style={{
                background: 'rgba(250,246,240,0.95)',
                borderLeft: '1px solid rgba(201,168,76,0.25)',
                borderBottom: '1px solid rgba(201,168,76,0.25)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
