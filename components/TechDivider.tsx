import React from 'react';

export const TechDivider: React.FC = () => {
  return (
    <div className="relative h-px w-full bg-slate-800 overflow-hidden">
      {/* Luz pulsante de fundo */}
      <div className="absolute inset-0 bg-brand-500/10 blur-sm"></div>
      
      {/* Linha de varredura animada */}
      <div className="tech-scan-line"></div>
      
      {/* Glow central fixo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-brand-500/20 blur-[40px] rounded-full"></div>
    </div>
  );
};