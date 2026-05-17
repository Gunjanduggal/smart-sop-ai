require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Smart POS AI'
    }
});

const fallbackMap = [
    { keywords: ['laptop', 'computer', 'mouse', 'keyboard', 'headphone', 'earbud'], category: 'Electronics', gstRate: 18, hsnCode: '8471' },
    { keywords: ['mobile', 'phone', 'iphone'], category: 'Electronics', gstRate: 18, hsnCode: '8517' },
    { keywords: ['shirt', 'jeans', 'tshirt'], category: 'Apparel', gstRate: 12, hsnCode: '6109' },
    { keywords: ['rice', 'wheat', 'flour'], category: 'Groceries', gstRate: 5, hsnCode: '1006' }
];

function fallbackAIData(productName) {
    const lower = productName.toLowerCase();
    const match = fallbackMap.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
    const words = lower.split(/\s+/).filter(Boolean);

    return {
        category: match?.category || 'General',
        description: `${productName} suitable for retail sale in a Smart POS catalog.`,
        gstRate: match?.gstRate ?? 18,
        hsnCode: match?.hsnCode || '0000',
        tags: [...new Set(words.length ? words : ['product'])]
    };
}

async function withTimeout(promise, timeoutMs) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('AI request timed out')), timeoutMs);
    });

    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timeoutId);
    }
}

const generateAIData = async (productName) => {
    const fallback = fallbackAIData(productName);

    try {
        const prompt = `
Analyze this product: ${productName}
Return ONLY valid JSON in this exact shape:
{
  "category": "Electronics",
  "description": "Short product description",
  "gstRate": 18,
  "hsnCode": "8471",
  "tags": ["portable", "technology"]
}`;

        const response = await withTimeout(openai.chat.completions.create({
            model: 'deepseek/deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
            response_format: { type: 'json_object' }
        }), 2500);

        let text = response?.choices?.[0]?.message?.content || '{}';
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        return {
            category: parsed.category || fallback.category,
            description: parsed.description || fallback.description,
            gstRate: Number(parsed.gstRate) || fallback.gstRate,
            hsnCode: String(parsed.hsnCode || fallback.hsnCode),
            tags: Array.isArray(parsed.tags) && parsed.tags.length ? parsed.tags : fallback.tags
        };
    } catch (error) {
        console.log('OpenRouter Error:', error.message);
        return fallback;
    }
};

module.exports = { generateAIData, fallbackAIData };

