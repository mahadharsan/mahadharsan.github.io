// Podcast Page JavaScript
// Handles navigation and interactions

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

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