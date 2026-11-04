// A signed-in candidate's order for a booking (JAR-329). The price is worked out here from the mentor's row, with the same
// formula as services/payment.service.ts, and a request for any other amount is refused: the amount is never the caller's.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

/** The booking's price in rupees, or null when the mentor or the session type is unknown. */
async function priceInr(mentorId: string, sessionType: string): Promise<number | null> {
  const { data: mentor } = await db
    .from("mentors")
    .select("session_price_inr, tier, intro_call_price")
    .eq("id", mentorId)
    .maybeSingle();
  if (!mentor) return null;
  const { data: tier } = await db
    .from("mentor_tiers")
    .select("percentage_cut")
    .eq("tier", mentor.tier || "bronze")
    .maybeSingle();
  if (!tier) return null;

  const base = mentor.session_price_inr || 0;
  const cut = (tier.percentage_cut || 50) / 100;
  if (sessionType === "intro") return mentor.intro_call_price ?? 0;
  if (sessionType === "bundle") return Math.round(Math.round(base * 2.5) / (1 - cut));
  if (sessionType === "mock") return Math.round(base / (1 - cut));
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const reply = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: who } = token ? await db.auth.getUser(token) : { data: { user: null } };
    if (!who.user) return reply({ error: "Sign in to book" }, 401);

    const { amount, receipt, notes } = await req.json();
    if (!amount || !receipt) throw new Error("Missing amount/receipt");

    const amountPaise = parseInt(String(amount), 10);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      throw new Error("Invalid amount (must be positive integer in paise)");
    }

    if (notes?.candidate_id !== who.user.id) return reply({ error: "Not your booking" }, 403);
    const expected = await priceInr(String(notes?.mentor_id ?? ""), String(notes?.session_type ?? "mock"));
    if (expected === null || expected * 100 !== amountPaise) {
      console.error("[RZP][Edge] Amount refused for mentor", notes?.mentor_id);
      return reply({ error: "The price has changed. Please refresh and try again." }, 400);
    }

    const KEY = Deno.env.get("RAZORPAY_KEY_ID");
    const SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY || !SECRET) throw new Error("Missing Razorpay credentials");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${KEY}:${SECRET}`)}`,
      },
      body: JSON.stringify({
        amount: amountPaise, // paise
        currency: "INR",
        receipt: receipt,
        payment_capture: 1,
        notes: {
          candidate_id: who.user.id,
          mentor_id: notes.mentor_id,
          session_type: notes.session_type,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("[RZP][Edge] Razorpay error:", data?.error?.code);
      throw new Error(data.error?.description || "Failed to create order");
    }

    return reply({ ...data, key_id: KEY }, 200);
  } catch (err) {
    console.error("[RZP][Edge] Fatal:", err?.message);
    return reply({ error: err.message }, 400);
  }
});
