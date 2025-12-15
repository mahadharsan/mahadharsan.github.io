// Publications Page JavaScript
// Handles loading and displaying publications

import { publicationsData } from './data.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
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

    if (pub.citations !== undefined && pub.citations !== null) {
        const citations = document.createElement('span');
        citations.className = 'publication-citations';
        citations.textContent = `${pub.citations} ${pub.citations === 1 ? 'citation' : 'citations'}`;
        meta.appendChild(citations);
    }

    content.appendChild(title);
    if (pub.authors) content.appendChild(authors);
    if (pub.venue) content.appendChild(venue);
    content.appendChild(meta);

    item.appendChild(content);
    return item;
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
