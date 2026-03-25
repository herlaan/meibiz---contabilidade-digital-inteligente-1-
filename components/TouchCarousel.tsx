import React, { useRef, useState, useCallback } from 'react';

interface TouchCarouselProps {
  children: React.ReactNode;
  className?: string; // classes do wrapper externo (container)
  innerClassName: string; // classes do div interno animado
}

/**
 * TouchCarousel
 * Wrapper para carrosséis com animação CSS marquee.
 * - No desktop: comportamento padrão (hover pausa).
 * - No mobile: toque pausa a animação e permite arrastar manualmente com o dedo.
 *   Ao soltar, a animação retoma após 2s de inatividade.
 *   Scrolling é ultra-suave, sem travamentos (sem snap).
 */
export const TouchCarousel: React.FC<TouchCarouselProps> = ({
  children,
  className = '',
  innerClassName,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Posição do toque inicial e posição de scroll inicial
  const touchStartX = useRef(0);
  const scrollStartX = useRef(0);

  const pauseAnimation = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    pauseAnimation();
    touchStartX.current = e.touches[0].clientX;
    scrollStartX.current = trackRef.current?.parentElement?.scrollLeft ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current?.parentElement) return;
    const delta = touchStartX.current - e.touches[0].clientX;
    trackRef.current.parentElement.scrollLeft = scrollStartX.current + delta;
  };

  const handleTouchEnd = () => {
    scheduleResume();
  };

  return (
    <div
      className={`overflow-x-auto scrollbar-hide ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={trackRef}
        className={innerClassName}
        style={isPaused ? { animationPlayState: 'paused' } : undefined}
      >
        {children}
      </div>
    </div>
  );
};
