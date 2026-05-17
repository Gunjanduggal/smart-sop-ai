const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: String,
    description: String,
    gstRate: Number,
    hsnCode: String,
    tags: [String]
}, { timestamps: true });

productSchema.pre('validate', function() {
    if (this.name) {
        this.name = this.name.trim();
        this.nameKey = this.name.toLowerCase();
    }
});

module.exports = mongoose.model('Product', productSchema);
