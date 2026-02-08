import { useEffect, useRef, useMemo } from 'react';

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

      {/* Ambient glow orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.04] animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(268 85% 58%), transparent 70%)',
          animationDuration: '20s',
        }}
      />
      <div
        className="absolute bottom-[-30%] right-[-15%] w-[50vw] h-[50vw] rounded-full opacity-[0.03] animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(280 90% 65%), transparent 70%)',
          animationDuration: '25s',
          animationDelay: '5s',
        }}
      />
      <div
        className="absolute top-[30%] right-[5%] w-[30vw] h-[30vw] rounded-full opacity-[0.025] animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(200 95% 55%), transparent 70%)',
          animationDuration: '30s',
          animationDelay: '10s',
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

      {/* Giant "SF" watermark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-[30vw] sm:text-[20vw] font-display font-bold select-none animate-rotate-slow"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px hsl(268 85% 58% / 0.03)',
            animationDuration: '120s',
          }}
        >
          SF
        </div>
      </div>

      {/* Top edge vignette */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom edge vignette */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default ParticleBackground;
