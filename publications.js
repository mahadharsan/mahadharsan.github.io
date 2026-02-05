// Publications Page JavaScript
// Handles loading and displaying publications

import { publicationsData } from './data.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    loadPublications();
    setupNavigation();
});

// Load and display publications
function loadPublications() {
    const publicationsContainer = document.getElementById('publications-list');
    
    if (!publicationsContainer) {
        return;
    }

    if (!publicationsData || publicationsData.length === 0) {
        publicationsContainer.innerHTML = '<p class="publications-empty">No publications available yet. Check back soon!</p>';
        return;
    }

    // Sort publications by year (most recent first)
    const sortedPublications = [...publicationsData].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });

    // Group by year (optional - can be removed if you want flat list)
    const publicationsByYear = {};
    sortedPublications.forEach(pub => {
        const year = pub.year || 'Unknown';
        if (!publicationsByYear[year]) {
            publicationsByYear[year] = [];
        }
        publicationsByYear[year].push(pub);
    });

    // Create publication entries
    Object.keys(publicationsByYear).sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return parseInt(b) - parseInt(a);
    }).forEach(year => {
        const yearSection = createYearSection(year, publicationsByYear[year]);
        publicationsContainer.appendChild(yearSection);
    });
}

// Create a section for a year with its publications
function createYearSection(year, publications) {
    const section = document.createElement('div');
    section.className = 'publications-year-section';

    const yearHeader = document.createElement('h2');
    yearHeader.className = 'publications-year-title';
    yearHeader.textContent = year;

    const publicationsList = document.createElement('div');
    publicationsList.className = 'publications-list';

    publications.forEach(publication => {
        const publicationItem = createPublicationItem(publication);
        publicationsList.appendChild(publicationItem);
    });

    section.appendChild(yearHeader);
    section.appendChild(publicationsList);

    return section;
}

// Create an item for a single publication
function createPublicationItem(pub) {
    const item = document.createElement('article');
    item.className = 'publication-item';

    const content = document.createElement('div');
    content.className = 'publication-content';

    const title = document.createElement('h3');
    title.className = 'publication-title';
    
    if (pub.url) {
        const titleLink = document.createElement('a');
        titleLink.href = pub.url;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = pub.title;
        title.appendChild(titleLink);
    } else {
        title.textContent = pub.title;
    }

    const authors = document.createElement('p');
    authors.className = 'publication-authors';
    authors.textContent = pub.authors || '';

    const venue = document.createElement('p');
    venue.className = 'publication-venue';
    venue.textContent = pub.venue || '';

    const meta = document.createElement('div');
    meta.className = 'publication-meta';
    
    if (pub.year) {
        const year = document.createElement('span');
        year.className = 'publication-year';
        year.textContent = pub.year;
        meta.appendChild(year);
    }


    content.appendChild(title);
    if (pub.authors) content.appendChild(authors);
    if (pub.venue) content.appendChild(venue);
    content.appendChild(meta);

    item.appendChild(content);
    return item;
}

// Setup Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    if (!themeToggle || !themeIcon) return;

    // Check for saved theme preference, default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const themeToApply = (savedTheme === 'light') ? 'light' : 'dark'; // Only 'light' explicitly switches to light mode
    setTheme(themeToApply);

    // Theme toggle button event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update icon based on theme
        if (theme === 'dark') {
            themeIcon.textContent = '🌙'; // Moon icon for dark mode
            themeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            themeIcon.textContent = '☀️'; // Sun icon for light mode
            themeToggle.setAttribute('title', 'Switch to dark mode');
        }

        // Update aria-label for accessibility
        themeToggle.setAttribute('aria-label', `Toggle theme (currently ${theme})`);
    }
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

    // Dropdown menu functionality - supports multiple dropdowns
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

        if (dropdownToggle) {
            // Toggle dropdown on click
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });

                dropdown.classList.toggle('active');
            });
        }
    });

    // Nested dropdown functionality
    const nestedDropdowns = document.querySelectorAll('.nav-dropdown-sub');

    nestedDropdowns.forEach(nestedDropdown => {
        const subToggle = nestedDropdown.querySelector('.dropdown-sub-toggle');

        if (subToggle) {
            subToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                nestedDropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
        if (!e.target.closest('.nav-dropdown-sub')) {
            nestedDropdowns.forEach(nestedDropdown => {
                nestedDropdown.classList.remove('active');
            });
        }
    });

    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            nestedDropdowns.forEach(nestedDropdown => {
                nestedDropdown.classList.remove('active');
            });
        }
    });
}
