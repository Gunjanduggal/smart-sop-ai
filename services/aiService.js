

require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
});

const generateAIData = async (productName) => {

    try {

        const prompt = `
        Analyze this product: ${productName}

        Return ONLY valid JSON in this format:

        {
          "category": "",
          "description": "",
          "tags": []
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
            temperature: 0.7
        });

        const text = response.choices[0].message.content;

        return JSON.parse(text);

    } catch (error) {

        console.log('OpenRouter Error:', error.message);

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