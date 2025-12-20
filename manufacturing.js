// Manufacturing Business Model Page JavaScript
// Loads and displays Manufacturing model details

import { getBusinessModel, formatRevenue, formatWorkforce } from './business-models-data.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadManufacturingData();
});

function loadManufacturingData() {
    const model = getBusinessModel('Manufacturing');
    if (!model) {
        console.error('Manufacturing model not found');
        return;
    }

    // Update revenue stat
    const revenueStat = document.getElementById('revenue-stat');
    const revenueNote = document.getElementById('revenue-note');
    if (revenueStat) revenueStat.textContent = formatRevenue(model.revenue);
    if (revenueNote) revenueNote.textContent = model.revenueNote;

    // Update workforce stat
    const workforceStat = document.getElementById('workforce-stat');
    const workforceNote = document.getElementById('workforce-note');
    if (workforceStat) workforceStat.textContent = formatWorkforce(model.workforce);
    if (workforceNote) workforceNote.textContent = model.workforceNote;

    // Update industries list
    const industriesList = document.getElementById('industries-list');
    if (industriesList) {
        industriesList.innerHTML = '';
        model.industries.forEach(industry => {
            const li = document.createElement('li');
            li.textContent = industry;
            industriesList.appendChild(li);
        });
    }

    // Update sources
    const sourcesText = document.getElementById('sources-text');
    if (sourcesText) sourcesText.textContent = model.source;
}

