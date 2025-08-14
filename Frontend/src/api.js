const API_URL = import.meta.env.VITE_API_URL;

export async function searchItems(query) {
    try {
        const params = new URLSearchParams({
            keyword: query
        });

        const response = await fetch(`${API_URL}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Search failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Detailed error:', error);
        throw error;
    }
}