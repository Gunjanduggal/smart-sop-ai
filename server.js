require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productroutes');
const inventoryRoutes = require('./routes/inventoryroutes');
const insightsRoutes = require('./routes/insightsRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Smart POS Backend Running'));
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/sales', salesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
