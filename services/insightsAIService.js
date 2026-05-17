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

const generateBusinessInsights = async (products) => {

    try {

        const prompt = `
You are an AI business analyst.

Analyze this inventory data:

${JSON.stringify(products)}

Provide business insights in JSON format.

Example:

{
  "summary": "Inventory looks healthy",
  "lowStockProducts": ["Mouse"],
  "restockSuggestions": ["Keyboard"],
  "businessTip": "Increase stock for fast moving items"
}
`;

        const response =
            await openai.chat.completions.create({

            model: 'deepseek/deepseek-chat',

            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],

            temperature: 0.5,

            response_format: {
                type: 'json_object'
            }
        });

        let text =
            response?.choices?.[0]?.message?.content || '{}';

        text = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return JSON.parse(text);

    } catch (error) {

        console.log(
            'Insights AI Error:',
            error.message
        );

        return {
            summary:
                'Insights generation failed',

            lowStockProducts: [],

            restockSuggestions: [],

            businessTip:
                'Unable to generate insights'
        };
    }
};

module.exports = {
    generateBusinessInsights
};