const Product = require('../models/Product');

const {
    generateAIData
} = require('../services/aiService');


// ADD PRODUCT
const addProduct = async (req, res) => {

    try {

        const { name, price, stock } = req.body;

        // CHECK IF PRODUCT EXISTS
        const existingProduct = await Product.findOne({
            name
        });

        if (existingProduct) {

            return res.status(400).json({
                success: false,
                message: 'Product already exists'
            });
        }

        // AI DATA
        const aiData = await generateAIData(name);

        // CREATE PRODUCT
        const product = await Product.create({
            name,
            price,
            stock,

            category: aiData.category,
            description: aiData.description,
            tags: aiData.tags
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET PRODUCTS
const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addProduct,
    getProducts
};