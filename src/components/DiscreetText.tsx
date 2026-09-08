'use client';

import React, { useState, useEffect } from 'react';
import { useDiscreet } from './DiscreetProvider';
import { Eye } from 'lucide-react';

interface DiscreetTextProps {
  children: React.ReactNode;
  fallbackLabel: string;
  className?: string;
  forceShow?: boolean;
}

export function DiscreetText({ children, fallbackLabel, className = '', forceShow = false }: DiscreetTextProps) {
  const { discreetModeEnabled } = useDiscreet();
  const [revealed, setRevealed] = useState(false);

  // Reset reveal state if discreet mode is toggled back on globally
  useEffect(() => {
    if (discreetModeEnabled) {
      setRevealed(false);
    }
  }, [discreetModeEnabled]);

  const shouldHide = discreetModeEnabled && !revealed && !forceShow;

  if (shouldHide) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-[var(--eh-muted)] italic">{fallbackLabel}</span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRevealed(true);
          }}
          className="p-1 text-[var(--eh-muted)] hover:text-[var(--eh-plum)] transition-colors rounded hover:bg-[var(--eh-canvas)] ml-2"
          title="Reveal"
        >
          <Eye size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      {discreetModeEnabled && !forceShow && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setRevealed(false);
          }}
          className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 p-1 text-[var(--eh-muted)] hover:text-[var(--eh-plum)] bg-[var(--eh-paper)] rounded shadow-sm text-[10px] uppercase font-bold"
        >
          Hide
        </button>
      )}
    </div>
  );
}
