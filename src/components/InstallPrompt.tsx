'use client';

import { useState, useEffect } from 'react';
import { Share, Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || 
                 ('standalone' in window.navigator && (window.navigator as any).standalone === true);
    setIsStandalone(isPwa);

    // Check if previously dismissed
    const hasDismissed = localStorage.getItem('eh_pwa_dismissed') === 'true';
    setDismissed(hasDismissed);
  }, []);

  if (isStandalone) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('eh_pwa_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="bg-white p-4 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border-l-4 border-[var(--eh-plum)] mb-6 relative">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-[var(--eh-muted)] hover:text-[var(--eh-ink)]"
      >
        <X size={16} />
      </button>
      
      <div className="flex gap-3">
        <div className="mt-1 text-[var(--eh-plum)]">
          <Download size={24} />
        </div>
        <div>
          <h3 className="font-bold text-[var(--eh-ink)] text-sm mb-1">Add to Home Screen</h3>
          {isIOS ? (
            <p className="text-xs text-[var(--eh-muted)] leading-relaxed">
              For the best app experience, tap the <Share size={12} className="inline mx-1" /> Share button below and select <strong>"Add to Home Screen"</strong>.
            </p>
          ) : (
            <p className="text-xs text-[var(--eh-muted)] leading-relaxed">
              For the best app experience, tap the menu (?) and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
