// Portfolio Website JavaScript
// Handles dynamic content loading, filtering, and interactions

import { experienceData, projectsData, skillsData, educationData, certificationsData } from './data.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupTypingAnimation();
    loadExperience();
    loadEducation();
    loadProjects();
    loadSkills();
    loadCertifications();
    setupNavigation();
    setupFiltering();
    setupScrollAnimations();
    setupContactForm();
});

// Setup Typing Animation for Name
function setupTypingAnimation() {
    const typingElement = document.getElementById('typing-name');
    if (!typingElement) return;

    const fullName = 'Mahadharsan Ravichandran';
    let currentIndex = 0;
    
    // Add cursor class initially
    typingElement.classList.add('typing-cursor');
    
    // Start typing after a brief delay
    setTimeout(() => {
        const typingInterval = setInterval(() => {
            if (currentIndex < fullName.length) {
                typingElement.textContent = fullName.substring(0, currentIndex + 1);
                currentIndex++;
            } else {
                // Remove cursor when typing is complete
                typingElement.classList.remove('typing-cursor');
                clearInterval(typingInterval);
            }
        }, 70); // 70ms per character for smooth typing
    }, 300); // 300ms initial delay
}

// Load Skills Section
function loadSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    Object.entries(skillsData).forEach(([category, skills]) => {
        const skillCategory = document.createElement('div');
        skillCategory.className = 'skill-category fade-in';

        const title = document.createElement('h3');
        title.className = 'skill-category-title';
        title.textContent = category;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'skill-tags';

        // Combine all skills from the category
        const allSkills = [
            ...(skills.languages || []),
            ...(skills.tools || []),
            ...(skills.platforms || []),
            ...(skills.databases || []),
            ...(skills.ml || []),
            ...(skills.deployment || []),
            ...(skills.visualization || []),
            ...(skills.llms || []),
            ...(skills.frameworks || []),
            ...(skills.vectorDBs || []),
            ...(skills.techniques || []),
            ...(skills.analytics || []),
            ...(skills.skills || [])
        ];

        allSkills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            tagsContainer.appendChild(tag);
        });

        skillCategory.appendChild(title);
        skillCategory.appendChild(tagsContainer);
        skillsGrid.appendChild(skillCategory);
    });
}

// Load Experience Section
function loadExperience() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    experienceData.forEach((exp, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.animationDelay = `${index * 0.1}s`;

        const card = document.createElement('div');
        card.className = 'timeline-card';

        // Header
        const header = document.createElement('div');
        header.className = 'timeline-header';

        const title = document.createElement('h3');
        title.className = 'timeline-title';
        title.textContent = exp.title;

        const company = document.createElement('div');
        company.className = 'timeline-company';
        company.textContent = exp.company;

        const meta = document.createElement('div');
        meta.className = 'timeline-meta';
        meta.textContent = `${exp.location} • ${exp.period}`;

        header.appendChild(title);
        header.appendChild(company);
        header.appendChild(meta);

        // Tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'timeline-tags';

        exp.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'timeline-tag';
            tagElement.setAttribute('data-category', tag);
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        // Bullets
        const bulletsList = document.createElement('ul');
        bulletsList.className = 'timeline-bullets';

        exp.bullets.forEach(bullet => {
            const li = document.createElement('li');
            li.innerHTML = bullet;
            bulletsList.appendChild(li);
        });

        card.appendChild(header);
        card.appendChild(tagsContainer);
        card.appendChild(bulletsList);
        timelineItem.appendChild(card);
        timeline.appendChild(timelineItem);
    });
}

// Load Projects Section
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-categories', project.categories.join(','));

        // Header
        const header = document.createElement('div');
        header.className = 'project-header';

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title;

        const badges = document.createElement('div');
        badges.className = 'project-badges';

        project.categories.forEach(category => {
            const badge = document.createElement('span');
            badge.className = 'project-badge';
            badge.setAttribute('data-category', category);
            badge.textContent = category;
            badges.appendChild(badge);
        });

        header.appendChild(title);
        header.appendChild(badges);

        // Body
        const body = document.createElement('div');
        body.className = 'project-body';

        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description;

        const metrics = document.createElement('div');
        metrics.className = 'project-metrics';
        metrics.textContent = `📊 ${project.metrics}`;

        const technologies = document.createElement('div');
        technologies.className = 'project-technologies';

        project.technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'project-tech-tag';
            techTag.textContent = tech;
            technologies.appendChild(techTag);
        });

        const links = document.createElement('div');
        links.className = 'project-links';

        if (project.github && project.github !== '#') {
            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'project-link';
            githubLink.textContent = 'GitHub →';
            links.appendChild(githubLink);
        }

        if (project.demo && project.demo !== '#') {
            const demoLink = document.createElement('a');
            demoLink.href = project.demo;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.className = 'project-link';
            demoLink.textContent = 'Live Demo →';
            links.appendChild(demoLink);
        }

        body.appendChild(description);
        body.appendChild(metrics);
        body.appendChild(technologies);
        if (links.children.length > 0) {
            body.appendChild(links);
        }

        card.appendChild(header);
        card.appendChild(body);
        projectsGrid.appendChild(card);
    });
}

// Load Education Section
function loadEducation() {
    const educationGrid = document.getElementById('education-grid');
    if (!educationGrid) return;

    educationData.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'education-card fade-in';

        const degree = document.createElement('div');
        degree.className = 'education-degree';
        degree.textContent = edu.degree;

        const school = document.createElement('div');
        school.className = 'education-school';
        school.textContent = edu.school;

        const meta = document.createElement('div');
        meta.className = 'education-meta';
        meta.textContent = `${edu.location} • ${edu.period}`;

        card.appendChild(degree);
        card.appendChild(school);
        card.appendChild(meta);

        if (edu.gpa) {
            const gpa = document.createElement('div');
            gpa.className = 'education-gpa';
            gpa.textContent = `GPA: ${edu.gpa}`;
            card.appendChild(gpa);
        }

        educationGrid.appendChild(card);
    });
}

// Load Certifications Section
function loadCertifications() {
    const certificationsGrid = document.getElementById('certifications-grid');
    if (!certificationsGrid) return;

    certificationsData.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'certification-card fade-in';

        const name = document.createElement('div');
        name.className = 'certification-name';
        name.textContent = cert.name;

        const issuer = document.createElement('div');
        issuer.className = 'certification-issuer';
        issuer.textContent = cert.issuer;

        const year = document.createElement('div');
        year.className = 'certification-year';
        year.textContent = cert.year;

        card.appendChild(name);
        card.appendChild(issuer);
        card.appendChild(year);
        certificationsGrid.appendChild(card);
    });
}

// Setup Navigation
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80; // Navbar height
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dropdown menu functionality
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Setup Project Filtering
function setupFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Get filter value
            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-categories').split(',');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Setup Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.skill-category, .timeline-item, .project-card, .education-card, .certification-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (!form) return;

    // Check if we're on the success page (from query parameter)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        if (formMessage) {
            formMessage.style.display = 'block';
            formMessage.style.color = '#10b981';
            formMessage.textContent = '✓ Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
            form.style.display = 'none';
        }
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Hide any previous messages
        if (formMessage) {
            formMessage.style.display = 'none';
        }
        
        // Encode form data for Netlify Forms
        const formData = new FormData(form);
        const encoded = new URLSearchParams();
        
        // Add all form fields
        for (const [key, value] of formData.entries()) {
            encoded.append(key, value);
        }
        
        try {
            // Submit to Netlify Forms endpoint
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encoded.toString()
            });

            // Netlify Forms returns 200 on success, even if it's HTML
            // Check response status and content
            if (response.status === 200) {
                // Show success message
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.style.color = '#10b981';
                    formMessage.textContent = '✓ Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
                }
                form.reset();
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(`Form submission failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Show error message
            if (formMessage) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#ef4444';
                formMessage.textContent = '✗ Sorry, there was an error sending your message. Please try again or email me directly at mahadharsanusa@gmail.com';
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
