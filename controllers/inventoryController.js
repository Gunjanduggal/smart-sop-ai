const Product = require('../models/Product');
const InventoryLog = require('../models/inventorylog');
const { analyzeInventoryCommand } = require('../services/inventoryAIService');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const processInventoryCommand = async (req, res) => {
    try {
        const command = String(req.body.command || '').trim();

        if (!command) {
            return res.status(400).json({ success: false, message: 'Inventory command is required' });
        }

        const aiResult = await analyzeInventoryCommand(command);

        if (!aiResult.productName || !aiResult.action) {
            return res.status(400).json({
                success: false,
                message: 'Could not understand the inventory command',
                aiAnalysis: aiResult
            });
        }

        const products = await Product.find({
            $or: [
                { nameKey: aiResult.productName.toLowerCase() },
                { name: new RegExp(`^${escapeRegex(aiResult.productName)}$`, 'i') }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                aiAnalysis: aiResult
            });
        }

        const updatedProducts = [];

        for (const product of products) {
            const actualOldQuantity = product.stock;
            let newQuantity = actualOldQuantity;

            if (aiResult.mode === 'set') {
                newQuantity = aiResult.requestedQuantity;
            } else if (aiResult.action === 'increase') {
                newQuantity = actualOldQuantity + aiResult.requestedQuantity;
            } else if (aiResult.action === 'decrease') {
                newQuantity = actualOldQuantity - aiResult.requestedQuantity;
            }

            if (newQuantity < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot reduce ${product.name} below zero stock`
                });
            }

            product.stock = newQuantity;
            await product.save();

            await InventoryLog.create({
                productName: product.name,
                oldQuantity: actualOldQuantity,
                newQuantity,
                action: aiResult.action
            });

            updatedProducts.push({
                id: product._id,
                name: product.name,
                oldQuantity: actualOldQuantity,
                newQuantity
            });
        }

        res.json({
            success: true,
            message: products.length > 1
                ? 'Inventory updated for duplicate product records. Please clean duplicate products later.'
                : 'Inventory updated successfully',
            aiAnalysis: { ...aiResult, affectedRecords: products.length },
            updatedProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { processInventoryCommand };
