# Custom Domain Setup Guide

## Quick Summary
- **Netlify hosting**: FREE (already using this)
- **Custom domain on Netlify**: FREE
- **Domain name purchase**: $1-15/year (one-time cost)

## Step-by-Step Instructions

### Option 1: Very Cheap Domain ($1-5/year)

#### Recommended Registrars:
1. **Namecheap** - Often has $1-2/year deals for .xyz, .site domains
2. **Porkbun** - Competitive prices, good reputation
3. **Cloudflare Registrar** - At-cost pricing (no markup)
4. **Google Domains** - Now Squarespace Domains, still good prices

#### Best Cheap Professional Options:
- `mahadharsan.xyz` - ~$1-2/year
- `mahadharsan.site` - ~$2-3/year
- `mahadharsan.online` - ~$2-3/year
- `mahadharsan.tech` - ~$3-5/year

### Option 2: Professional Domain ($10-15/year)

#### Best Professional Options:
- `mahadharsan.dev` - ~$12-15/year (perfect for developers)
- `mahadharsan.com` - ~$10-15/year (most professional)
- `mahadharsan.io` - ~$15-20/year (tech industry favorite)

### Setup Process (After Purchasing Domain)

#### Step 1: Add Domain to Netlify
1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site: `portfolio-website`
3. Go to **Site settings** → **Domain management**
4. Click **Add custom domain**
5. Enter your domain (e.g., `mahadharsan.dev`)
6. Click **Verify**

#### Step 2: Configure DNS Records
Netlify will show you what DNS records to add. You have two options:

**Option A: Use Netlify DNS (Recommended - Free)**
1. In Netlify, click **Set up Netlify DNS**
2. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
3. Go to your domain registrar
4. Find "Nameservers" or "DNS Management"
5. Replace existing nameservers with Netlify's nameservers
6. Save and wait 24-48 hours for propagation

**Option B: Use Your Registrar's DNS (Alternative)**
1. In Netlify, you'll see DNS records to add:
   - Type: `A` or `CNAME`
   - Name: `@` or `www`
   - Value: Netlify's IP or domain
2. Go to your domain registrar's DNS settings
3. Add the records Netlify provides
4. Save and wait 24-48 hours

#### Step 3: Update Website Files
Once your domain is active, we'll need to update:
- `sitemap.xml` (if we add it back)
- Open Graph URLs in `index.html`
- Any hardcoded URLs

#### Step 4: SSL Certificate (Automatic)
- Netlify automatically provides FREE SSL certificates
- Your site will use HTTPS automatically
- No additional setup needed!

## Free Alternatives (Not Recommended for Professional Use)

### 1. Netlify Subdomain (Still Free, But Not Professional)
- You can customize the subdomain name in Netlify settings
- But it will still be `yourname.netlify.app`
- Not as professional as a custom domain

### 2. Free Subdomain Services
- Services like Freenom (.tk, .ml domains) are free but:
  - Often blocked by email providers
  - Look unprofessional
  - May have restrictions
  - **Not recommended for job applications**

## Recommendation

**Best Value**: Get a `.dev` domain (~$12/year)
- Professional and recognized
- Perfect for developers/data professionals
- Example: `mahadharsan.dev`

**Budget Option**: Get a `.xyz` or `.site` domain (~$1-3/year)
- Very affordable
- Still professional enough
- Example: `mahadharsan.xyz`

## After Setup

Once your domain is configured and active (usually 24-48 hours), let me know and I'll:
1. Update all URLs in your website files
2. Add proper redirects
3. Update sitemap and meta tags
4. Ensure everything works with your new domain

## Need Help?

If you need help with any step, just let me know:
- Which domain you purchased
- Which registrar you used
- Any errors you encounter
