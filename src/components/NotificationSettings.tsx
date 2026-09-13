'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, BellOff, Loader2 } from 'lucide-react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export function NotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const toggleSubscription = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) await subscription.unsubscribe();
        setIsSubscribed(false);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error("Please log in first.");

        if (!VAPID_PUBLIC_KEY) throw new Error("Push notifications not configured on the server.");

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        const res = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            account_id: session.user.id
          })
        });

        if (!res.ok) throw new Error("Failed to save subscription to server.");
        
        setIsSubscribed(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to toggle notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="w-full bg-[var(--eh-paper)] p-6 rounded-[var(--eh-card-radius)] shadow-[var(--eh-shadow)] border border-[var(--eh-line)] mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif font-bold text-[var(--eh-plum)] flex items-center gap-2">
            {isSubscribed ? <Bell size={18} /> : <BellOff size={18} />}
            Push Reminders
          </h2>
          <p className="text-[var(--eh-muted)] text-sm mt-1">
            {isSubscribed ? "You will receive gentle daily nudges." : "Receive gentle nudges to check in."}
          </p>
        </div>
        
        <button
          onClick={toggleSubscription}
          disabled={isLoading}
          className={"px-4 py-2 rounded font-bold text-sm transition-colors " + (isSubscribed ? "bg-[var(--eh-line)] text-[var(--eh-plum)] hover:bg-[var(--eh-canvas)]" : "bg-[var(--eh-plum)] text-white hover:opacity-90")}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : isSubscribed ? 'Disable' : 'Enable'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
