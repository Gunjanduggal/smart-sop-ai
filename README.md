# Smart POS AI Assistant

An AI-powered Smart POS demo application that helps with product creation, inventory updates, sales tracking, and business insights.

## Features

### AI Assisted Product Listing
Enter a product name, price, and opening stock. The system generates:

- Product description
- Suggested category
- GST rate
- HSN code
- Keywords / tags

### Text Based Inventory Operations
Run stock commands in natural language, for example:

```text
Increase mobile stock by 5
Decrease Laptop inventory from 60 to 50
Set iphone inventory to 25
```

The backend detects the action, extracts the product and quantity, updates inventory, and stores an inventory log.

### Business Insights
The dashboard provides:

- Total products
- Total stock
- Inventory value
- Low-stock products
- Top-selling products
- Sales trends
- Product performance
- AI-generated recommendations

### Sales Recording
A sale can be recorded from the dashboard. When a sale is recorded:

- Product stock decreases automatically
- Sales data is stored separately
- Top-selling products and product performance update from real sales data

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- OpenRouter / AI service integration

### Frontend
- React
- Vite
- CSS

## Project Structure

```text
smart-pos/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    └── package.json
```

## Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running locally.

### 2. Configure backend environment
Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartpos
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Run the backend

```powershell
cd C:\Users\Asus\smart-pos\backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 4. Run the frontend

```powershell
cd C:\Users\Asus\smart-pos\frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

> Important: Use `http://localhost:5173` for the React frontend. Port `5500` is usually VS Code Live Server and is not the main React app.

## Main API Endpoints

### Products

```http
GET /api/products
POST /api/products/add
```

Example request:

```json
{
  "name": "mouse",
  "price": 500,
  "stock": 34
}
```

### Inventory

```http
POST /api/inventory/update
```

Example request:

```json
{
  "command": "Increase mobile stock by 5"
}
```

### Sales

```http
GET /api/sales
POST /api/sales
```

Example request:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

### Insights

```http
GET /api/insights
```

## How the AI Flow Works

### Product creation
1. User enters product name, price, and stock.
2. Backend requests AI-generated metadata.
3. If the AI provider is slow or unavailable, fallback logic still fills category, GST, HSN, and tags.
4. Product is saved to MongoDB.
5. Frontend refreshes and shows the product in the catalog.

### Inventory command
1. User submits a text command.
2. Backend parses action, product, and quantity.
3. Stock is updated in MongoDB.
4. Inventory log is stored.
5. Frontend refreshes live inventory data.

### Sales and insights
1. A sale is recorded through the sales form.
2. Stock decreases automatically.
3. Sale is stored in the sales collection.
4. Insights calculate top sellers, trends, and product performance from sales data.

## Example Inventory Commands

```text
Increase mobile stock by 5
Decrease Laptop inventory from 60 to 50
Set iphone inventory to 25
```

## Notes

- GST and HSN are stored in the product record.
- Duplicate product names are blocked by backend validation.
- Sales are stored separately from inventory corrections so business insights remain meaningful.
- If older database records were created before GST/HSN support, they may need a one-time backfill.

## Future Improvements

- Voice input support
- Authentication and user roles
- Charts for sales trends
- Better category / GST / HSN lookup from a dedicated tax dataset
- Export reports to PDF or Excel
