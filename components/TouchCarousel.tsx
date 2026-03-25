import React, { useRef, useState, useCallback, useEffect } from 'react';

interface TouchCarouselProps {
  children: React.ReactNode;
  className?: string; // classes do wrapper externo (container)
  innerClassName: string; // classes do div interno animado
}

/**
 * TouchCarousel
 * Wrapper para carrosséis com animação CSS marquee.
 * - No desktop: comportamento padrão (hover pausa).
 * - No mobile: toque pausa a animação e permite arrastar com fluido nativo.
 *   Ao soltar, a animação retoma após 2s de inatividade.
 *   Utiliza a suavidade nativa do sistema (momentum scrolling).
 */
export const TouchCarousel: React.FC<TouchCarouselProps> = ({
  children,
  className = '',
  innerClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleTouchStart = () => {
    pauseAnimation();
  };

  const handleTouchEnd = () => {
    scheduleResume();
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto scrollbar-hide ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        scrollBehavior: 'smooth',
      }}
      onTouchStart={handleTouchStart}
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
