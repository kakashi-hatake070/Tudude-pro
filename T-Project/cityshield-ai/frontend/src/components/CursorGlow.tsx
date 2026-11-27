import React, { useEffect, useRef, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Disable on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const animate = () => {
      // Smooth lerp follow
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 220}px, ${currentY - 220}px, 0)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mouseX - 70}px, ${mouseY - 70}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-40 overflow-hidden transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Wide ambient aura */}
      <div
        ref={glowRef}
        className="w-[440px] h-[440px] rounded-full will-change-transform opacity-35 dark:opacity-55 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,111,0,0.28) 0%, rgba(23,105,210,0.22) 45%, rgba(23,105,210,0) 72%)',
        }}
      />
      {/* Crisp inner spotlight */}
      <div
        ref={coreRef}
        className="fixed top-0 left-0 w-[140px] h-[140px] rounded-full will-change-transform opacity-25 dark:opacity-45 blur-xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,159,67,0.5) 0%, rgba(56,189,248,0.25) 55%, rgba(0,0,0,0) 75%)',
        }}
      />
    </div>
  );
};
