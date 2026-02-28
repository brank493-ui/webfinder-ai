// Email Service for WebFinder AI
// This service handles sending emails for registration, credential numbers, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email templates
const templates = {
  welcomeWithCredential: (name: string, credentialNumber: string) => ({
    subject: 'Welcome to WebFinder AI - Your Credential Number',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WebFinder AI</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .credential-box { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .credential-number { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">🌐 WebFinder AI</h1>
          <p style="margin: 10px 0 0 0;">Business Discovery Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Welcome to <strong>WebFinder AI</strong>! Your account has been created successfully.</p>
          
          <div class="credential-box">
            <p style="margin: 0 0 10px 0; font-size: 14px;">Your Credential Number</p>
            <div class="credential-number">${credentialNumber}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> Please save this credential number in a safe place. You will need it to access your account.
          </div>
          
          <h3>What can you do with your credential number?</h3>
          <ul>
            <li>Log in to your account from any device</li>
            <li>Access your project dashboard</li>
            <li>Track your website development progress</li>
            <li>Communicate with our team</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://webfinder.ai" class="button">Visit WebFinder AI</a>
          </p>
          
          <h3>Need Help?</h3>
          <p>If you have any questions, feel free to contact us:</p>
          <ul>
            <li>Email: <a href="mailto:brank493@gmail.com">brank493@gmail.com</a></li>
            <li>Phone: <a href="tel:+237693401619">+237 693 401 619</a></li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder AI. All rights reserved.</p>
          <p>Owned by Fongang Lamago Brank</p>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to WebFinder AI!

Hello ${name},

Your account has been created successfully.

Your Credential Number: ${credentialNumber}

Please save this credential number in a safe place. You will need it to access your account from any device.

What you can do with your credential number:
- Log in to your account from any device
- Access your project dashboard
- Track your website development progress
- Communicate with our team

Visit: https://webfinder.ai

Need help?
Email: brank493@gmail.com
Phone: +237 693 401 619

© ${new Date().getFullYear()} WebFinder AI. All rights reserved.
    `,
  }),

  credentialReminder: (name: string, credentialNumber: string) => ({
    subject: 'Your WebFinder AI Credential Number',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Credential Number</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .credential-box { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .credential-number { font-size: 28px; font-weight: bold; letter-spacing: 2px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">🌐 WebFinder AI</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Here is your WebFinder AI credential number:</p>
          
          <div class="credential-box">
            <div class="credential-number">${credentialNumber}</div>
          </div>
          
          <p>Use this number to log in to your account at <a href="https://webfinder.ai">webfinder.ai</a></p>
          
          <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WebFinder AI. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Hello ${name},

Here is your WebFinder AI credential number: ${credentialNumber}

Use this number to log in to your account at webfinder.ai

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} WebFinder AI. All rights reserved.
    `,
  }),
};

// Email sending function
// In production, integrate with services like SendGrid, Mailgun, AWS SES, etc.
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Development logging
  console.log('\n' + '='.repeat(60));
  console.log('EMAIL SERVICE - DEVELOPMENT MODE');
  console.log('='.repeat(60));
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log('-'.repeat(60));
  console.log('HTML Body:');
  console.log(options.html.substring(0, 500) + '...');
  console.log('-'.repeat(60));
  console.log('Text Body:');
  console.log(options.text || 'No text version');
  console.log('='.repeat(60) + '\n');

  // In production, you would integrate with an email provider here
  // Examples:
  
  // SendGrid:
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: options.to }] }],
  //     from: { email: 'noreply@webfinder.ai', name: 'WebFinder AI' },
  //     subject: options.subject,
  //     content: [
  //       { type: 'text/plain', value: options.text || '' },
  //       { type: 'text/html', value: options.html },
  //     ],
  //   }),
  // });

  // For now, we'll simulate successful sending
  return true;
}

// Send welcome email with credential number
export async function sendWelcomeEmail(
  email: string,
  name: string,
  credentialNumber: string
): Promise<boolean> {
  const template = templates.welcomeWithCredential(name, credentialNumber);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

// Send credential reminder email
export async function sendCredentialReminderEmail(
  email: string,
  name: string,
  credentialNumber: string
): Promise<boolean> {
  const template = templates.credentialReminder(name, credentialNumber);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
