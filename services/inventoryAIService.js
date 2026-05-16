require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,

    baseURL: 'https://openrouter.ai/api/v1',

    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Smart POS Inventory AI'
    }
});

const analyzeInventoryCommand = async (command) => {

    try {

        const prompt = `
Extract inventory details from this command:

"${command}"

Return ONLY valid JSON.

Example:
{
  "intent": "UPDATE_INVENTORY",
  "productName": "Laptop",
  "oldQuantity": 10,
  "newQuantity": 50,
  "action": "increase"
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

            temperature: 0,

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
            'Inventory AI Error:',
            error.message
        );

        return {};
    }
};

module.exports = {
    analyzeInventoryCommand
};