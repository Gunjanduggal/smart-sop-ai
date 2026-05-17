const Product = require('../models/Product');

const InventoryLog =
require('../models/InventoryLog');

const getBusinessInsights =
async (req, res) => {

    try {

        // GET ALL PRODUCTS
        const products =
            await Product.find();

        // GET INVENTORY LOGS
        const logs =
            await InventoryLog.find()
            .sort({
                createdAt: -1
            });

        // TOTAL PRODUCTS
        const totalProducts =
            products.length;

        // TOTAL STOCK
        const totalStock =
            products.reduce(
                (sum, product) =>
                    sum + product.stock,
                0
            );

        // TOTAL INVENTORY VALUE
        const totalInventoryValue =
            products.reduce(
                (sum, product) =>
                    sum +
                    (product.price * product.stock),
                0
            );

        // LOW STOCK PRODUCTS
        const lowStockProducts =
            products
            .filter(product =>
                product.stock < 20
            )
            .map(product => ({

                name: product.name,

                stock: product.stock,

                category:
                    product.category,

                priority:
                    product.stock <= 5
                    ? 'High'
                    : 'Medium'
            }));

        // CATEGORY SUMMARY
        const categorySummary = {};

        products.forEach(product => {

            const category =
                product.category || 'General';

            categorySummary[category] =
                (categorySummary[category] || 0) + 1;
        });

        // TOP CATEGORY DETECTION
        let topCategory = 'General';

        if (
            Object.keys(categorySummary)
            .length > 0
        ) {

            topCategory =
                Object.keys(categorySummary)
                .reduce((a, b) =>

                    categorySummary[a] >
                    categorySummary[b]
                    ? a
                    : b
                );
        }

        // INVENTORY HEALTH
        const inventoryHealth =

            lowStockProducts.length > 3
            ? 'Needs Attention'
            : 'Healthy';

        // RECENT INVENTORY ACTIVITY
        const recentActivity =
            logs.slice(0, 5);

        // FINAL RESPONSE
        res.json({

            success: true,

            businessInsights: {

                totalProducts,

                totalStock,

                totalInventoryValue,

                inventoryHealth,

                topCategory,

                lowStockCount:
                    lowStockProducts.length,

                categorySummary,

                lowStockProducts,

                recentActivity
            }
        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
};

module.exports = {
    getBusinessInsights
};