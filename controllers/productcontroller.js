const Product = require('../models/Product');
const { generateAIData } = require('../services/aiService');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const addProduct = async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        const price = Number(req.body.price);
        const stock = Number(req.body.stock);

        if (!name || Number.isNaN(price) || Number.isNaN(stock)) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, and stock are required'
            });
        }

        const existingProduct = await Product.findOne({
            $or: [
                { nameKey: name.toLowerCase() },
                { name: new RegExp(`^${escapeRegex(name)}$`, 'i') }
            ]
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product already exists'
            });
        }

        const aiData = await generateAIData(name);
        const product = await Product.create({
            name,
            price,
            stock,
            category: aiData.category,
            description: aiData.description,
            gstRate: aiData.gstRate,
            hsnCode: aiData.hsnCode,
            tags: aiData.tags
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addProduct, getProducts };
