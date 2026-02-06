# Create Blog Page with Categorized Posts

## Overview
Replace the two separate blog links in the dropdown with a single "Blog" link that goes to a new blog.html page. The blog page will display blog posts categorized by their source platform (dev.to, Medium, etc.).

## Files to Create

1. **`blog.html`** - New blog page with categorized sections
   - Header with navigation (same as index.html)
   - Hero section with "Blog" title
   - Categorized sections for each platform (dev.to, Medium, etc.)
   - Each category displays blog posts with title, date, excerpt, and link
   - Footer (same as index.html)

2. **`blog.js`** - JavaScript for blog page
   - Load blog posts from data
   - Render posts by category
   - Handle navigation and interactions

## Files to Modify

1. **`index.html`** (line 55-56)
   - Replace two blog links with single "Blog" link
   - Change from:
     ```html
     <li><a href="https://dev.to/...">Blog (dev.to)</a></li>
     <li><a href="https://medium.com/...">Blog (Medium)</a></li>
     ```
   - To:
     ```html
     <li><a href="/blog">Blog</a></li>
     ```

2. **`data.js`** - Add blog posts data structure
   - Add `blogData` export with array of blog posts
   - Each post should have: title, url, platform (dev.to, Medium, etc.), date, excerpt
   - Example structure:
     ```javascript
     export const blogData = [
       {
         title: "Introduction to ARIMA: How I Gained Intuition Behind it",
         url: "https://dev.to/maha_data/how-i-gained-the-intuition-behind-the-arima-model-36a0",
         platform: "dev.to",
         date: "Mar 27, 2025",
         excerpt: "Exploring forecasting techniques with a focus on ARIMA..."
       },
       {
         title: "Your Programming Skills Aren't Disappearing...",
         url: "https://medium.com/@maha_dharsan/your-programming-skills-arent-disappearing-your-brain-is-just-being-efficient-e7f498aba52e",
         platform: "Medium",
         date: "Date here",
         excerpt: "Understanding how your brain works..."
       }
     ];
     ```

3. **`vite.config.js`** (line 8-10)
   - Add blog.html to rollupOptions.input
   - Add: `blog: resolve(__dirname, 'blog.html'),`

4. **`netlify.toml`** (line 11)
   - Add `/blog.html` to the except list
   - Update: `except = ["/success.html", "/blog.html", "/*.css", ...]`

5. **`styles.css`** - Add blog page styles
   - Styles for blog categories/sections
   - Blog post card styles
   - Platform badges/labels
   - Responsive design for blog layout

## Implementation Details

- Blog page will group posts by platform (dev.to, Medium, etc.)
- Each platform gets its own section with a heading
- Posts displayed as cards with title, date, excerpt, and "Read More" link
- External links open in new tab with proper security attributes
- Design matches existing portfolio style
- Fully responsive

## Result

- Single "Blog" link in Explore More dropdown
- Clicking "Blog" navigates to `/blog` page
- Blog page displays posts organized by platform (dev.to, Medium, etc.)
- Easy to add new posts by updating `blogData` in `data.js`

## Todos

1. Update dropdown in index.html to have single Blog link
2. Add blogData to data.js with existing blog posts
3. Create blog.html page structure
4. Create blog.js for loading and displaying posts
5. Update vite.config.js to include blog.html
6. Update netlify.toml to allow /blog.html routing
7. Add CSS styles for blog page
