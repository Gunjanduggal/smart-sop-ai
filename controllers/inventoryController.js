// controllers/inventoryController.js

const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');

const {
    analyzeInventoryCommand
} = require('../services/inventoryAIService');

const processInventoryCommand = async (req, res) => {

    try {

        const { command } = req.body;

        // AI ANALYSIS
        const aiResult =
            await analyzeInventoryCommand(command);

        // FIND PRODUCT
        const product =
            await Product.findOne({
                name: aiResult.productName
            });

        // PRODUCT NOT FOUND
        if (!product) {

            return res.status(404).json({
                success: false,
                message: 'Product not found',
                aiResult
            });
        }

        // VALIDATE DECREASE STOCK
        if (aiResult.action === 'decrease') {

            if (product.stock < aiResult.newQuantity) {

                return res.status(400).json({
                    success: false,
                    message: 'Invalid stock update'
                });
            }
        }

        // UPDATE STOCK
        product.stock =
            aiResult.newQuantity;

        // SAVE UPDATED PRODUCT
        await product.save();

        // CREATE INVENTORY LOG
        await InventoryLog.create({

            productName: product.name,

            oldQuantity:
                aiResult.oldQuantity,

            newQuantity:
                aiResult.newQuantity,

            action:
                aiResult.action
        });

        // RESPONSE
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