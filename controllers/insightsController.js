const Product = require('../models/Product');
const InventoryLog = require('../models/inventorylog');
const Sale = require('../models/Sale');
const { generateBusinessInsights } = require('../services/insightsAIService');

const getBusinessInsights = async (req, res) => {
    try {
        const products = await Product.find();
        const logs = await InventoryLog.find().sort({ createdAt: -1 });
        const sales = await Sale.find().sort({ createdAt: -1 });

        const totalProducts = products.length;
        const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
        const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

        const lowStockProducts = products
            .filter((product) => product.stock < 20)
            .map((product) => ({
                name: product.name,
                stock: product.stock,
                category: product.category,
                priority: product.stock <= 5 ? 'High' : 'Medium'
            }));

        const categorySummary = products.reduce((summary, product) => {
            const category = product.category || 'General';
            summary[category] = (summary[category] || 0) + 1;
            return summary;
        }, {});

        const topCategory = Object.keys(categorySummary).length
            ? Object.keys(categorySummary).reduce((a, b) => categorySummary[a] > categorySummary[b] ? a : b)
            : 'General';

        const salesByProduct = sales.reduce((summary, sale) => {
            summary[sale.productName] = (summary[sale.productName] || 0) + sale.quantity;
            return summary;
        }, {});

        const topSellingProducts = Object.entries(salesByProduct)
            .map(([name, unitsSold]) => ({ name, unitsSold }))
            .sort((a, b) => b.unitsSold - a.unitsSold)
            .slice(0, 5);

        const salesTrendMap = sales.reduce((summary, sale) => {
            const day = sale.createdAt.toISOString().slice(0, 10);
            summary[day] = (summary[day] || 0) + sale.quantity;
            return summary;
        }, {});

        const salesTrends = Object.entries(salesTrendMap)
            .map(([date, unitsSold]) => ({ date, unitsSold }))
            .sort((a, b) => a.date.localeCompare(b.date));

        const productPerformance = products.map((product) => ({
            name: product.name,
            stock: product.stock,
            unitsSold: salesByProduct[product.name] || 0,
            status: product.stock < 20 ? 'Needs Restock' : 'Stable'
        }));

        const generatedRecommendations = await generateBusinessInsights({
            products,
            lowStockProducts,
            topSellingProducts,
            salesTrends,
            productPerformance
        });

        res.json({
            success: true,
            businessInsights: {
                totalProducts,
                totalStock,
                totalInventoryValue,
                inventoryHealth: lowStockProducts.length > 3 ? 'Needs Attention' : 'Healthy',
                topCategory,
                lowStockCount: lowStockProducts.length,
                categorySummary,
                lowStockProducts,
                recentActivity: logs.slice(0, 5),
                topSellingProducts,
                salesTrends,
                productPerformance,
                recommendations: generatedRecommendations
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getBusinessInsights };
