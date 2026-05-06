# ÉLÉVATION Backend

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
   - Copy `.env` file
   - Update `MONGODB_URI` if using MongoDB Atlas

3. Run the server:
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id` | Update order |
| GET | `/api/users` | List users |
| GET | `/api/banners` | List banners |
| GET | `/api/stories` | List stories |
| GET | `/api/coupons` | List coupons |
| POST | `/api/coupons/validate` | Validate coupon |
| GET | `/api/reviews` | List reviews |

## Default Port
- Server: `http://localhost:5000`
- Health check: `/api/health`