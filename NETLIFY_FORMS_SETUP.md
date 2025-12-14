# How to Receive Contact Form Messages

## Where Messages Are Stored

### 1. Netlify Dashboard (Automatic)
- All form submissions are automatically stored in your Netlify dashboard
- Go to: https://app.netlify.com
- Select your site → **Forms** → **contact**
- You'll see all submissions with:
  - Name
  - Email
  - Message
  - Timestamp

## Set Up Email Notifications

### Step 1: Go to Form Settings
1. In Netlify dashboard, go to **Forms** → **contact**
2. Click on **Form settings** or **Notifications**

### Step 2: Enable Email Notifications
1. Find **Email notifications** section
2. Toggle it **ON**
3. Enter your email: `mahadharsanusa@gmail.com`
4. Click **Save**

### Step 3: Test It
- Submit a test message from your website
- You should receive an email notification within a few seconds

## Alternative: Use Netlify Functions (Advanced)

If you want more control, you can set up a serverless function to:
- Send custom email templates
- Forward to multiple emails
- Integrate with other services (Slack, Discord, etc.)

## Free Tier Limits

- **Netlify Forms Free Tier**: 
  - 100 submissions per month
  - Email notifications included
  - All submissions stored in dashboard

## Pro Tip

You can also:
- Export submissions as CSV
- Set up webhooks for integrations
- Use Zapier/Make.com to forward to other services
