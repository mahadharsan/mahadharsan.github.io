// Blog Page JavaScript
// Handles loading and displaying blog posts by platform

import { blogData } from './data.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    setupNavigation();
});

// Load and display blog posts grouped by platform
function loadBlogPosts() {
    const categoriesContainer = document.getElementById('blog-categories');
    
    if (!categoriesContainer || !blogData || blogData.length === 0) {
        categoriesContainer.innerHTML = '<p class="blog-empty">No blog posts available yet. Check back soon!</p>';
        return;
    }

    // Group posts by platform
    const postsByPlatform = {};
    blogData.forEach(post => {
        if (!postsByPlatform[post.platform]) {
            postsByPlatform[post.platform] = [];
        }
        postsByPlatform[post.platform].push(post);
    });

    // Create sections for each platform
    Object.keys(postsByPlatform).sort().forEach(platform => {
        const platformSection = createPlatformSection(platform, postsByPlatform[platform]);
        categoriesContainer.appendChild(platformSection);
    });
}

// Create a section for a platform with its posts
function createPlatformSection(platform, posts) {
    const section = document.createElement('div');
    section.className = 'blog-platform-section';

    const platformHeader = document.createElement('div');
    platformHeader.className = 'blog-platform-header';
    
    const platformTitle = document.createElement('h2');
    platformTitle.className = 'blog-platform-title';
    platformTitle.textContent = platform;
    
    const postCount = document.createElement('span');
    postCount.className = 'blog-platform-count';
    postCount.textContent = `(${posts.length} ${posts.length === 1 ? 'post' : 'posts'})`;
    
    platformHeader.appendChild(platformTitle);
    platformHeader.appendChild(postCount);
    
    const postsGrid = document.createElement('div');
    postsGrid.className = 'blog-posts-grid';

    posts.forEach(post => {
        const postCard = createPostCard(post);
        postsGrid.appendChild(postCard);
    });

    section.appendChild(platformHeader);
    section.appendChild(postsGrid);

    return section;
}

// Create a card for a single blog post
function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-post-card';

    const cardContent = document.createElement('div');
    cardContent.className = 'blog-post-content';

    const title = document.createElement('h3');
    title.className = 'blog-post-title';
    
    const titleLink = document.createElement('a');
    titleLink.href = post.url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.textContent = post.title;
    
    title.appendChild(titleLink);

    const meta = document.createElement('div');
    meta.className = 'blog-post-meta';
    meta.innerHTML = `<span class="blog-post-date">${post.date}</span>`;

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-post-excerpt';
    excerpt.textContent = post.excerpt;

    const readMore = document.createElement('a');
    readMore.href = post.url;
    readMore.target = '_blank';
    readMore.rel = 'noopener noreferrer';
    readMore.className = 'blog-post-link';
    readMore.textContent = 'Read More →';

    cardContent.appendChild(title);
    cardContent.appendChild(meta);
    cardContent.appendChild(excerpt);
    cardContent.appendChild(readMore);
    card.appendChild(cardContent);

    return card;
}

// Setup navigation (same as main site)
function setupNavigation() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Dropdown menu functionality
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
    }
}
