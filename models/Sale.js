const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
