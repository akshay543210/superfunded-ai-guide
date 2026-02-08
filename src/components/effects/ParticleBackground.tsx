import { useMemo } from 'react';
import { motion } from 'framer-motion';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
};

const ParticleBackground = () => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 30 + 20,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Cosmic gradient base */}
      <div className="absolute inset-0 gradient-bg" />

      {/* Animated ambient glow orbs with framer-motion */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.04]"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle, hsl(268 85% 58%), transparent 70%)',
        }}
      />
      <motion.div
        className="absolute bottom-[-30%] right-[-15%] w-[50vw] h-[50vw] rounded-full opacity-[0.03]"
        animate={{
          y: [0, 25, 0],
          x: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        style={{
          background: 'radial-gradient(circle, hsl(280 90% 65%), transparent 70%)',
        }}
      />
      <motion.div
        className="absolute top-[30%] right-[5%] w-[30vw] h-[30vw] rounded-full opacity-[0.025]"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 10,
        }}
        style={{
          background: 'radial-gradient(circle, hsl(200 95% 55%), transparent 70%)',
        }}
      />

      {/* Cinematic light streak */}
      <motion.div
        className="absolute top-0 left-[20%] w-[1px] h-[60vh] opacity-[0.03]"
        animate={{
          opacity: [0.02, 0.06, 0.02],
          scaleY: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(268 85% 58%), transparent)',
        }}
      />
      <motion.div
        className="absolute top-[10%] right-[35%] w-[1px] h-[40vh] opacity-[0.02]"
        animate={{
          opacity: [0.01, 0.04, 0.01],
          scaleY: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        style={{
          background: 'linear-gradient(to bottom, transparent, hsl(280 90% 65%), transparent)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-particle"
          style={{
            left: `${p.x}%`,
            bottom: `-${p.size}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(268 85% 58% / ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px hsl(268 85% 58% / ${p.opacity * 0.5})`,
            animationDuration: `${p.speed}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Giant "SF" watermark with slow motion */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-[30vw] sm:text-[20vw] font-display font-bold select-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px hsl(268 85% 58% / 0.03)',
          }}
        >
          SF
        </motion.div>
      </div>

      {/* Top edge vignette */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom edge vignette */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default ParticleBackground;
