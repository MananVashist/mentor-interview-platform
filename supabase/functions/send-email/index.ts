// supabase/functions/send-email/index.ts
//
// The portal's one mail route. It stays open to signed-out callers because Forgot password and sign-up need it, so what a
// caller may do is decided here (JAR-329):
//   password-reset  the link goes to the account's own address and never appears in a log; the answer is the same whether
//                   or not the account exists
//   helpdesk        anyone may notify the helpdesk
//   a person        a signed-in caller may mail themselves, someone they share a booking with, or, as an admin, any member
//   a new account   a signed-out caller may trigger the fixed welcome for an account made in the last 15 minutes
// Anything else is refused and sends nothing.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const HELPDESK = 'crackjobshelpdesk@gmail.com'
const NEW_ACCOUNT_MS = 15 * 60 * 1000
const MAX_HTML = 200_000

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const reply = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } })

async function send(to: string[], subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({ from: 'CrackJobs <no-reply@crackjobs.com>', to, subject, html }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Resend API error: ${JSON.stringify(data)}`)
  return data.id as string
}

const page = (title: string, body: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #0E9384 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
  .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
  .button { display: inline-block; background: #0E9384; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
  .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding: 20px; }
</style></head><body><div class="container">
  <div class="header"><h1>${title}</h1></div>
  <div class="content">${body}</div>
  <div class="footer"><p><strong>CrackJobs</strong> - Mock Interview Platform</p></div>
</div></body></html>`

const resetEmail = (link: string) => page('🔐 Reset Your Password', `
  <p>Hello,</p>
  <p>You requested to reset your password for your CrackJobs account.</p>
  <div style="text-align: center; margin: 30px 0;"><a href="${link}" class="button">Reset Password</a></div>
  <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>`)

const welcomeEmail = () => page('Welcome to CrackJobs! 🎉', `
  <p>Hello,</p>
  <p>Your CrackJobs account is ready. Sign in to book your first mock interview.</p>
  <div style="text-align: center; margin: 30px 0;"><a href="https://crackjobs.com" class="button">Go to CrackJobs</a></div>`)

async function callerOf(req: Request) {
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await admin.auth.getUser(token)
  return error || !data.user ? null : data.user
}

const memberByEmail = async (address: string) => {
  const { data } = await admin.from('profiles').select('id, role').eq('email', address).maybeSingle()
  return data as { id: string; role: string } | null
}

async function mayReceive(address: string, caller: { id: string; email?: string } | null) {
  if (address === HELPDESK) return true
  if (!caller) return false
  if ((caller.email ?? '').toLowerCase() === address) return true
  const recipient = await memberByEmail(address)
  if (!recipient) return false
  const { data: me } = await admin.from('profiles').select('role').eq('id', caller.id).maybeSingle()
  if (me?.role === 'admin') return true
  const { count } = await admin
    .from('interview_packages')
    .select('id', { count: 'exact', head: true })
    .or(`and(candidate_id.eq.${caller.id},mentor_id.eq.${recipient.id}),and(candidate_id.eq.${recipient.id},mentor_id.eq.${caller.id})`)
  return (count ?? 0) > 0
}

async function isNewAccount(address: string) {
  const recipient = await memberByEmail(address)
  if (!recipient) return false
  const { data } = await admin.auth.admin.getUserById(recipient.id)
  const made = data?.user?.created_at ? new Date(data.user.created_at).getTime() : 0
  return Date.now() - made < NEW_ACCOUNT_MS
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { to, subject, html, type, email } = await req.json()

    if (type === 'password-reset') {
      const address = String(email ?? '').trim().toLowerCase()
      // the answer never says whether the account exists
      if (address) {
        const { data, error } = await admin.auth.admin.generateLink({
          type: 'recovery',
          email: address,
          options: { redirectTo: 'https://crackjobs.com/auth/reset-password' },
        })
        if (!error && data?.properties?.action_link) {
          await send([address], 'Reset Your CrackJobs Password', resetEmail(data.properties.action_link))
        }
      }
      return reply({ success: true })
    }

    const recipients = (Array.isArray(to) ? to : [to]).map((a) => String(a ?? '').trim().toLowerCase()).filter(Boolean)
    if (!recipients.length || typeof subject !== 'string' || typeof html !== 'string' || html.length > MAX_HTML) {
      return reply({ success: false, error: 'Invalid request' }, 400)
    }

    const caller = await callerOf(req)
    const allowed = await Promise.all(recipients.map((address) => mayReceive(address, caller)))
    if (allowed.every(Boolean)) {
      const id = await send(recipients, subject.slice(0, 200), html)
      return reply({ success: true, id })
    }

    if (!caller && recipients.length === 1 && subject.startsWith('Welcome to CrackJobs') && (await isNewAccount(recipients[0]))) {
      const id = await send(recipients, 'Welcome to CrackJobs! 🎉', welcomeEmail())
      return reply({ success: true, id })
    }

    return reply({ success: false, error: 'Not allowed' }, 403)
  } catch (error: any) {
    console.error('[send-email] Error:', error?.message)
    return reply({ success: false, error: 'Could not send' }, 400)
  }
})
