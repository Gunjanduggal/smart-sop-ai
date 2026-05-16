require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',

    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Smart SOP AI'
    }
});

const generateAIData = async (productName) => {

    try {

        const prompt = `
Analyze this product: ${productName}

Return ONLY valid JSON.

Example format:
{
  "category": "Electronics",
  "description": "Wireless bluetooth headphones with noise cancellation",
  "tags": ["bluetooth", "wireless", "audio"]
}
`;

        const response = await openai.chat.completions.create({
            model: 'deepseek/deepseek-chat',

            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],

            temperature: 0.7,

            response_format: {
                type: 'json_object'
            }
        });

        let text = response?.choices?.[0]?.message?.content || '{}';

        // Remove markdown wrappers if AI still sends them
        text = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(text);

        return {
            category: parsed.category || 'General',
            description: parsed.description || 'No description generated',
            tags: Array.isArray(parsed.tags)
                ? parsed.tags
                : ['product']
        };

    } catch (error) {

        console.log(
            'OpenRouter Error:',
            error?.response?.data || error.message
        );

        return {
            category: 'General',
            description: 'AI generation failed',
            tags: ['product']
        };
    }
};

module.exports = {
    generateAIData
};