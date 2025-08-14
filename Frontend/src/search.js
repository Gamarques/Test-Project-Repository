import { searchItems } from './api.js';

export function webScrapper(){
    const searchBtn = document.getElementById('searchBtn');
    const keywordInput = document.getElementById('keyword');
    const container = document.getElementById('container');

    // Add event listener for Enter key on the input field
    keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // Add event listener for search button
    searchBtn.addEventListener('click', async () => {
        const query = keywordInput.value.trim();
        if (!query) {
            showMessage('Please, type a product name to search', 'error');
            return;
        }


        clearResults();
        
        const loadingDiv = createLoadingElement();
        container.appendChild(loadingDiv);

        try {
            const response = await searchItems(query);

            loadingDiv.remove();

            if (!response.products || !Array.isArray(response.products)) {
                throw new Error('Invalid response from server');
            }

            if (response.products.length === 0) {
                showMessage('No products found for your search', 'info');
                return;
            }
            const resultsSection = document.createElement('section');
            resultsSection.className = 'results-section fade-in';

            const totalDiv = createTotalElement(response.totalProducts);
            resultsSection.appendChild(totalDiv);

            const productsGrid = createProductsGrid(response.products);
            resultsSection.appendChild(productsGrid);

            container.appendChild(resultsSection);

        } catch (err) {
            console.error('Error:', err);
            showMessage(`Error: ${err.message}`, 'error');
        }
    });
}

// Create loading element
function createLoadingElement() {
    const div = document.createElement('div');
    div.className = 'loading fade-in';
    div.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Searching products...</p>
    `;
    return div;
}

// Create total results element
function createTotalElement(total) {
    const div = document.createElement('div');
    div.id = 'total-results';
    div.className = 'fade-in';
    div.innerHTML = `
        <h2>${total} product${total !== 1 ? 's' : ''} found${total !== 1 ? 's' : ''}</h2>
    `;
    return div;
}

// Create products grid
function createProductsGrid(products) {
    const div = document.createElement('div');
    div.id = 'results';
    div.className = 'fade-in';

    products.forEach(item => {
        const productCard = createProductCard(item);
        div.appendChild(productCard);
    });

    return div;
}

// Create product card 
function createProductCard(item) {
    const div = document.createElement('div');
    div.className = 'product-item fade-in';
    div.innerHTML = `
        ${item.image ? `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        ` : ''}
        <h3>${item.title || 'No title'}</h3>
        <div class="rating">
            <span>⭐</span>
            <span>${item.rating || 'No rating'}</span>
        </div>
        <p>${item.reviewCount || '0'} reviews</p>
    `;
    return div;
}

// Create message element
function showMessage(message, type = 'info') {
    const div = document.createElement('div');
    div.className = `message ${type} fade-in`;
    div.textContent = message;
    
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    container.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

// Clear results
function clearResults() {
    const existingResults = document.querySelector('.results-section');
    if (existingResults) {
        existingResults.remove();
    }
}
