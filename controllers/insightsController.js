const Product = require('../models/Product');

const {
    generateBusinessInsights
} = require('../services/insightsAIService');

const getBusinessInsights = async (req, res) => {

    try {

        const products =
            await Product.find();

        const totalProducts =
            products.length;

        const totalInventory =
            products.reduce(
                (sum, product) =>
                    sum + product.stock,
                0
            );

        const lowStockProducts =
            products.filter(
                product => product.stock < 5
            );

        const aiInsights =
            await generateBusinessInsights(products);

        res.json({

            success: true,

            inventorySummary: {
                totalProducts,
                totalInventory,
                lowStockCount:
                    lowStockProducts.length
            },

            lowStockProducts,

            aiInsights
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getBusinessInsights
};