const mongoose = require('mongoose');

const inventoryLogSchema =
new mongoose.Schema({

    productName: String,

    oldQuantity: Number,

    newQuantity: Number,

    action: String

}, {
    timestamps: true
});

module.exports = mongoose.model(
    'InventoryLog',
    inventoryLogSchema
);