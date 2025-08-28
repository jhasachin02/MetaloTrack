const API_KEY = 'goldapi-a4to19mevfp47p-io';
const BASE_URL = 'https://www.goldapi.io/api/';

export async function getMetalPrice(symbol, currency = 'INR') {
  try {
    const response = await fetch(`${BASE_URL}${symbol}/${currency}`, {
      headers: {
        'x-access-token': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API Response Status:', response.status);
    
    if (response.status === 429) {
      return { data: null, error: 'Rate limit exceeded. Please wait.' };
    } else if (response.status === 400) {
      return { data: null, error: 'Invalid request. Currency may not be supported.' };
    } else if (response.status === 401) {
      return { data: null, error: 'API key invalid or expired.' };
    } else if (!response.ok) {
      return { data: null, error: `HTTP error! status: ${response.status}` };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.log('API Error:', error);
    return { data: null, error: error.message || 'Failed to fetch data' };
  }
}
