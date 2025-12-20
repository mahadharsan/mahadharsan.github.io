// Business Models Page JavaScript
// Handles table display, search, and sorting functionality

import { businessModelsData, formatRevenue, formatWorkforce } from './business-models-data.js';

let currentSortConfig = { key: 'revenue', direction: 'desc' };
let filteredData = [...businessModelsData];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupSorting();
    renderTable();
    updateStats();
});

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        filteredData = businessModelsData.filter(item =>
            item.model.toLowerCase().includes(searchTerm) ||
            item.industries.some(ind => ind.toLowerCase().includes(searchTerm))
        );

        renderTable();
        updateStats();
    });
}

// Setup sorting functionality
function setupSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.getAttribute('data-sort');
            
            // Update sort config
            if (currentSortConfig.key === sortKey) {
                currentSortConfig.direction = currentSortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortConfig.key = sortKey;
                currentSortConfig.direction = 'desc';
            }

            // Update sort indicators
            sortableHeaders.forEach(h => {
                const indicator = h.querySelector('.sort-indicator');
                if (h === header) {
                    indicator.textContent = currentSortConfig.direction === 'asc' ? '↑' : '↓';
                } else {
                    indicator.textContent = '↕';
                }
            });

            sortData();
            renderTable();
        });
    });
}

// Sort the filtered data
function sortData() {
    filteredData.sort((a, b) => {
        if (currentSortConfig.key === 'model') {
            return currentSortConfig.direction === 'asc' 
                ? a.model.localeCompare(b.model)
                : b.model.localeCompare(a.model);
        }
        if (currentSortConfig.key === 'revenue') {
            return currentSortConfig.direction === 'asc' 
                ? a.revenue - b.revenue
                : b.revenue - a.revenue;
        }
        if (currentSortConfig.key === 'workforce') {
            return currentSortConfig.direction === 'asc' 
                ? a.workforce - b.workforce
                : b.workforce - a.workforce;
        }
        return 0;
    });
}

// Render the table
function renderTable() {
    const tbody = document.getElementById('business-models-tbody');
    if (!tbody) return;

    // Sort before rendering
    sortData();

    tbody.innerHTML = '';

    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = index % 2 === 0 ? 'table-row-even' : 'table-row-odd';

        // Business Model column
        const modelCell = document.createElement('td');
        modelCell.className = 'table-cell-model';
        const modelLink = document.createElement('a');
        modelLink.href = `/business-models/${item.model.toLowerCase()}`;
        modelLink.className = 'model-link';
        modelLink.textContent = item.model;
        modelCell.appendChild(modelLink);
        row.appendChild(modelCell);

        // Industries column
        const industriesCell = document.createElement('td');
        industriesCell.className = 'table-cell-industries';
        const industriesList = document.createElement('ul');
        industriesList.className = 'industries-list';
        item.industries.forEach(industry => {
            const li = document.createElement('li');
            li.textContent = `• ${industry}`;
            industriesList.appendChild(li);
        });
        industriesCell.appendChild(industriesList);
        row.appendChild(industriesCell);

        // Revenue column
        const revenueCell = document.createElement('td');
        revenueCell.className = 'table-cell-revenue';
        const revenueValue = document.createElement('div');
        revenueValue.className = 'revenue-value';
        revenueValue.textContent = formatRevenue(item.revenue);
        const revenueNote = document.createElement('div');
        revenueNote.className = 'revenue-note';
        revenueNote.textContent = item.revenueNote;
        revenueCell.appendChild(revenueValue);
        revenueCell.appendChild(revenueNote);
        row.appendChild(revenueCell);

        // Workforce column
        const workforceCell = document.createElement('td');
        workforceCell.className = 'table-cell-workforce';
        const workforceValue = document.createElement('div');
        workforceValue.className = 'workforce-value';
        workforceValue.textContent = formatWorkforce(item.workforce);
        const workforceNote = document.createElement('div');
        workforceNote.className = 'workforce-note';
        workforceNote.textContent = item.workforceNote;
        workforceCell.appendChild(workforceValue);
        workforceCell.appendChild(workforceNote);
        row.appendChild(workforceCell);

        // Sources column
        const sourcesCell = document.createElement('td');
        sourcesCell.className = 'table-cell-sources';
        sourcesCell.textContent = item.source;
        row.appendChild(sourcesCell);

        tbody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalModels = document.getElementById('total-models');
    const totalRevenue = document.getElementById('total-revenue');
    const totalWorkforce = document.getElementById('total-workforce');
    const modelCount = document.getElementById('model-count');

    if (totalModels) {
        totalModels.textContent = filteredData.length;
    }
    if (modelCount) {
        modelCount.textContent = filteredData.length;
    }

    if (totalRevenue) {
        const combinedRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
        totalRevenue.textContent = formatRevenue(combinedRevenue);
    }

    if (totalWorkforce) {
        const combinedWorkforce = filteredData.reduce((sum, item) => sum + item.workforce, 0);
        totalWorkforce.textContent = formatWorkforce(combinedWorkforce);
    }
}

