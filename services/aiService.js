const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateAIData = async (productName) => {

    try {

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `Analyze this product: ${productName}`
                }
            ]
        });

        return {
            category: 'General',
            description: response.choices[0].message.content,
            tags: ['product']
        };

    } catch (error) {

        console.log(error);

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