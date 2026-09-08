'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EyeOff, Eye } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DiscreetContextType {
  discreetModeEnabled: boolean; // Persistent preference
  quickCoverActive: boolean; // Session state
  setQuickCoverActive: (active: boolean) => void;
  toggleDiscreetMode: () => void;
}

const DiscreetContext = createContext<DiscreetContextType>({
  discreetModeEnabled: false,
  quickCoverActive: false,
  setQuickCoverActive: () => {},
  toggleDiscreetMode: () => {},
});

export const useDiscreet = () => useContext(DiscreetContext);

export function DiscreetProvider({ children }: { children: React.ReactNode }) {
  const [discreetModeEnabled, setDiscreetModeEnabled] = useState(false);
  const [quickCoverActive, setQuickCoverActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { profile, updateProfile } = useAppStore();

  // Load preference from profile (using Zustand for now, mimicking DB load)
  useEffect(() => {
    if (profile) {
      setDiscreetModeEnabled(profile.discreet_mode || false);
    }
    setLoaded(true);
  }, [profile]);

  // Handle window blur for auto-cover
  useEffect(() => {
    const handleBlur = () => {
      if (profile?.auto_cover_on_blur) {
        setQuickCoverActive(true);
      }
    };
    
    // Also cover on visibility hidden (switching tabs)
    const handleVisibilityChange = () => {
      if (document.hidden && profile?.auto_cover_on_blur) {
        setQuickCoverActive(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profile?.auto_cover_on_blur]);

  const toggleDiscreetMode = () => {
    const newValue = !discreetModeEnabled;
    setDiscreetModeEnabled(newValue);
    updateProfile({ discreet_mode: newValue });
  };

  if (!loaded) return <div className="min-h-screen bg-[var(--eh-mauve)]"></div>;

  return (
    <DiscreetContext.Provider value={{ discreetModeEnabled, quickCoverActive, setQuickCoverActive, toggleDiscreetMode }}>
      {quickCoverActive ? (
        <div className="fixed inset-0 z-50 bg-[var(--eh-paper)] flex flex-col items-center justify-center p-6 text-center">
          <EyeOff size={48} className="text-[var(--eh-muted)] mb-4" />
          <h1 className="font-serif font-bold text-2xl text-[var(--eh-ink)] mb-2">Workday</h1>
          <p className="text-[var(--eh-muted)] mb-8">Personal details are hidden on this screen.</p>
          <button 
            onClick={() => setQuickCoverActive(false)}
            className="px-6 py-3 bg-[var(--eh-plum)] text-white font-bold rounded-lg hover:bg-[#3a103b] transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            Return to my view
          </button>
        </div>
      ) : null}
      
      {/* 
        We don't hide the children when quickCoverActive is true, 
        because we don't want to unmount the entire app and lose unsaved state.
        We just overlay the cover on top using z-50 and full screen.
        But wait, the spec says "replaces main content". Overlay is safer for state.
      */}
      <div style={{ display: quickCoverActive ? 'none' : 'block', height: '100%' }}>
        {children}
      </div>
    </DiscreetContext.Provider>
  );
}
