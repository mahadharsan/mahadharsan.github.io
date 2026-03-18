// Companies Data
// This file contains company information and links for the companies page

export const companiesData = [
    {
        name: "WM Careers",
        url: "https://emcm.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/WMCareers/jobs?location=United+States&locationId=300000000317426&locationLevel=country&mode=location",
    },
    {
        name: "Formlabs",
        url: "https://careers.formlabs.com/",
    },
    {
        name: "Acco Brands",
        url: "https://accocareers.jobs.hr.cloud.sap/search/?q=&q2=&alertId=&locationsearch=&title=&department=&location=US&date=#searchresults",
    },
    {
        name: "Thermo Fisher Scientific",
        url: "https://jobs.thermofisher.com/global/en/search-results",
    },
    {
        name: "Gilead Sciences",
        url: "https://gilead.yello.co/job_boards/v42vD4vKxb3AkKvV93YsrQ",
    },
    {
        name: "Meta",
        url: "https://www.metacareers.com/jobsearch?sort_by_new=true&offices[0]=Ashburn%2C%20VA&offices[1]=Boston%2C%20MA&offices[2]=Austin%2C%20TX&offices[3]=Atlanta%2C%20GA&offices[4]=Garland%2C%20TX&offices[5]=Stanton%20Springs%2C%20GA&offices[6]=Newton%20County%2C%20GA&offices[7]=Gallatin%2C%20TN&offices[8]=Bowling%20Green%2C%20OH&offices[9]=Mesa%2C%20AZ&offices[10]=Aiken%2C%20SC&offices[11]=Aurora%2C%20IL&offices[12]=Altoona%2C%20IA&offices[13]=Chandler%2C%20AZ&offices[14]=North%20America&offices[15]=Los%20Angeles%2C%20CA&offices[16]=Huntsville%2C%20AL&offices[17]=Montgomery%2C%20AL&offices[18]=New%20Albany%2C%20OH&offices[19]=Seattle%2C%20WA&offices[20]=Sandston%2C%20VA&offices[21]=Sterling%2C%20VA&offices[22]=San%20Diego%2C%20CA&offices[23]=Sausalito%2C%20CA&offices[24]=Salt%20Lake%2C%20UT&offices[25]=Sunnyvale%2C%20CA&offices[26]=Santa%20Clara%2C%20CA&offices[27]=San%20Mateo%2C%20CA&offices[28]=San%20Francisco%2C%20CA&offices[29]=Sarpy%20County%2C%20NE&roles[0]=Full%20time%20employment"
    },
    {
        name: "Amazon New Grad",
        url: "https://www.amazon.jobs/content/en/career-programs/university/jobs-for-grads?country%5B%5D=US"

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
        `;

        companiesGrid.appendChild(companyCard);
    });
}