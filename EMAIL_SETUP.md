# 📧 Email Configuration Guide - AMD Club

## Overview
The contact form now sends email notifications when visitors submit messages. This guide will help you set up email functionality.

## Features

✅ **Dual Email System:**
- **Admin Notification**: Beautiful HTML email sent to you with contact details
- **User Confirmation**: Professional thank-you email sent to the visitor

✅ **Professional Templates:**
- Branded HTML emails with AMD Club styling
- Responsive design that works on all devices
- Clear formatting with contact information

✅ **Smart Handling:**
- Emails are optional - contact form works even without email configuration
- Graceful error handling
- Detailed console logging

## Quick Setup (Gmail)

### Step 1: Enable 2-Step Verification
1. Go to your Google Account settings
2. Security → 2-Step Verification
3. Follow the prompts to enable it

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Type "AMD Club"
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Open `.env` file and add your credentials:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_RECIPIENT=admin@yourdomain.com
```

**Important:**
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: The 16-character app password (remove spaces)
- `EMAIL_RECIPIENT`: Where contact form submissions should go (can be same as EMAIL_USER)

### Step 4: Restart Server
```bash
# Stop the current server (Ctrl+C)
npm run server
```

### Step 5: Test
1. Go to http://localhost:5174/contact
2. Fill out and submit the contact form
3. Check your inbox for the admin notification
4. The visitor receives a confirmation email

## Email Examples

### Admin Notification Email
```
Subject: 🎭 New Contact Form Submission - AMD Club

┌─────────────────────────────────────┐
│  🎭                                 │
│  New Contact Form Submission         │
│  AMD Club Website                   │
└─────────────────────────────────────┘

From: John Doe
Email: john@example.com
Phone: +1234567890

Message:
I'm interested in joining the drama club!
Can you tell me more about membership?

Submitted: Monday, March 10, 2026 at 2:30 PM
```

### User Confirmation Email
```
Subject: ✅ Message Received - AMD Club

┌─────────────────────────────────────┐
│  ✅                                 │
│  Thank You for Contacting Us!       │
└─────────────────────────────────────┘

Hi John Doe,

Thank you for reaching out to the AMD Club!
We've successfully received your message and
will get back to you as soon as possible.

Your Message:
I'm interested in joining the drama club!

Our team typically responds within 24-48 hours.
```

## Alternative Email Services

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=yourname@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_RECIPIENT=admin@yourdomain.com
```

### Yahoo Mail
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=yourname@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_RECIPIENT=admin@yourdomain.com
```

### Custom SMTP Server
For custom email servers, update server.js:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Console Output

### When Email is Configured:
```
✅ Email server is ready to send messages
📧 Emails sent successfully to admin and john@example.com
```

### When Email is Not Configured:
```
⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env file
```

### When Email Fails:
```
❌ Email configuration error: Invalid login
⚠️  Contact form emails will not be sent
```

## Troubleshooting

### "Invalid login" Error
**Problem:** Gmail is blocking the login
**Solution:**
- Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled
- Check that you copied the app password correctly (no spaces)

### "Authentication failed" Error
**Problem:** Wrong email or password
**Solution:**
- Double-check EMAIL_USER matches your Gmail address
- Regenerate the app password if needed
- Make sure there are no extra spaces in .env file

### Emails Not Being Received
**Problem:** Emails might be in spam
**Solution:**
- Check spam/junk folder
- Add your EMAIL_USER to contacts
- Whitelist the sender email address

### "Less secure apps" Error
**Problem:** Old security settings
**Solution:**
- Don't use "Less secure app access"
- Use App Passwords instead (more secure)
- Gmail removed less secure apps support in 2022

## Security Best Practices

1. ✅ **Never commit .env file to Git**
   - `.env` is in `.gitignore`
   - Use `.env.example` for documentation

2. ✅ **Use App Passwords**
   - Never use your main email password
   - App passwords are safer and can be revoked

3. ✅ **Rotate Credentials**
   - Change app password every 6 months
   - Revoke unused app passwords

4. ✅ **Limit Access**
   - Only give EMAIL_RECIPIENT to trusted people
   - Consider using a dedicated admin email

## Testing Checklist

- [ ] .env file has EMAIL_USER set
- [ ] .env file has EMAIL_PASSWORD set
- [ ] .env file has EMAIL_RECIPIENT set
- [ ] Server started successfully
- [ ] Console shows "✅ Email server is ready"
- [ ] Contact form submits successfully
- [ ] Admin receives notification email
- [ ] User receives confirmation email
- [ ] Emails are not in spam folder
- [ ] HTML formatting displays correctly

## Email Template Customization

To customize email templates, edit `server.js` around line 200-350:

### Change Colors:
```javascript
// Look for background colors in the templates
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
```

### Change Logo/Icon:
```javascript
<div class="icon">🎭</div>  // Change this emoji
```

### Change Text:
```javascript
<p>Thank you for reaching out to the AMD Club!</p>
```

## Support

### Email Working:
✅ You're all set! Contact forms will send emails automatically.

### Email Not Required:
⚠️ Contact form still saves submissions to database even without email.
Check `/api/contacts` endpoint or MongoDB to view submissions.

### Need Help:
- Check console output for specific error messages
- Review this guide step-by-step
- Verify all .env variables are set correctly
- Test with a simple email first

---

**Version:** 1.0  
**Last Updated:** March 10, 2026  
**Requires:** nodemailer ^6.0.0, Node.js 18+
