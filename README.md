# AI Smart POS Assistant

An AI-powered Smart POS system built using Node.js, Express.js, MongoDB, React, and OpenAI/OpenRouter APIs.

This project simulates intelligent POS automation features that help businesses manage products, automate inventory operations, and generate AI-powered insights.

---

# Features

## Module 1 - AI Product Enhancement

- AI-generated product descriptions
- Smart product detail enhancement
- Marketing content generation
- Product management APIs

---

## Module 2 - AI Inventory Automation

- Low stock detection
- Smart inventory alerts
- AI-based restocking suggestions
- Inventory analysis automation

---

# Future Scope

- AI sales prediction
- Business analytics dashboard
- Voice-enabled POS assistant
- Customer recommendation engine
- AI chatbot integration

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- OpenRouter API / OpenAI API

---

## Frontend

- React.js
- Vite
- Axios
- CSS

---

# Project Structure

```bash
SMART-POS/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   └── inventoryController.js
│   │
│   ├── models/
│   │   └── Product.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── inventoryRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── aitest.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── src/
│   ├── public/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <your-github-repository-link>
```

---

## Open Project

```bash
cd SMART-POS
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Create .env File

Add the following environment variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## Run Backend Server

```bash
npm run dev
```

Backend server runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Routes

## Product APIs

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/products | Add Product |
| GET | /api/products | Get All Products |

---

## Inventory APIs

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/inventory/low-stock | Get Low Stock Products |
| GET | /api/inventory/ai-suggestions | Get AI Inventory Suggestions |

---

# Example Product JSON

```json
{
  "name": "Chocolate Cake",
  "price": 250,
  "stock": 5,
  "category": "Bakery"
}
```

---

# AI Workflow

1. User adds product information
2. Backend stores product data in MongoDB
3. AI service analyzes product and inventory data
4. OpenRouter/OpenAI API generates:
   - Product descriptions
   - Inventory insights
   - Restocking recommendations
5. Backend returns AI-generated responses to frontend

---

# AI Features

- AI-powered product descriptions
- Smart inventory management
- Automated inventory insights
- AI-based restocking suggestions
- Business automation simulation

---

# Database

MongoDB Atlas is used as the cloud database for storing:

- Product information
- Inventory details
- AI-generated data

---

# Testing APIs

You can test APIs using:

- Postman
- Thunder Client
- Hoppscotch

---

# Screenshots

## API Testing

Add your API screenshots inside:

```bash
screenshots/
```

Example:

```md
![API](screenshots/api.png)
```

---

## MongoDB Database

```md
![MongoDB](screenshots/mongodb.png)
```

---

# Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend server port |
| MONGO_URI | MongoDB Atlas connection string |
| OPENROUTER_API_KEY | OpenRouter/OpenAI API key |

---

# .gitignore

## Backend

```gitignore
node_modules
.env
```

---

## Frontend

```gitignore
node_modules
dist
```

---

# Author

Gunjan Duggal

---

# License

This project is created for educational and internship assessment purposes.

---

# Project Objective

The objective of this project is to simulate an AI-powered Smart POS platform capable of:

- Automating product management
- Enhancing inventory operations
- Generating intelligent business insights
- Demonstrating practical AI integration in retail systems

---

# Conclusion

AI Smart POS Assistant demonstrates the integration of artificial intelligence with modern web technologies to create a smart retail management system. The project showcases backend API development, frontend integration, MongoDB database operations, and AI-powered automation features.
