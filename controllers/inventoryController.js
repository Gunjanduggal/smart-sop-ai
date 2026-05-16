const Product = require('../models/Product');

const {
    analyzeInventoryCommand
} = require('../services/inventoryAIService');

const processInventoryCommand = async (req, res) => {

    try {

        const { command } = req.body;

        const aiResult =
            await analyzeInventoryCommand(command);

        const product = await Product.findOne({
            name: aiResult.productName
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                aiResult
            });
        }

        product.stock = aiResult.newQuantity;

        await product.save();

        res.json({
            success: true,

            message:
                'Inventory updated successfully',

            aiAnalysis: aiResult,

            updatedProduct: {
                name: product.name,
                stock: product.stock
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    processInventoryCommand
};