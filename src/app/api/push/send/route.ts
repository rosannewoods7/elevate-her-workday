import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    webpush.setVapidDetails(
      'mailto:support@elevateherworkday.com',
      (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'placeholder') as string,
      (process.env.VAPID_PRIVATE_KEY || 'placeholder') as string
    );

    const { account_id, title, message, url, delay } = await req.json();

    if (!account_id) {
      return NextResponse.json({ error: 'Missing account_id' }, { status: 400 });
    }

    const { data: subs, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('account_id', account_id);

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' });
    }

    // Wait on the backend if requested
    if (delay) {
       await new Promise(resolve => setTimeout(resolve, delay));
    }

    const payload = JSON.stringify({ title, message, url });
    
    let sentCount = 0;
    let lastError = null;

    const promises = subs.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      
      try {
        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err: any) {
        lastError = err;
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error("Web Push Error:", err);
          throw new Error(`Web Push Error: ${err.statusCode} - ${err.body}`);
        }
      }
    });

    await Promise.all(promises);

    if (sentCount === 0 && lastError) {
       throw lastError;
    }

    return NextResponse.json({ success: true, sentTo: sentCount });
  } catch (error: any) {
    console.error('Push send error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
