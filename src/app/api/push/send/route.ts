import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    webpush.setVapidDetails(
      'mailto:support@elevate-her-workday.com',
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
      return NextResponse.json({ error: 'No subscriptions found in the database for your account. Please tap Disable, then Enable again.' }, { status: 400 });
    }

    const payload = JSON.stringify({ title, message, url });
    
    let sentCount = 0;
    let lastError: any = null;
    let resLogs: string[] = [];

    const promises = subs.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      
      let resLog = 'Unknown';
      try {
        const pushRes = await webpush.sendNotification(pushSubscription, payload, {
          urgency: 'high',
          TTL: 60
        });
        resLog = pushRes.statusCode + " " + pushRes.body;
        sentCount++;
      } catch (err: any) {
        lastError = err;
        resLog = err.statusCode + " " + err.body + " " + err.message;
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error("Web Push Error:", err);
        }
      }
      
      // LOG TO CONSOLE SO I CAN VIEW IT
      console.log(`[PUSH_TRACE] endpoint=${sub.endpoint.substring(0,30)}... res=${resLog}`);
      resLogs.push(resLog);
    });

    await Promise.all(promises);

    if (sentCount === 0 && lastError) {
      throw lastError;
    }

    return NextResponse.json({ success: true, sentTo: sentCount, diagnostic: resLogs.join(" | ") });
  } catch (error: any) {
    console.error('Push send error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
