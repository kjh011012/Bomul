import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo, useRef } from 'react';

interface RewardBurstProps {
  show: boolean;
  itemName: string;
  itemIcon: string;
  onComplete?: () => void;
}

export function RewardBurst({ show, itemName, itemIcon, onComplete }: RewardBurstProps) {
  const [phase, setPhase] = useState(0); // 0: burst, 1: item reveal, 2: text
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (i / 24) * Math.PI * 2,
    dist: 80 + Math.random() * 60,
    size: Math.random() * 6 + 3,
    color: ['#e8d48c', '#c9a84c', '#FFD700', '#d4783c', '#3d6b4e', '#fff'][i % 6],
    delay: i * 0.02,
    rotEnd: (Math.random() - 0.5) * 360,
  })), []);

  const rays = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    length: 120 + Math.random() * 40,
  })), []);

  useEffect(() => {
    if (show) {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 400);
      const t2 = setTimeout(() => setPhase(2), 1000);
      const t3 = setTimeout(() => onComplete?.(), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [show]);

  // Confetti canvas
  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const confetti: { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number; rotSpeed: number }[] = [];
    const colors = ['#e8d48c', '#c9a84c', '#FFD700', '#d4783c', '#3d6b4e', '#4a9eb8', '#fff'];
    for (let i = 0; i < 60; i++) {
      confetti.push({
        x: canvas.offsetWidth / 2 + (Math.random() - 0.5) * 40,
        y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.25;
        c.vx *= 0.99;
        c.rotation += c.rotSpeed;
        if (c.y < canvas.offsetHeight + 20) alive = true;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        ctx.restore();
      });
      if (alive) frame = requestAnimationFrame(animate);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(animate); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, rgba(26,58,42,0.7) 0%, rgba(10,25,15,0.92) 100%)' }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Light rays */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {rays.map(r => (
              <motion.div
                key={r.id}
                className="absolute origin-bottom"
                style={{
                  width: 2,
                  height: r.length,
                  background: `linear-gradient(to top, rgba(232,212,140,0.3), transparent)`,
                  transform: `rotate(${r.angle}deg)`,
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.6, 0], scaleY: [0, 1, 1.2] }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
            ))}
          </div>

          {/* Burst particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{ width: p.size, height: p.size, background: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.dist,
                y: Math.sin(p.angle) * p.dist,
                opacity: 0,
                scale: 0,
                rotate: p.rotEnd,
              }}
              transition={{ duration: 1.2, delay: p.delay + 0.3, ease: 'easeOut' }}
            />
          ))}

          {/* Main item */}
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
              className="flex flex-col items-center gap-5 z-10"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(232,212,140,0.3), 0 0 60px rgba(201,168,76,0.15)',
                    '0 0 50px rgba(232,212,140,0.5), 0 0 100px rgba(201,168,76,0.25)',
                    '0 0 30px rgba(232,212,140,0.3), 0 0 60px rgba(201,168,76,0.15)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(145deg, #c9a84c, #e8d48c, #c9a84c)',
                }}
              >
                {/* Inner ring */}
                <div className="absolute inset-2 rounded-full"
                  style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-6xl"
                >
                  {itemIcon}
                </motion.span>
              </motion.div>

              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#c9a84c] text-xs tracking-widest"
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                  >
                    유물을 획득했어요!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-xl mt-2"
                    style={{ fontFamily: "'Noto Serif KR', serif" }}
                  >
                    {itemName}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
