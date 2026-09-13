import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    webpush.setVapidDetails(
      'mailto:support@elevateherworkday.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      process.env.VAPID_PRIVATE_KEY || ''
    );

    const { data: subs, error } = await supabase.from('push_subscriptions').select('*');

    if (error) throw error;
    if (!subs || subs.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' });
    }

    const payload = JSON.stringify({ 
      title: 'Elevate HER Workday', 
      message: 'Take a moment to check your capacity today.', 
      url: '/today' 
    });

    let sentCount = 0;
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
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error("Cron Web Push Error:", err);
        }
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ success: true, sentTo: sentCount });
  } catch (error: any) {
    console.error('Cron push error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
