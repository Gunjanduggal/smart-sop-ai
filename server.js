require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const productRoutes =
require('./routes/productroutes');

const inventoryRoutes =
require('./routes/inventoryRoutes');

const insightsRoutes =
require('./routes/insightsRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Smart POS Backend Running');
});

app.use('/api/products', productRoutes);

app.use('/api/inventory', inventoryRoutes);

app.use('/api/insights', insightsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});