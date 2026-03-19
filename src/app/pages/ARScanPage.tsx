import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const stageImages = [
  'https://images.unsplash.com/photo-1545828363-51ed76c86636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMEtvcmVhbiUyMGZvcmVzdCUyMG1vcm5pbmclMjBtaXN0JTIwdHJhaWx8ZW58MXx8fHwxNzczODUwODI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1752487650659-3bef7f38f2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBjYXNjYWRlJTIwcm9ja3MlMjBuYXR1cmUlMjBzdHJlYW18ZW58MXx8fHwxNzczODUwODM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1769291632684-ddc42137875d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBzdW5saWdodCUyMGZvcmVzdCUyMGNhbm9weSUyMG1hZ2ljYWx8ZW58MXx8fHwxNzczODUwODI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1761140623139-840b6f04a3e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wZmlyZSUyMHdhcm0lMjBuaWdodCUyMGZvcmVzdCUyMGVtYmVyc3xlbnwxfHx8fDE3NzM4NTA4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1676480166342-2902ebf81c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwc3RvbmUlMjBydWlucyUyMG1vc3MlMjBjb3ZlcmVkJTIwdGVtcGxlfGVufDF8fHx8MTc3Mzg1MDgzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export function ARScanPage() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const num = Number(stageId);
  const [scanning, setScanning] = useState(true);
  const [found, setFound] = useState(false);
  const [progress, setProgress] = useState(0);

  const bgImage = stageImages[(num - 1) % stageImages.length];

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setFound(true);
            setScanning(false);
            return 100;
          }
          return p + Math.random() * 6 + 2;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Simulated camera view */}
      <div className="flex-1 relative">
        <ImageWithFallback
          src={bgImage}
          alt="Camera view"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: found ? 0.5 : 0.65 }}
        />

        {/* AR HUD overlay */}
        <div className="absolute inset-0">
          {/* Scan frame */}
          <div className="absolute top-16 left-8 right-8 bottom-32">
            {/* Animated corners */}
            {[
              'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
              'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
              'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
              'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
            ].map((cls, i) => (
              <motion.div
                key={i}
                className={`absolute w-14 h-14 ${cls}`}
                style={{ borderColor: found ? '#c9a84c' : '#4a9eb860' }}
                animate={found ? { borderColor: '#c9a84c' } : {}}
              />
            ))}

            {/* Scanning line */}
            {scanning && (
              <motion.div
                className="absolute left-3 right-3 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #4a9eb8 30%, #4a9eb8 70%, transparent 100%)',
                  boxShadow: '0 0 10px rgba(74,158,184,0.5)',
                }}
                animate={{ top: ['5%', '95%', '5%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />
            )}

            {/* Small scanning indicators */}
            {scanning && (
              <>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: '#4a9eb8',
                      left: `${25 + i * 25}%`,
                      top: `${30 + i * 20}%`,
                      boxShadow: '0 0 6px rgba(74,158,184,0.6)',
                    }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                  />
                ))}
              </>
            )}

            {/* Found seal overlay */}
            <AnimatePresence>
              {found && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Concentric rings */}
                  {[0, 1, 2].map(ring => (
                    <motion.div
                      key={ring}
                      className="absolute rounded-full"
                      style={{
                        width: 120 + ring * 50,
                        height: 120 + ring * 50,
                        border: `1px solid rgba(201,168,76,${0.3 - ring * 0.08})`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: ring * 0.15, duration: 0.5 }}
                    />
                  ))}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.1)',
                        '0 0 50px rgba(201,168,76,0.6), 0 0 100px rgba(201,168,76,0.2)',
                        '0 0 30px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.1)',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-28 h-28 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle, rgba(232,212,140,0.25), rgba(201,168,76,0.08))' }}
                  >
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                      className="text-5xl"
                      style={{ filter: 'drop-shadow(0 0 15px rgba(201,168,76,0.5))' }}
                    >
                      ✦
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/map')}
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-white text-lg">✕</span>
            </motion.button>
            <div className="px-4 py-2 rounded-full backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-sm" style={{
                color: found ? '#e8d48c' : '#b0d8e8',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                {found ? '✦ 봉인을 찾았어요!' : `스테이지 ${num} · 표식을 찾아 비춰보세요`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="px-6 py-6 relative"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85) 30%)' }}>
        {!found ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="text-lg"
                style={{ color: '#4a9eb8' }}
              >◎</motion.div>
              <span className="text-white text-sm" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                탐지 중... {Math.min(100, Math.round(progress))}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #4a9eb8, #c9a84c)',
                  width: `${Math.min(100, progress)}%`,
                  boxShadow: '0 0 8px rgba(74,158,184,0.4)',
                }}
              />
            </div>
          </div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/stage/${stageId}/puzzle`)}
            className="w-full py-4 rounded-2xl text-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #b8942e, #c9a84c, #e8d48c)',
              color: '#1a3a2a',
              fontFamily: "'Noto Sans KR', sans-serif",
              boxShadow: '0 4px 30px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            <span className="relative z-10">봉인 열기</span>
            <motion.div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            />
          </motion.button>
        )}
      </div>
    </div>
  );
}
