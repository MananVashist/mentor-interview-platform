// supabase/functions/create-razorpay-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS Preflight Request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Get Data from Client
    const { amount, receipt } = await req.json()

    // 3. Get Secrets from Supabase Vault
    const RZP_KEY = Deno.env.get('RAZORPAY_KEY_ID')
    const RZP_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!RZP_KEY || !RZP_SECRET) {
      throw new Error('Missing Razorpay Credentials in Edge Function')
    }

    // 4. Create Authorization Header (Basic Auth)
    const authHeader = `Basic ${btoa(`${RZP_KEY}:${RZP_SECRET}`)}`

    // 5. Call Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: amount, // Amount in paise (already converted by client)
        currency: 'INR',
        receipt: receipt,
        payment_capture: 1 
      })
    })

    const razorpayData = await response.json()

    if (!response.ok) {
      console.error('Razorpay Error:', razorpayData)
      throw new Error(razorpayData.error?.description || 'Failed to create order')
    }

    // 6. Return Order ID to Client
    return new Response(
      JSON.stringify(razorpayData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})