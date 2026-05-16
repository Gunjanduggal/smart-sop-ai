require('dotenv').config();

const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productroutes');

// ADD THIS LINE
const inventoryRoutes = require('./routes/inventoryRoutes');

const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Smart POS Backend Running");
});

// Existing product route
app.use('/api/products', productRoutes);

// ADD THIS BELOW PRODUCT ROUTE
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});