import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // Initialize Stripe inside the handler to prevent build-time crashes if env var is missing
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
      apiVersion: '2026-08-26.dahlia',
    });

    // Initialize Supabase Admin inside the handler to prevent build-time crashes if URL is missing
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy.url',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
    );
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      console.error('No stripe-signature header found');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // Cryptographically verify that this webhook actually came from Stripe
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle successful payments
    if (event.type === 'checkout.session.completed' || event.type === 'charge.succeeded') {
      const dataObject = event.data.object as any;
      
      // Try to get the email from various possible fields depending on the event type
      const customerEmail = 
        dataObject.customer_details?.email || 
        dataObject.receipt_email || 
        dataObject.billing_details?.email;
        
      const customerId = dataObject.customer as string;

      if (customerEmail) {
        console.log(`[Stripe Webhook] Payment received for ${customerEmail}. Upgrading to Premium...`);

        // Use a secure RPC to find the user by their Auth email and upgrade their profile
        const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('upgrade_user_by_email', {
          user_email: customerEmail.toLowerCase(),
          stripe_cust_id: customerId || null
        });

        if (rpcError) {
          console.error('[Stripe Webhook] Error calling upgrade RPC:', rpcError);
        } else {
          console.log(`[Stripe Webhook] Successfully upgraded user: ${customerEmail}`);
        }
      } else {
        console.warn('[Stripe Webhook] No customer email found in the webhook payload.');
      }
    }

    // Handle subscription cancellations
    if (event.type === 'customer.subscription.deleted') {
       const sub = event.data.object as any;
       const customerId = sub.customer as string;
       if (customerId) {
          await supabaseAdmin.from('profiles').update({ subscription_tier: 'free' }).eq('stripe_customer_id', customerId);
          console.log(`[Stripe Webhook] Downgraded customer ${customerId} to free.`);
       }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
