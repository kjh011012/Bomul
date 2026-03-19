import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X } from 'lucide-react';

interface HintModalProps {
  show: boolean;
  onClose: () => void;
  stageHints: string[];
}

const runeQuizzes = [
  { q: '봉황의 깃털은 어떤 색?', a: ['금색', '파란색', '초록색'], correct: 0 },
  { q: '물결 룬은 무엇을 상징할까요?', a: ['용기', '직감', '추적'], correct: 1 },
  { q: '매듭 룬의 힘은?', a: ['에너지', '연결', '흐름'], correct: 1 },
  { q: '수호자들이 가장 먼저 지킨 것은?', a: ['감각', '보물', '길'], correct: 0 },
  { q: '물은 어디로 흘러갈까요?', a: ['위', '아래', '안'], correct: 1 },
];

export function HintModal({ show, onClose, stageHints }: HintModalProps) {
  const { useHint } = useGame();
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [quizIdx] = useState(() => Math.floor(Math.random() * runeQuizzes.length));
  const quiz = runeQuizzes[quizIdx];

  const handleAnswer = (idx: number) => {
    useHint();
    const correct = idx === quiz.correct;
    setQuizResult(correct);
    setPhase('result');
  };

  const reset = () => {
    setPhase('quiz');
    setQuizResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(10,25,15,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={reset}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md rounded-t-3xl p-6"
            style={{
              background: 'linear-gradient(180deg, #FDF8F0, #F0E8D8)',
              boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: '#e0d8cc' }} />

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(145deg, #c9a84c, #e8d48c)' }}>
                  <span className="text-lg">🐦</span>
                </div>
                <h3 className="text-[#1A3A2A]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  봉이에게 물어보기
                </h3>
              </div>
              <button onClick={reset} className="text-[#a0a090] w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(26,58,42,0.04)' }}>
                <X size={16} />
              </button>
            </div>

            {phase === 'quiz' ? (
              <div>
                <p className="text-[#8a8a7a] text-xs mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                  힌트를 열려면 작은 퀴즈를 풀어보세요!
                </p>
                <p className="text-[#1A3A2A] mb-4" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                  {quiz.q}
                </p>
                <div className="flex flex-col gap-2">
                  {quiz.a.map((a, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(i)}
                      className="py-3 px-4 rounded-xl text-left text-sm"
                      style={{
                        background: '#fff',
                        border: '1px solid rgba(201,168,76,0.15)',
                        color: '#1A3A2A',
                        fontFamily: "'Noto Sans KR', sans-serif",
                      }}
                    >
                      {a}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm mb-3" style={{
                  color: quizResult ? '#3d6b4e' : '#8a8a7a',
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}>
                  {quizResult ? '✨ 맞았어요! 선명한 힌트예요.' : '봉인이 다른 반응을 보였지만, 힌트는 드릴게요.'}
                </p>
                <div className="p-4 rounded-xl mb-4" style={{
                  background: quizResult ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${quizResult ? 'rgba(201,168,76,0.2)' : 'rgba(0,0,0,0.05)'}`,
                }}>
                  <p className="text-sm leading-relaxed" style={{
                    color: '#1A3A2A',
                    fontFamily: "'Noto Sans KR', sans-serif",
                    filter: quizResult ? 'none' : 'blur(0.8px)',
                    opacity: quizResult ? 1 : 0.6,
                  }}>
                    {stageHints[0] || '화면보다 주변이 더 큰 힌트일지도 몰라요.'}
                  </p>
                </div>
                {stageHints.length > 1 && quizResult && (
                  <p className="text-xs text-[#6B5E4F] mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    💡 {stageHints[1]}
                  </p>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={reset}
                  className="w-full py-3.5 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #1a3a2a, #2a4a3a)',
                    color: '#e8d48c',
                    fontFamily: "'Noto Sans KR', sans-serif",
                  }}
                >
                  알겠어요!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
