import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

interface Product {
    title: string;
    rating: string;
    reviewCount: string;
    image: string;
}

// Clean text function
const cleanText = (text: string | null | undefined): string => {
    return text?.trim() || '';
};

// Function to extract product information
function extractProductInfo(element: Element): Product | null {
    try {
        // Select elements using more specific selectors
        const titleElement = element.querySelector('h2.a-size-mini span, h2 span');
        const reviewElement = element.querySelector('span.a-icon-alt');
        const imgElement = element.querySelector('img.s-image') as HTMLImageElement;
        const reviewCountElement = element.querySelector('div[data-cy="reviews-block"] span.a-size-base.s-underline-text');
        let reviewCount = '';
        
        if (reviewCountElement) {
            const reviewText = cleanText(reviewCountElement.textContent);
            const match = reviewText.match(/(\d+[\.\,]?\d*)/);
            if (match && match[1]) {
                reviewCount = match[1].replace(/[\.\,]/g, '');
            }
        }

        // Check if at least title or image is present
        if (!titleElement && !imgElement) {
            return null;
        }

        return {
            title: cleanText(titleElement?.textContent),
            rating: cleanText(reviewElement?.textContent),
            reviewCount: reviewCount,
            image: imgElement?.src || ''
        };
    } catch (error) {
        console.error('Error extracting product information:', error);
        return null;
    }
}

// Main endpoint - /api/scrape
app.get("/api/scrape", async (req, res) => {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
        return res.status(400).json({ 
            error: "Keyword parameter is required",
            example: "/api/scrape?keyword=notebook"
        });
    }

    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    
    try {
        console.log(`Scraping Amazon for keyword: ${keyword}`);
        
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
            },
            timeout: 10000
        });

        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Select product elements
        const productElements = document.querySelectorAll(
            'div[role="listitem"][data-asin]'
        );
        
        console.log(`Found ${productElements.length} product elements`);

        // Array to store products
        const products: Product[] = [];

        // Iterate over each product element
        productElements.forEach((element) => {
            const product = extractProductInfo(element);
            if (product) {
                products.push(product);
            }
        });

        // Returns the data in JSON format
        res.json({
            success: true,
            keyword: keyword,
            totalProducts: products.length,
            products: products,
            scrapedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Scraping error:', error);
        
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 503) {
                return res.status(503).json({
                    error: 'Amazon blocked the request. Try again later.',
                    details: 'Service unavailable'
                });
            }
            if (error.code === 'ECONNABORTED') {
                return res.status(504).json({
                    error: 'Request timeout',
                    details: 'The request took too long to complete'
                });
            }
        }
        
        res.status(500).json({
            error: 'Failed to scrape Amazon',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Try: http://localhost:${port}/api/scrape?keyword=notebook`);
});

export default app;