// supabase/functions/send-email/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { to, subject, html, type, email } = await req.json()

    let emailSubject = subject
    let emailHtml = html

    // Handle password reset type
    if (type === 'password-reset') {
      console.log('[send-email] Generating password reset link for:', email)
      
      // Create Supabase admin client
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      // Generate recovery link
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email,
      })

      if (error) {
        console.error('[send-email] Error generating reset link:', error)
        throw error
      }

      const resetLink = data.properties.action_link
      console.log('[send-email] Reset link generated successfully')

      // Create branded email
      emailSubject = 'Reset Your CrackJobs Password'
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            .header { 
              background: linear-gradient(135deg, #0E9384 0%, #059669 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px 8px 0 0; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content { 
              background: #fff; 
              padding: 30px; 
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .button { 
              display: inline-block; 
              background: #0E9384; 
              color: white !important; 
              padding: 14px 28px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: 600;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 30px;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested to reset your password for your CrackJobs account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                If you didn't request this, you can safely ignore this email. This link expires in 1 hour.
              </p>
            </div>
            <div class="footer">
              <p><strong>CrackJobs</strong> - Mock Interview Platform</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    console.log('[send-email] Sending email to:', to)

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CrackJobs <no-reply@crackjobs.com>',
        to: Array.isArray(to) ? to : [to],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const resData = await res.json()

    if (!res.ok) {
      console.error('[send-email] Resend error:', resData)
      throw new Error(`Resend API error: ${JSON.stringify(resData)}`)
    }

    console.log('[send-email] ✅ Email sent successfully:', resData.id)

    return new Response(
      JSON.stringify({ success: true, id: resData.id }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error: any) {
    console.error('[send-email] ❌ Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  }
})