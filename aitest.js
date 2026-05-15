require('dotenv').config();

const { generateAIData } = require('./services/aiService');

async function testAI() {

    const result = await generateAIData("iPhone 15 Pro");

    console.log(result);
}

testAI();