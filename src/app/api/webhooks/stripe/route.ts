import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // Would use service_role key for admin bypass

export async function POST(req: Request) {
  try {
    const body = await req.text();
    // const sig = req.headers.get('stripe-signature') as string;
    
    // In Phase C, you will verify the webhook signature here using Stripe SDK
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    // We parse the JSON for the dummy implementation
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email;

      // When Phase C is active, you will query Supabase via the Service Role Key
      // to set the account's subscription_status to 'active' where email matches.
      console.log(`Phase C Webhook Triggered: Payment received for ${customerEmail}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
