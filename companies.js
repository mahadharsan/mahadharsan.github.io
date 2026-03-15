// Companies Data
// This file contains company information and links for the companies page

export const companiesData = [
    {
        name: "Waste Management",
        url: "https://www.wm.com/us/en",
        description: "Fortune 500 waste management and environmental services company"
    },
    {
        name: "WM Careers",
        url: "https://emcm.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/WMCareers/jobs?mode=location&utm_source=wmlandingpage",
        description: "Career opportunities at Waste Management"
    },
    {
        name: "Formlabs",
        url: "https://formlabs.com",
        description: "3D printing technology and manufacturing solutions company"
    },
    {
        name: "Cognizant",
        url: "https://www.cognizant.com",
        description: "Global technology and consulting services company"
    },
    {
        name: "Northeastern University",
        url: "https://www.northeastern.edu",
        description: "Research university known for experiential learning and innovation"
    }
];

// Load companies on the companies page
document.addEventListener('DOMContentLoaded', () => {
    loadCompanies();
});

function loadCompanies() {
    const companiesGrid = document.getElementById('companies-grid');
    if (!companiesGrid) return;

    companiesData.forEach(company => {
        const companyCard = document.createElement('div');
        companyCard.className = 'company-card fade-in';

        companyCard.innerHTML = `
            <a href="${company.url}" target="_blank" rel="noopener noreferrer" class="company-name">
                ${company.name}
            </a>
            <p class="company-description">${company.description}</p>
        `;

        companiesGrid.appendChild(companyCard);
    });
}