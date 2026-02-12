// services/email.templates.ts

export const EMAIL_TEMPLATES = {
  MENTOR_WELCOME: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CrackJobs</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
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
      padding: 40px 30px; 
      border-radius: 8px 8px 0 0; 
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content { 
      background: #fff; 
      padding: 30px; 
      border: 1px solid #e5e7eb; 
      border-top: none; 
      border-radius: 0 0 8px 8px;
    }
    .welcome-badge { 
      background: #D1FAE5; 
      color: #065F46; 
      padding: 8px 16px; 
      border-radius: 20px; 
      display: inline-block; 
      font-weight: 600; 
      margin: 10px 0 20px 0; 
      font-size: 14px;
    }
    .button { 
      display: inline-block; 
      background: #0E9384; 
      color: white !important; 
      padding: 14px 28px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600; 
      margin: 20px 0 10px 0; 
      font-size: 16px;
    }
    .features { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .feature-item {
      display: flex;
      align-items: start;
      margin: 15px 0;
    }
    .feature-icon {
      font-size: 24px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .feature-text {
      flex: 1;
    }
    .feature-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }
    .feature-desc {
      color: #6b7280;
      font-size: 14px;
    }
    .next-steps {
      background: #DBEAFE; 
      border-left: 4px solid #3B82F6; 
      padding: 15px; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .next-steps strong {
      color: #1E40AF;
    }
    .footer { 
      text-align: center; 
      color: #6b7280; 
      font-size: 12px; 
      margin-top: 30px; 
      padding: 20px;
    }
    .footer p {
      margin: 5px 0;
    }
    ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    ol li {
      margin: 8px 0;
    }
    .muted {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to CrackJobs</h1>
      <p>Your mentor account is now active</p>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="welcome-badge">Account Activated</span>
      </div>

      <p>Hello,</p>
      
      <p>Your mentor profile has been approved and activated. You can now accept bookings, conduct sessions, and earn for each completed interview.</p>

      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">💼</div>
          <div class="feature-text">
            <div class="feature-title">Work on Your Terms</div>
            <div class="feature-desc">Set your availability and session pricing. Accept only what fits your schedule.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📅</div>
          <div class="feature-text">
            <div class="feature-title">Manage Bookings Easily</div>
            <div class="feature-desc">Review upcoming sessions, approve requests, and submit evaluations from your dashboard.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div class="feature-text">
            <div class="feature-title">Create Real Impact</div>
            <div class="feature-desc">Help candidates improve and build confidence with structured mock interviews.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <div class="feature-text">
            <div class="feature-title">Anonymous by Design</div>
            <div class="feature-desc">Only professional titles are shared. Personal identity stays private.</div>
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="{{baseUrl}}/mentor/bookings" class="button">Go to My Bookings</a>
      </div>

      <div class="next-steps">
        <strong>Next steps</strong>
        <ol>
          <li>Review and complete your profile</li>
          <li>Set your availability and confirm session pricing</li>
          <li>Monitor booking requests in “My Bookings”</li>
          <li>Conduct sessions and submit evaluations to trigger payouts</li>
        </ol>
      </div>

      <p class="muted" style="margin-top: 24px;">
        Need help? Contact support at
        <a href="{{baseUrl}}/contact" style="color: #0E9384;">{{baseUrl}}/contact</a>
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong></p>
      <p>Mock interviews, done right.</p>
    </div>
  </div>
</body>
</html>
  `,

  CANDIDATE_BOOKING_CONFIRMATION: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
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
    .success-badge { 
      background: #D1FAE5; 
      color: #065F46; 
      padding: 8px 16px; 
      border-radius: 20px; 
      display: inline-block; 
      font-weight: 600; 
      margin: 10px 0; 
      font-size: 14px;
    }
    .details { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .detail-row { 
      margin: 10px 0; 
    }
    .label { 
      color: #6b7280; 
      font-size: 14px; 
      margin-bottom: 4px;
    }
    .value { 
      color: #1f2937; 
      font-weight: 600; 
      font-size: 16px; 
    }
    .button { 
      display: inline-block; 
      background: #0E9384; 
      color: white !important; 
      padding: 12px 24px; 
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
    .footer p {
      margin: 5px 0;
    }
    .pro-tip {
      background: #FEF3C7; 
      border-left: 4px solid #F59E0B; 
      padding: 12px; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .pro-tip strong {
      color: #92400E;
    }
    .note {
      color: #6b7280; 
      font-size: 14px;
      margin-top: 20px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 4px;
    }
    ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    ol li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Interview Is Scheduled</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      
      <div style="text-align: center;">
        <span class="success-badge">Payment Confirmed</span>
      </div>

      <p>Your booking is confirmed. Your mentor will review and accept the session. If the mentor needs a change, you may receive a reschedule request.</p>
      
      <div class="details">
        <div class="detail-row">
          <div class="label">Mentor</div>
          <div class="value">{{mentorTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} — {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
      </div>

      <p><strong>How to join the session</strong><br/>
      Please join the meeting by logging in to your CrackJobs account and opening <strong>My Bookings</strong>. The join option will be available on your booking at the appropriate time.</p>

      <div style="text-align: center;">
        <a href="{{baseUrl}}/candidate/bookings" class="button">Go to My Bookings</a>
      </div>

      <div class="pro-tip">
        <strong>Tip:</strong> We recommend logging in 10 minutes early to test your audio/video setup.
      </div>

      <div class="note">
        <strong>What happens next?</strong><br>
        • Your mentor reviews and confirms the booking<br>
        • Join from “My Bookings” at the scheduled time<br>
        • Receive structured feedback after the session
      </div>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong></p>
      <p>Need help? Reply to this email or visit <a href="{{baseUrl}}/contact" style="color:#0E9384;">{{baseUrl}}/contact</a></p>
    </div>
  </div>
</body>
</html>
  `,

  MENTOR_BOOKING_CONFIRMATION: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking - Action Required</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
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
    .success-badge { 
      background: #D1FAE5; 
      color: #065F46; 
      padding: 8px 16px; 
      border-radius: 20px; 
      display: inline-block; 
      font-weight: 600; 
      margin: 10px 0; 
      font-size: 14px;
    }
    .button { 
      display: inline-block; 
      background: #0E9384; 
      color: white !important; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600; 
      margin: 20px 0; 
    }
    .details { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .detail-row { 
      margin: 10px 0; 
    }
    .label { 
      color: #6b7280; 
      font-size: 14px; 
      margin-bottom: 4px;
    }
    .value { 
      color: #1f2937; 
      font-weight: 600; 
      font-size: 16px; 
    }
    .footer { 
      text-align: center; 
      color: #6b7280; 
      font-size: 12px; 
      margin-top: 30px; 
      padding: 20px;
    }
    .footer p {
      margin: 5px 0;
    }
    .earning-highlight {
      background: #DBEAFE; 
      border-left: 4px solid #3B82F6; 
      padding: 15px; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .earning-highlight strong {
      color: #1E40AF;
    }
    .note {
      color: #6b7280; 
      font-size: 14px;
      margin-top: 20px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 4px;
    }
    ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    ol li {
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Booking Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      
      <div style="text-align: center;">
        <span class="success-badge">Payment Confirmed</span>
      </div>

      <p>A candidate has booked and paid for a session with you. Please review and approve the booking from your dashboard.</p>
      
      <div class="details">
        <div class="detail-row">
          <div class="label">Candidate Profile</div>
          <div class="value">{{candidateTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} — {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
      </div>

      <p><strong>How to join the session</strong><br/>
      Please join the meeting by logging in to your CrackJobs account and opening <strong>My Bookings</strong>. The join option will be available on the booking at the appropriate time.</p>

      <div style="text-align: center;">
        <a href="{{baseUrl}}/mentor/bookings" class="button">Go to My Bookings</a>
      </div>

      <p><strong>Preparation checklist</strong></p>
      <ol>
        <li>Review the interview type and skill area</li>
        <li>Prepare relevant questions and evaluation criteria</li>
        <li>Log in 10 minutes early to test audio/video</li>
        <li>Join from “My Bookings” at the scheduled time</li>
      </ol>

      <div class="earning-highlight">
        <strong>Payout</strong><br/>
        Your payout is initiated after you submit the session evaluation. Processing typically completes within 3–5 business days.
      </div>

      <div class="note">
        <strong>After the session</strong><br>
        • Submit structured feedback via the evaluation form<br>
        • Share actionable improvement points<br>
        • Payout begins once evaluation is submitted
      </div>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong></p>
      <p>Questions? Reply to this email or visit <a href="{{baseUrl}}/contact" style="color:#0E9384;">{{baseUrl}}/contact</a></p>
    </div>
  </div>
</body>
</html>
  `,

  HELPDESK_BOOKING_NOTIFICATION: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Alert</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
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
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); 
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
    .alert-badge { 
      background: #FEE2E2; 
      color: #991B1B; 
      padding: 8px 16px; 
      border-radius: 20px; 
      display: inline-block; 
      font-weight: 600; 
      margin: 10px 0; 
      font-size: 14px;
    }
    .details { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .detail-row { 
      margin: 12px 0; 
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .label { 
      color: #6b7280; 
      font-size: 12px; 
      margin-bottom: 4px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .value { 
      color: #1f2937; 
      font-weight: 600; 
      font-size: 15px; 
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 25px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #0E9384;
    }
    .footer { 
      text-align: center; 
      color: #6b7280; 
      font-size: 12px; 
      margin-top: 30px; 
      padding: 20px;
    }
    .footer p {
      margin: 5px 0;
    }
    .pkg-id {
      background: #FEF3C7;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
      color: #92400E;
    }
    .muted {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Booking Alert</h1>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="alert-badge">New Paid Booking</span>
      </div>

      <p><strong>A new interview session has been booked and paid for on CrackJobs.</strong></p>
      
      <p>Package ID: <span class="pkg-id">{{packageId}}</span></p>

      <div class="section-title">Session Details</div>
      <div class="details">
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} — {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
      </div>

      <div class="section-title">Candidate</div>
      <div class="details">
        <div class="detail-row">
          <div class="label">Name</div>
          <div class="value">{{candidateName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Professional Title</div>
          <div class="value">{{candidateTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:{{candidateEmail}}">{{candidateEmail}}</a></div>
        </div>
      </div>

      <div class="section-title">Mentor</div>
      <div class="details">
        <div class="detail-row">
          <div class="label">Name</div>
          <div class="value">{{mentorName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Professional Title</div>
          <div class="value">{{mentorTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:{{mentorEmail}}">{{mentorEmail}}</a></div>
        </div>
      </div>

      <p class="muted" style="margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 6px;">
        <strong>Note:</strong> Mentor and candidate confirmation emails have been sent with the session details. Users join sessions from their dashboards under “My Bookings”.
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs Helpdesk</strong></p>
      <p>This is an automated notification.</p>
    </div>
  </div>
</body>
</html>
  `,

  HELPDESK_SIGNUP_NOTIFICATION: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New User Signup</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
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
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); 
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
    .signup-badge { 
      background: #EDE9FE; 
      color: #5B21B6; 
      padding: 8px 16px; 
      border-radius: 20px; 
      display: inline-block; 
      font-weight: 600; 
      margin: 10px 0; 
      font-size: 14px;
    }
    .details { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0; 
      border: 1px solid #e5e7eb;
    }
    .detail-row { 
      margin: 12px 0; 
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .label { 
      color: #6b7280; 
      font-size: 12px; 
      margin-bottom: 4px;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .value { 
      color: #1f2937; 
      font-weight: 600; 
      font-size: 15px; 
    }
    .value a {
      color: #7C3AED;
      word-break: break-all;
    }
    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .role-mentor {
      background: #DBEAFE;
      color: #1E40AF;
    }
    .role-candidate {
      background: #D1FAE5;
      color: #065F46;
    }
    .footer { 
      text-align: center; 
      color: #6b7280; 
      font-size: 12px; 
      margin-top: 30px; 
      padding: 20px;
    }
    .footer p {
      margin: 5px 0;
    }
    .timestamp {
      background: #FEF3C7;
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
      color: #92400E;
    }
    .muted {
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New User Signup</h1>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="signup-badge">New Registration</span>
      </div>

      <p><strong>A new user has signed up on CrackJobs.</strong></p>

      <div class="details">
        <div class="detail-row">
          <div class="label">User Type</div>
          <div class="value">
            <span class="role-badge role-{{userRole}}">{{userRole}}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="label">Full Name</div>
          <div class="value">{{fullName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:{{email}}">{{email}}</a></div>
        </div>
        <div class="detail-row">
          <div class="label">Professional Title</div>
          <div class="value">{{professionalTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">User ID</div>
          <div class="value"><span class="timestamp">{{userId}}</span></div>
        </div>
        <div class="detail-row">
          <div class="label">Signup Time</div>
          <div class="value">{{signupTime}}</div>
        </div>
      </div>

      <p class="muted" style="margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 6px;">
        <strong>Next steps</strong><br>
        {{#if isMentor}}
        • Mentor account is pending approval<br>
        • Review profile and verify credentials<br>
        • Approve or reject from the admin dashboard
        {{else}}
        • Candidate can now browse mentors<br>
        • No action required
        {{/if}}
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs Helpdesk</strong></p>
      <p>This is an automated notification.</p>
    </div>
  </div>
</body>
</html>
  `
};
