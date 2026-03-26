// services/payment.service.ts
import { supabase } from '@/lib/supabase/client';
import { EMAIL_TEMPLATES } from './email.templates';
import { DateTime } from 'luxon';

export const ENABLE_RAZORPAY = true;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://crackjobs.com';

type SessionType = 'intro' | 'mock' | 'bundle';

const compileTemplate = (template: string, data: Record<string, any>) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
};

// 🟢 Safely updated to accept calendarHtml
export async function sendEmail(to: string, subject: string, templateHtml: string, data: Record<string, any>, calendarHtml?: string) {
  try {
    let compiledHtml = compileTemplate(templateHtml, data);
    
    // 🟢 Inject Calendar HTML directly into the email body since the Edge Function drops attachments
    // We insert it right before the closing footer so it stays cleanly inside the email container
    if (calendarHtml) {
      compiledHtml = compiledHtml.replace(/<div class="footer">/g, `${calendarHtml}\n    <div class="footer">`);
    }

    console.log(`📧 [Email Service] Sending to: ${to}`);
    const { data: resData, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html: compiledHtml }
    });
    if (error || !resData?.success) {
      console.error('[Email Service] Failed:', error || resData);
      return false;
    }
    console.log('[Email Service] ✅ Success! ID:', resData.id);
    return true;
  } catch (e) {
    console.error('[Email Service] Exception:', e);
    return false;
  }
}

// 🟢 Generate "Add to Calendar" HTML block with secure dashboard links
const generateCalendarHtml = (sessions: any[], sessionType: SessionType, title: string, dashboardLink: string) => {
  let html = `
    <div style="margin-top: 24px; margin-bottom: 24px; padding: 20px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; text-align: center;">
      <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #0F172A;">📅 Add to your Calendar</h3>
      <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">(Join the meeting through your CrackJobs dashboard)</p>
  `;

  sessions.forEach((s: any, i: number) => {
    if (!s.scheduled_at) return;
    const start = new Date(s.scheduled_at);
    const durationMin = sessionType === 'intro' ? 25 : 55;
    const end = new Date(start.getTime() + durationMin * 60000);

    const formatDateForGoogle = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const gStart = formatDateForGoogle(start);
    const gEnd = formatDateForGoogle(end);
    
    const description = encodeURIComponent(`Join your meeting through the CrackJobs dashboard.\n\nClick here to join at the scheduled time: ${dashboardLink}`);
    const sessionTitle = encodeURIComponent(sessions.length > 1 ? `${title} (Session ${i+1})` : title);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${sessionTitle}&dates=${gStart}/${gEnd}&details=${description}`;
    const outlookCalUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${sessionTitle}&startdt=${encodeURIComponent(start.toISOString())}&enddt=${encodeURIComponent(end.toISOString())}&body=${description}`;

    html += `<div style="margin-bottom: ${sessions.length > 1 && i < sessions.length - 1 ? '16px' : '0'};">`;
    if (sessions.length > 1) {
      const formattedDate = start.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      html += `<div style="font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 8px;">Session ${i+1}: ${formattedDate} IST</div>`;
    }
    html += `
      <a href="${googleCalUrl}" target="_blank" style="display: inline-block; background-color: #fff; border: 1px solid #CBD5E1; color: #334155; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 4px;">Google Calendar</a>
      <a href="${outlookCalUrl}" target="_blank" style="display: inline-block; background-color: #fff; border: 1px solid #CBD5E1; color: #334155; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 4px;">Outlook</a>
    `;
    html += `</div>`;
  });

  html += `</div>`;
  return html;
};

export const paymentService = {

  async checkBookingConflict(mentorId: string, selectedSlots: string[]) {
    if (!selectedSlots || selectedSlots.length === 0) throw new Error('No time slot selected');

    console.log('[Payment] 🔍 Checking booking conflicts for:', selectedSlots);

    const slotsQueryStr = selectedSlots.map(slot => DateTime.fromISO(slot).toFormat('yyyy-MM-dd HH:mm:ss'));

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('scheduled_at, status')
      .eq('mentor_id', mentorId)
      .in('status', ['awaiting_payment', 'pending', 'confirmed', 'completed'])
      .in('scheduled_at', slotsQueryStr);

    if (error) throw new Error('Unable to verify slot availability.');
    if (data && data.length > 0) throw new Error('One or more slots were just booked. Please select different times.');

    console.log('[Payment] ✅ No conflicts found');
  },

  async createPackage(
    candidateId: string,
    mentorId: string,
    interviewProfileId: number,
    skillIds: string | string[], 
    selectedSlots: string[],
    sessionType: SessionType = 'mock',
    jdText?: string,
  ) {
    try {
      console.log('🚀 Starting Booking Process...');
      
      const parsedSkillIds = (Array.isArray(skillIds) ? skillIds : [skillIds])
        .filter(Boolean)
        .flatMap(id => String(id).split(',').map(s => s.trim()))
        .filter(Boolean);

      const paired = selectedSlots.map((slot, i) => ({
        slot,
        skillId: parsedSkillIds[i] ?? null,
      }));
      paired.sort((a, b) => new Date(a.slot).getTime() - new Date(b.slot).getTime());
      const sortedSlots    = paired.map(p => p.slot);
      const sortedSkillIds = paired.map(p => p.skillId);

      console.log('📋 Details:', { candidateId, mentorId, sessionType, slotCount: sortedSlots.length, skillCount: sortedSkillIds.length });

      console.log('[Payment] 🔒 STEP 1: Pre-flight slot check...');
      await this.checkBookingConflict(mentorId, sortedSlots);

      const { data: mentorData, error: mentorError } = await supabase
        .from('mentors')
        .select('session_price_inr, tier, intro_call_price')
        .eq('id', mentorId)
        .single();

      if (mentorError || !mentorData) throw new Error('Unable to retrieve mentor pricing details.');

      const tierName = mentorData.tier || 'bronze';
      const { data: tierData, error: tierError } = await supabase
        .from('mentor_tiers')
        .select('percentage_cut')
        .eq('tier', tierName)
        .single();

      if (tierError || !tierData) throw new Error(`Unable to retrieve pricing logic for tier: ${tierName}`);

      const basePrice     = mentorData.session_price_inr || 0;
      const percentageCut = tierData.percentage_cut || 50;
      const cutDecimal    = percentageCut / 100;

      const mockPrice  = Math.round(basePrice / (1 - cutDecimal));
      const introPrice = mentorData.intro_call_price ?? 0;
      const isFreeIntro = sessionType === 'intro' && introPrice === 0;

      let totalPrice: number;
      let mentorPayout: number;
      let platformFee: number;

      // 🟢 Updated Price Logic using DB intro_call_price
      if (isFreeIntro) {
        totalPrice   = 0;
        mentorPayout = 0;
        platformFee  = 0;
      } else if (sessionType === 'intro') {
        totalPrice   = introPrice;
        mentorPayout = introPrice;
        platformFee  = 0;
      } else if (sessionType === 'bundle') {
        const bundleMentorPayout = Math.round(basePrice * 2.5);
        totalPrice   = Math.round(bundleMentorPayout / (1 - cutDecimal));
        mentorPayout = bundleMentorPayout;
        platformFee  = totalPrice - mentorPayout;
      } else {
        totalPrice   = mockPrice;
        mentorPayout = basePrice;
        platformFee  = totalPrice - mentorPayout;
      }

      const amountToSend = totalPrice * 100; 

      let jdId: string | null = null;
      if (jdText && jdText.trim().length > 0) {
        console.log('[Payment] 📄 STEP 5: Saving job description...');
        const { data: jdRecord, error: jdError } = await supabase
          .from('job_descriptions')
          .insert({ candidate_id: candidateId, jd_text: jdText.trim() })
          .select('id')
          .single();

        if (!jdError && jdRecord) {
          jdId = jdRecord.id;
        }
      }

      let razorpayOrderId = null;
      let razorpayKeyId   = null;

      // 🟢 Bypass Razorpay if it's a free intro
      if (ENABLE_RAZORPAY && !isFreeIntro) {
        console.log('[Payment] 💳 STEP 6: Creating Razorpay order...');
        
        // PREVENT RAZORPAY IDEMPOTENCY CONFLICTS
        const uniqueReceipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        const { data: orderData, error: orderError } = await supabase.functions.invoke(
          'create-razorpay-order',
          {
            body: {
              amount:   amountToSend,
              currency: 'INR',
              receipt:  uniqueReceipt, 
              notes: { candidate_id: candidateId, mentor_id: mentorId, session_type: sessionType }
            }
          }
        );

        if (orderError || !orderData?.id) throw new Error('Payment order creation failed. Please try again.');

        razorpayOrderId = orderData.id;
        razorpayKeyId   = orderData.key_id;
      }

      console.log('[Payment] 📦 STEP 7: Creating package record...');
      const { data: pkg, error: pkgError } = await supabase
        .from('interview_packages')
        .insert({
          candidate_id:         candidateId,
          mentor_id:            mentorId,
          interview_profile_id: interviewProfileId,
          total_amount_inr:     totalPrice,
          mentor_payout_inr:    mentorPayout,
          platform_fee_inr:     platformFee,
          // 🟢 Immediately mark as completed if free
          payment_status:       isFreeIntro ? 'completed' : (ENABLE_RAZORPAY ? 'pending' : 'held_in_escrow'),
          razorpay_order_id:    razorpayOrderId,
          booking_metadata: {
            session_type: sessionType,
            scheduled_at: sortedSlots[0],
            skill_ids:    sortedSkillIds,
            jd_id:        jdId,
          }
        })
        .select('*')
        .single();

      if (pkgError || !pkg) throw new Error('Unable to create booking record. Please try again.');

      console.log('[Payment] 🔒 STEP 8: Creating session(s) to block slot(s)...');

      const sessionInserts = sortedSlots.map((slot, i) => ({
        package_id:   pkg.id,
        candidate_id: candidateId,
        mentor_id:    mentorId,
        skill_id:     sortedSkillIds[i] ?? null,
        scheduled_at: slot,
        // 🟢 Immediately mark as confirmed if free
        status:       isFreeIntro ? 'confirmed' : 'awaiting_payment',
        session_type: sessionType,
        jd_id:        jdId,
      }));
      
      const { data: newSessions, error: sessionError } = await supabase
        .from('interview_sessions')
        .insert(sessionInserts)
        .select('id');

      if (sessionError || !newSessions || newSessions.length === 0) {
        await supabase.from('interview_packages').delete().eq('id', pkg.id);
        throw new Error('Unable to reserve slot(s). They may have just been booked.');
      }

      console.log('[Payment] ✅ Sessions created:', newSessions.map(s => s.id));

      const isBundle = sessionType === 'bundle';
      const metadataUpdate = isBundle
        ? { session_ids: newSessions.map(s => s.id) }
        : { session_id: newSessions[0].id };

      await supabase
        .from('interview_packages')
        .update({ booking_metadata: { ...pkg.booking_metadata, ...metadataUpdate } })
        .eq('id', pkg.id);

      // 🟢 NEW: Trigger meeting and emails automatically for free intro
      if (isFreeIntro) {
        console.log('[Payment] 🆓 Free Intro: Creating 100ms meeting & sending emails...');
        for (const session of newSessions) {
          await supabase.functions.invoke('create-meeting', { body: { sessionId: session.id } });
        }
        await this.triggerBookingNotificationEmails(pkg.id);
      }

      console.log('[Payment] ✅ Booking flow complete!');

      return {
        package: pkg,
        orderId: razorpayOrderId,
        amount:  amountToSend,
        keyId:   razorpayKeyId,
        error:   null,
      };

    } catch (err: any) {
      console.error('[Payment] 💥 Fatal error in createPackage:', err);
      return { package: null, orderId: null, amount: 0, keyId: null, error: err };
    }
  },

  async verifyPayment(pkgId: string, razorpayPaymentId: string, razorpaySignature: string, orderId: string) {
    try {
      console.log('[Payment Service] 🔍 Verifying payment for package:', pkgId);

      const { data: pkgData, error: pkgFetchError } = await supabase
        .from('interview_packages')
        .select('razorpay_order_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (pkgFetchError || !pkgData) throw new Error('Package not found');

      const resolvedOrderId = pkgData.razorpay_order_id || orderId;
      if (!resolvedOrderId) throw new Error('Order ID not found in package');

      // Verify signature
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-razorpay-signature',
        {
          body: {
            packageId: pkgId,
            orderId:   resolvedOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
          }
        }
      );

      if (verifyError) throw new Error(`Edge function error: ${verifyError.message}`);
      if (!verifyData?.valid) throw new Error(verifyData?.error || 'Payment verification failed. Please contact support.');

      console.log('[Payment Service] ✅ Payment verified by Razorpay!');

      // Verify DB updates
      const { data: updatedPackage, error: verifyPackageError } = await supabase
        .from('interview_packages')
        .select('payment_status, razorpay_payment_id, razorpay_signature, razorpay_order_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (verifyPackageError || !updatedPackage) throw new Error('Failed to verify package update');
      if (!updatedPackage.razorpay_payment_id || !updatedPackage.razorpay_signature) {
        throw new Error('Payment verification succeeded but details were not saved. Please contact support.');
      }

      // Create 100ms meeting(s)
      const metadata       = updatedPackage.booking_metadata || {};
      const sessionType: SessionType = metadata.session_type || 'mock';
      const isBundle       = sessionType === 'bundle';

      const sessionIdsToProcess: string[] = isBundle
        ? (metadata.session_ids || [])
        : metadata.session_id ? [metadata.session_id] : [];

      for (const sessionId of sessionIdsToProcess) {
        console.log('[Payment Service] 🎥 Creating 100ms meeting for session:', sessionId);
        const { data: meetingData, error: meetingError } = await supabase.functions.invoke('create-meeting', {
          body: { sessionId }
        });
        if (meetingError || !meetingData?.success) {
          console.error('[Payment Service] ⚠️ Meeting creation failed for session:', sessionId, meetingError || meetingData);
        } else {
          console.log('[Payment Service] ✅ Meeting created:', sessionId, meetingData.roomId);
        }
      }

      // Send emails
      console.log('[Payment Service] 📧 Triggering booking notification emails...');
      await this.triggerBookingNotificationEmails(pkgId);

      return { success: true };

    } catch (err: any) {
      console.error('[Payment Service] 💥 Fatal error in verifyPayment:', err);
      throw new Error(err.message || 'Payment verification failed');
    }
  },

  async triggerBookingNotificationEmails(pkgId: string) {
    try {
      console.log('[Email] 📧 Sending booking notification emails for package:', pkgId);

      const { data: pkg } = await supabase
        .from('interview_packages')
        .select('candidate_id, mentor_id, interview_profile_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (!pkg) { console.error('[Email] ❌ Package not found:', pkgId); return; }

      const sessionType: SessionType = pkg.booking_metadata?.session_type || 'mock';

      const [mentorRes, candidateRes, profileRes, sessionsRes] = await Promise.all([
        supabase.from('mentors').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.mentor_id).single(),
        supabase.from('candidates').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.candidate_id).single(),
        supabase.from('interview_profiles_admin').select('name').eq('id', pkg.interview_profile_id).single(),
        supabase.from('interview_sessions')
          .select('id, scheduled_at, skill:interview_skills_admin!skill_id(name)')
          .eq('package_id', pkgId)
          .order('scheduled_at', { ascending: true }),
      ]);

      const mentor    = mentorRes.data;
      const candidate = candidateRes.data;
      const profile   = profileRes.data;
      const sessions  = sessionsRes.data || [];

      // Build skill name string (deduplicated for display)
      const skillName = sessionType === 'intro'
        ? 'Intro Call'
        : sessions.length > 0
          ? [...new Set(sessions.map(s => s.skill?.name).filter(Boolean))].join(', ')
          : 'N/A';

      // Build datetime string — one line per session
      const dateTime = sessions.length > 0
        ? sessions.map((s, i) => {
            const f = new Date(s.scheduled_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            return sessions.length > 1 ? `Session ${i + 1}: ${f}` : f;
          }).join('<br>')
        : 'TBD';

      const sessionTypeLabel = sessionType === 'intro' ? 'Intro Call'
        : sessionType === 'bundle' ? 'Bundle of 3 Mock Interviews'
        : 'Mock Interview';

      // 🟢 Generate HTML Calendar Invites mapped to Dashboards
      const candidateHtml = generateCalendarHtml(sessions, sessionType, `Interview with ${mentor?.professional_title || 'Mentor'}`, `${BASE_URL}/candidate/bookings`);
      const mentorHtml = generateCalendarHtml(sessions, sessionType, `Interview with ${candidate?.profile?.full_name || 'Candidate'}`, `${BASE_URL}/mentor/bookings`);

      if (candidate?.profile?.email) {
        await sendEmail(
          candidate.profile.email,
          `✅ ${sessionTypeLabel} Confirmed`,
          EMAIL_TEMPLATES.CANDIDATE_BOOKING_CONFIRMATION,
          { name: candidate.profile.full_name, mentorTitle: mentor?.professional_title, profileName: profile?.name, skillName, dateTime, baseUrl: BASE_URL },
          candidateHtml
        );
      }

      if (mentor?.profile?.email) {
        await sendEmail(
          mentor.profile.email,
          `🎯 ${sessionTypeLabel} Confirmed`,
          EMAIL_TEMPLATES.MENTOR_BOOKING_CONFIRMATION,
          { name: mentor.profile.full_name, candidateTitle: candidate?.professional_title, profileName: profile?.name, skillName, dateTime, baseUrl: BASE_URL },
          mentorHtml
        );
      }

      await sendEmail(
        'crackjobshelpdesk@gmail.com',
        `🔔 New Booking — ${sessionTypeLabel}`,
        EMAIL_TEMPLATES.HELPDESK_BOOKING_NOTIFICATION,
        {
          packageId:      pkgId,
          candidateName:  candidate?.profile?.full_name || 'N/A',
          candidateTitle: candidate?.professional_title || 'N/A',
          candidateEmail: candidate?.profile?.email || 'N/A',
          mentorName:     mentor?.profile?.full_name || 'N/A',
          mentorTitle:    mentor?.professional_title || 'N/A',
          mentorEmail:    mentor?.profile?.email || 'N/A',
          profileName:    profile?.name || 'N/A',
          skillName,
          dateTime,
          baseUrl:        BASE_URL,
        }
      );

      console.log('[Email] ✅ Booking notification emails sent!');

    } catch (err) {
      console.error('[Email] ❌ Booking notification emails failed:', err);
    }
  },

  async triggerBookingConfirmationEmails(pkgId: string) {
    try {
      console.log('[Email] 📧 Sending booking CONFIRMATION emails for package:', pkgId);

      const { data: pkg } = await supabase
        .from('interview_packages')
        .select('candidate_id, mentor_id, interview_profile_id, booking_metadata')
        .eq('id', pkgId)
        .single();

      if (!pkg) { console.error('[Email] ❌ Package not found:', pkgId); return; }

      const sessionType: SessionType = pkg.booking_metadata?.session_type || 'mock';

      const [mentorRes, candidateRes, profileRes, sessionsRes] = await Promise.all([
        supabase.from('mentors').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.mentor_id).single(),
        supabase.from('candidates').select('professional_title, profile:profiles!id(email, full_name)').eq('id', pkg.candidate_id).single(),
        supabase.from('interview_profiles_admin').select('name').eq('id', pkg.interview_profile_id).single(),
        supabase.from('interview_sessions')
          .select('id, scheduled_at, skill:interview_skills_admin!skill_id(name)')
          .eq('package_id', pkgId)
          .order('scheduled_at', { ascending: true }),
      ]);

      const mentor    = mentorRes.data;
      const candidate = candidateRes.data;
      const profile   = profileRes.data;
      const sessions  = sessionsRes.data || [];

      const skillName = sessionType === 'intro'
        ? 'Intro Call'
        : sessions.length > 0
          ? [...new Set(sessions.map(s => s.skill?.name).filter(Boolean))].join(', ')
          : 'N/A';

      const dateTime = sessions.length > 0
        ? sessions.map((s, i) => {
            const f = new Date(s.scheduled_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            return sessions.length > 1 ? `Session ${i + 1}: ${f}` : f;
          }).join('<br>')
        : 'TBD';

      const sessionTypeLabel = sessionType === 'intro' ? 'Intro Call'
        : sessionType === 'bundle' ? 'Bundle of 3 Mock Interviews'
        : 'Mock Interview';

      // 🟢 Generate HTML Calendar Invites mapped to Dashboards
      const candidateHtml = generateCalendarHtml(sessions, sessionType, `Interview with ${mentor?.professional_title || 'Mentor'}`, `${BASE_URL}/candidate/bookings`);
      const mentorHtml = generateCalendarHtml(sessions, sessionType, `Interview with ${candidate?.profile?.full_name || 'Candidate'}`, `${BASE_URL}/mentor/bookings`);

      if (candidate?.profile?.email) {
        await sendEmail(
          candidate.profile.email,
          `✅ ${sessionTypeLabel} Confirmed — ${profile?.name}`,
          EMAIL_TEMPLATES.CANDIDATE_BOOKING_CONFIRMATION,
          { name: candidate.profile.full_name, mentorTitle: mentor?.professional_title, profileName: profile?.name, skillName, dateTime, baseUrl: BASE_URL },
          candidateHtml
        );
      }

      if (mentor?.profile?.email) {
        await sendEmail(
          mentor.profile.email,
          `🎯 ${sessionTypeLabel} Confirmed — ${profile?.name}`,
          EMAIL_TEMPLATES.MENTOR_BOOKING_CONFIRMATION,
          { name: mentor.profile.full_name, candidateTitle: candidate?.professional_title, profileName: profile?.name, skillName, dateTime, baseUrl: BASE_URL },
          mentorHtml
        );
      }

      console.log('[Email] ✅ Booking confirmation emails sent!');

    } catch (err) {
      console.error('[Email] ❌ Booking confirmation emails failed:', err);
    }
  },

  async sendMentorWelcomeEmail(mentorId: string) {
    try {
      const { data: mentorData } = await supabase
        .from('mentors')
        .select('profile:profiles!id (email, full_name)')
        .eq('id', mentorId)
        .single();

      if (!mentorData?.profile?.email) { console.error('[Email] Mentor email not found'); return; }

      const success = await sendEmail(
        mentorData.profile.email,
        '🎉 Welcome to CrackJobs - Your Mentor Account is Active',
        EMAIL_TEMPLATES.MENTOR_WELCOME,
        { name: mentorData.profile.full_name, baseUrl: BASE_URL }
      );

      if (success) console.log('[Email] ✅ Welcome email sent to mentor:', mentorId);
    } catch (err) {
      console.warn('Mentor welcome email failed:', err);
    }
  }
};