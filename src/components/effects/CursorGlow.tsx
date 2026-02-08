import { useEffect, useState, useCallback } from 'react';

/**
 * Desktop-only cursor glow that follows mouse movement.
 * Disabled on touch devices for performance.
 */
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="fixed w-[300px] h-[300px] rounded-full"
        style={{
          left: pos.x - 150,
          top: pos.y - 150,
          background: 'radial-gradient(circle, hsl(268 85% 58% / 0.06), transparent 70%)',
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
        }}
      />
    </div>
  );
};

export default CursorGlow;
