const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    category: {
        type: String
    },

    description: {
        type: String
    },

    tags: {
        type: [String]
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);