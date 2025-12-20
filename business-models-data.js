// Business Models Data
// Comprehensive data structure for business models analysis

export const businessModelsData = [
  {
    id: 1,
    model: "Subscription",
    industries: [
      "SaaS (Salesforce, Microsoft, Adobe, Slack, Zoom)",
      "Streaming Media (Netflix, Spotify, Disney+, Hulu, HBO Max)",
      "News & Publishing (NYT, WSJ, Washington Post)",
      "Fitness & Wellness (Peloton, ClassPass, Fitbit Premium)",
      "Food Delivery (HelloFresh, Blue Apron, ButcherBox)",
      "Software Dev Tools (GitHub, JetBrains, Figma)",
      "Cloud Infrastructure (AWS, Google Cloud, Azure)",
      "Entertainment (Xbox Game Pass, PlayStation Plus)",
      "E-learning (Coursera, LinkedIn Learning, Skillshare)",
      "Professional Services (Adobe Creative Cloud, Canva Pro)"
    ],
    revenue: 219150, // in millions USD
    workforce: 3500000, // estimated
    revenueNote: "US portion of $492B global subscription economy (2024)",
    workforceNote: "Estimated across SaaS, streaming, and digital subscription sectors",
    source: "Grand View Research 2024, UBS Global, CompTIA Tech Workforce Report"
  },
  {
    id: 2,
    model: "E-commerce",
    industries: [
      "Online Retail (Amazon, Walmart.com, Target.com)",
      "Fashion & Apparel (Zappos, ASOS, Shein)",
      "Electronics (Best Buy, Newegg, B&H Photo)",
      "Home Goods (Wayfair, Overstock, Home Depot online)",
      "Beauty & Cosmetics (Sephora, Ulta, Glossier)",
      "Books & Media (Amazon Books, Barnes & Noble online)",
      "Grocery Delivery (Instacart, FreshDirect, Thrive Market)",
      "Pet Supplies (Chewy, Petco online)",
      "Specialty Foods (Williams Sonoma, Sur La Table)",
      "Digital Marketplace (eBay, Etsy, Poshmark)"
    ],
    revenue: 1092000, // est
    workforce: 2800000,
    revenueNote: "US e-commerce revenue 2024 (approximated)",
    workforceNote: "Includes warehouse, logistics, customer service, tech staff",
    source: "US Census Bureau, eMarketer 2024, BLS"
  },
  {
    id: 3,
    model: "Marketplace/Platform",
    industries: [
      "Ride-sharing (Uber, Lyft)",
      "Home Rentals (Airbnb, Vrbo)",
      "Freelance Services (Upwork, Fiverr, Freelancer)",
      "E-commerce Marketplace (eBay, Etsy, Poshmark)",
      "Food Delivery (DoorDash, Uber Eats, Grubhub)",
      "Job Platforms (LinkedIn, Indeed, ZipRecruiter)",
      "Task Services (TaskRabbit, Thumbtack)",
      "Peer-to-Peer (Turo car rental, Neighbor storage)",
      "B2B Marketplaces (Alibaba, ThomasNet)",
      "Service Aggregators (Yelp, Angie's List)"
    ],
    revenue: 556700, // Gig economy market size
    workforce: 78400000, // Including all gig workers (full and part-time)
    revenueNote: "US gig economy market 2024 (estimated, includes all marketplace platforms)",
    workforceNote: "~78M gig workers (36% of workforce), includes full-time and part-time independent workers",
    source: "BLS 2024, MBO Partners, Upwork Gig Economy Report 2024"
  },
  {
    id: 4,
    model: "Advertising/Media",
    industries: [
      "Digital Advertising (Google Ads, Meta Ads, YouTube Ads)",
      "Social Media (Facebook, Instagram, TikTok, X/Twitter)",
      "Search Advertising (Google Search, Bing Ads)",
      "Display/Banner Ads (Programmatic, Ad Networks)",
      "Video Advertising (YouTube, Streaming Platforms)",
      "Podcast Advertising (Spotify, Apple Podcasts)",
      "Traditional Media (TV, Radio, Print with digital extensions)",
      "Out-of-Home (Digital billboards, Transit ads)",
      "Retail Media Networks (Amazon Ads, Walmart Connect)",
      "Content Platforms (News sites, Blogs, Publishers)"
    ],
    revenue: 258600,
    workforce: 504500,
    revenueNote: "Total US digital advertising revenue 2024 (IAB/PwC)",
    workforceNote: "Advertising, PR, and related services employment (Nov 2024)",
    source: "IAB/PwC Internet Advertising Revenue Report 2024, BLS Employment Statistics"
  },
  {
    id: 5,
    model: "Transaction/Fee-based",
    industries: [
      "Payment Processing (Stripe, PayPal, Square)",
      "Stock Brokers (Robinhood, E*TRADE, Charles Schwab)",
      "Real Estate Brokers (Compass, Redfin, RE/MAX, Zillow)",
      "Insurance Brokers (Covered California, eHealth)",
      "Auction Houses (Christie's, Sotheby's, eBay auctions)",
      "Credit Card Networks (Visa, Mastercard, Amex)",
      "Money Transfer (Western Union, MoneyGram, Wise)",
      "Crypto Exchanges (Coinbase, Kraken, Binance.US)",
      "Business Brokers (BizBuySell, Flippa)",
      "Event Ticketing (Ticketmaster, StubHub)"
    ],
    revenue: 145000, // Approximated
    workforce: 1200000, // Approximated
    revenueNote: "Combined payment processing, brokerage, and transaction services (approximated 2024)",
    workforceNote: "Estimated across financial services, real estate, and payment processing sectors",
    source: "Financial services industry reports, Statista 2024 (approximated)"
  },
  {
    id: 6,
    model: "Freemium",
    industries: [
      "Productivity Tools (Notion, Evernote, Trello, Asana)",
      "Communication (Zoom, Slack, Discord, Microsoft Teams)",
      "Cloud Storage (Dropbox, Google Drive, OneDrive)",
      "Design Tools (Canva, Figma free tier)",
      "Gaming (Fortnite, League of Legends, Mobile games)",
      "Music Streaming (Spotify Free, YouTube Music)",
      "Email Marketing (MailChimp, SendGrid)",
      "Project Management (Monday.com, ClickUp)",
      "Video Conferencing (Zoom, Google Meet)",
      "Developer Tools (GitHub, GitLab free tier)"
    ],
    revenue: 85000, // Subset of SaaS/subscription market
    workforce: 850000, // Estimated
    revenueNote: "Freemium model revenue subset of broader SaaS market (estimated 2024)",
    workforceNote: "Estimated based on freemium-focused companies within tech sector",
    source: "SaaS industry reports 2024, Gartner (estimated)"
  },
  {
    id: 7,
    model: "Manufacturing",
    industries: [
      "Automotive (Ford, GM, Tesla)",
      "Electronics (Apple, Intel, semiconductor manufacturing)",
      "Food & Beverage (Coca-Cola, PepsiCo, Kraft Heinz)",
      "Pharmaceuticals (Pfizer, Merck, Johnson & Johnson)",
      "Aerospace (Boeing, Lockheed Martin, SpaceX)",
      "Chemical Manufacturing (Dow, DuPont)",
      "Consumer Goods (P&G, Unilever, 3M)",
      "Machinery & Equipment (Caterpillar, Deere & Company)",
      "Textiles & Apparel (Nike, Under Armour factories)",
      "Metal Fabrication (Steel, aluminum manufacturing)"
    ],
    revenue: 2200000,
    workforce: 12760000,
    revenueNote: "US manufacturing GDP contribution Q4 2024",
    workforceNote: "Manufacturing sector employment December 2024",
    source: "BLS Manufacturing Statistics Dec 2024, US Quarterly GDP Data"
  }
];

// Helper function to format revenue
export function formatRevenue(num) {
  if (num >= 1000000) return `$${(num / 1000).toFixed(1)}B`;
  if (num >= 1000) return `$${(num / 1).toFixed(0)}M`;
  return `$${num}M`;
}

// Helper function to format workforce
export function formatWorkforce(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
}

// Get business model by ID or name
export function getBusinessModel(idOrName) {
  if (typeof idOrName === 'number') {
    return businessModelsData.find(model => model.id === idOrName);
  }
  return businessModelsData.find(model => 
    model.model.toLowerCase() === idOrName.toLowerCase()
  );
}

