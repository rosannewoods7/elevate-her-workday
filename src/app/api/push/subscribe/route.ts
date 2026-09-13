import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder') as string;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { subscription, account_id } = await req.json();

    if (!subscription || !account_id) {
      return NextResponse.json({ error: 'Missing subscription or account_id' }, { status: 400 });
    }

    const { endpoint, keys } = subscription;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    const { error } = await supabase.from('push_subscriptions').upsert({
      account_id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth
    }, { onConflict: 'endpoint' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscribe error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
