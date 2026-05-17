const Product = require('../models/Product');
const Sale = require('../models/Sale');
const InventoryLog = require('../models/inventorylog');

const recordSale = async (req, res) => {
    try {
        const productId = req.body.productId;
        const quantity = Number(req.body.quantity);

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Product and quantity are required'
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available for this sale'
            });
        }

        const oldQuantity = product.stock;
        product.stock -= quantity;
        await product.save();

        const sale = await Sale.create({
            productId: product._id,
            productName: product.name,
            quantity,
            unitPrice: product.price,
            totalAmount: product.price * quantity
        });

        await InventoryLog.create({
            productName: product.name,
            oldQuantity,
            newQuantity: product.stock,
            action: 'sale'
        });

        res.status(201).json({
            success: true,
            message: 'Sale recorded successfully',
            sale,
            updatedProduct: {
                id: product._id,
                name: product.name,
                stock: product.stock
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { recordSale, getSales };
