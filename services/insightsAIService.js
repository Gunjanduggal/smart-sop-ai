require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Smart POS Insights AI'
    }
});

const buildFallbackInsights = ({ lowStockProducts, topSellingProducts }) => ({
    summary: lowStockProducts.length
        ? `${lowStockProducts.length} product(s) need restocking attention.`
        : 'Inventory is currently healthy.',
    recommendations: lowStockProducts.length
        ? lowStockProducts.map((item) => `Restock ${item.name} soon; only ${item.stock} units remain.`)
        : ['Maintain current stock levels and monitor fast-moving products.'],
    focusProduct: topSellingProducts[0]?.name || null
});

const generateBusinessInsights = async (payload) => {
    try {
        const prompt = `
You are an AI business analyst for a Smart POS system.
Return ONLY JSON with this exact shape:
{
  "summary": "short summary",
  "recommendations": ["recommendation 1", "recommendation 2"],
  "focusProduct": "product name or null"
}
Analyze this data:
${JSON.stringify(payload)}
`;

        const response = await openai.chat.completions.create({
            model: 'deepseek/deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: 'json_object' }
        });

        let text = response?.choices?.[0]?.message?.content || '{}';
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        const fallback = buildFallbackInsights(payload);

        return {
            summary: parsed.summary || fallback.summary,
            recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length
                ? parsed.recommendations
                : fallback.recommendations,
            focusProduct: parsed.focusProduct || fallback.focusProduct
        };
    } catch (error) {
        console.log('Insights AI Error:', error.message);
        return buildFallbackInsights(payload);
    }
};

module.exports = { generateBusinessInsights };
