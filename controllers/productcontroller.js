const Product = require('../models/Product');

const { generateAIData } = require('../services/aiService');

const addProduct = async (req, res) => {

    try {

        const { name, price } = req.body;

        const aiData = await generateAIData(name);

        const product = await Product.create({
            name,
            price,
            category: aiData.category,
            description: aiData.description,
            tags: aiData.tags
        });

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addProduct,
    getProducts
};