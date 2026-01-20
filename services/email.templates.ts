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
      margin: 20px 0; 
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to CrackJobs!</h1>
      <p>Your mentor account is now active</p>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="welcome-badge">Account Activated</span>
      </div>

      <p>Hello,</p>
      
      <p>Congratulations! Your mentor profile has been approved and activated. You're now ready to help candidates ace their interviews and earn money doing what you do best.</p>

      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">💰</div>
          <div class="feature-text">
            <div class="feature-title">Earn on Your Terms</div>
            <div class="feature-desc">Set your own availability and pricing. Get paid for each completed session.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📅</div>
          <div class="feature-text">
            <div class="feature-title">Flexible Scheduling</div>
            <div class="feature-desc">Accept bookings that fit your schedule. No commitment required.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div class="feature-text">
            <div class="feature-title">Make an Impact</div>
            <div class="feature-desc">Help aspiring professionals land their dream jobs with your expertise.</div>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <div class="feature-text">
            <div class="feature-title">Complete Anonymity</div>
            <div class="feature-desc">All sessions are anonymous - only professional titles are shared.</div>
          </div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="{{baseUrl}}/mentor/profile" class="button">Go to Dashboard</a>
      </div>

      <div class="next-steps">
        <strong>🚀 Next Steps:</strong>
        <ol>
          <li>Complete your profile and set your availability</li>
          <li>Review your session pricing and bank details</li>
          <li>Wait for booking requests from candidates</li>
          <li>Conduct sessions and provide feedback</li>
        </ol>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Questions? We're here to help! Reach out to us at <a href="{{baseUrl}}/contact" style="color: #0E9384;">{{baseUrl}}/contact</a>
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong> - Mock Interview Platform</p>
      <p>Empowering candidates, one interview at a time</p>
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
  <title>Booking Scheduled</title>
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
      <h1>✅ Your Interview is Scheduled!</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      
      <div style="text-align: center;">
        <span class="success-badge">Payment Successful</span>
      </div>

      <p>Great news! Your mock interview has been scheduled. The mentor will now accept the invite or might request for a reschedule</p>
      
      <div class="details">
        <div class="detail-row">
          <div class="label">Your Mentor</div>
          <div class="value">{{mentorTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} - {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
      </div>

      <p><strong>Before Your Interview:</strong></p>
      <ol>
        <li>Review the job description and role requirements</li>
        <li>Prepare specific questions or scenarios you want to practice</li>
        <li>Test your video and audio setup 10 minutes early</li>
        <li>Have a notepad ready for feedback and notes</li>
      </ol>

      <div style="text-align: center;">
        <a href="{{baseUrl}}/candidate/bookings" class="button">View Booking Details</a>
      </div>

      <div class="pro-tip">
        <strong>⏰ Pro Tip:</strong> You'll receive the meeting link closer to your scheduled time. Add this to your calendar so you don't miss it!
      </div>

      <div class="note">
        <strong>What happens next?</strong><br>
        • 15 minutes before: Meeting link becomes available<br>
        • During: Conduct your interview with the mentor<br>
        • After: Receive detailed feedback to improve your skills
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        You can access all your bookings anytime in your dashboard.
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong> - Mock Interview Platform</p>
      <p>Need help? Reply to this email or visit our support page</p>
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
  <title>New Booking Scheduled - APPROVAL NEEDED</title>
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
    .value a {
      color: #0E9384;
      word-break: break-all;
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
      <h1>🎯 New Interview Booking Confirmed</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      
      <div style="text-align: center;">
        <span class="success-badge">Payment Confirmed</span>
      </div>

      <p>You have a new confirmed interview session! A candidate has successfully booked and paid for a session with you.Please approve the meeting in your "My Bookings" page</p>
      
      <div class="details">
        <div class="detail-row">
          <div class="label">Candidate Profile</div>
          <div class="value">{{candidateTitle}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} - {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Meeting Link</div>
          <div class="value"><a href="{{meetingLink}}">{{meetingLink}}</a></div>
        </div>
      </div>

      <p><strong>Preparation Checklist:</strong></p>
      <ol>
        <li>Review the interview profile and skill requirements</li>
        <li>Prepare relevant questions and scenarios</li>
        <li>Test your video/audio setup 10 minutes before</li>
        <li>Join the meeting link at the scheduled time</li>
      </ol>

      <a href="{{meetingLink}}" class="button">Join Meeting (Available 15 min before)</a>

      <div class="earning-highlight">
        <strong>💰 Earning Info:</strong> Your payout will be processed after you submit the evaluation feedback for this session. Payment typically arrives within 3-5 business days.
      </div>

      <div class="note">
        <strong>After the interview:</strong><br>
        • Provide detailed feedback through the evaluation form<br>
        • Rate the candidate's performance across key criteria<br>
        • Share actionable insights to help them improve<br>
        • Your payout will be initiated once evaluation is submitted
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
        Access all your bookings and submit evaluations from your dashboard at <a href="{{baseUrl}}/mentor/bookings" style="color: #0E9384;">{{baseUrl}}/mentor/bookings</a>
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs</strong> - Mock Interview Platform</p>
      <p>Questions? Reply to this email or visit our mentor support page</p>
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
    .value a {
      color: #0E9384;
      word-break: break-all;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Booking Alert</h1>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="alert-badge">Action Required</span>
      </div>

      <p><strong>A new interview session has been successfully booked and paid for on CrackJobs.</strong></p>
      
      <p>Package ID: <span class="pkg-id">{{packageId}}</span></p>

      <div class="section-title">📅 Session Details</div>
      <div class="details">
        <div class="detail-row">
          <div class="label">Interview Type</div>
          <div class="value">{{profileName}} - {{skillName}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Scheduled For</div>
          <div class="value">{{dateTime}}</div>
        </div>
        <div class="detail-row">
          <div class="label">Meeting Link</div>
          <div class="value"><a href="{{meetingLink}}">{{meetingLink}}</a></div>
        </div>
      </div>

      <div class="section-title">👤 Candidate Information</div>
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

      <div class="section-title">🎯 Mentor Information</div>
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

      <p style="color: #6b7280; font-size: 14px; margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 6px;">
        <strong>Note:</strong> Both mentor and candidate have received their respective confirmation emails with session details.
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs Helpdesk</strong></p>
      <p>This is an automated notification</p>
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👋 New User Signup</h1>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="signup-badge">New Registration</span>
      </div>

      <p><strong>A new user has signed up on CrackJobs!</strong></p>

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

      <p style="color: #6b7280; font-size: 14px; margin-top: 25px; padding: 15px; background: #f9fafb; border-radius: 6px;">
        <strong>Next Steps:</strong><br>
        {{#if isMentor}}
        • Mentor account is pending approval<br>
        • Review profile and verify credentials<br>
        • Approve or reject from admin dashboard
        {{else}}
        • Candidate can now browse mentors<br>
        • No action required from admin
        {{/if}}
      </p>
    </div>
    <div class="footer">
      <p><strong>CrackJobs Helpdesk</strong></p>
      <p>This is an automated notification</p>
    </div>
  </div>
</body>
</html>
  `
};