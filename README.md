# 👋 Hi, I'm Mukesh Rawat
🚀 Full Stack Developer | MERN | Next.js | TypeScript  
💼 7+ years experience building scalable web platforms

### 🔧 Skills
React • Node.js • Express • MongoDB • Next.js • Redux • TypeScript • Docker • GraphQL • Nestjs • Postgresql     


# AI Resume Builder

!Resume Builder UI <!-- Replace with a screenshot of your application -->

A full-stack application designed to help users create professional resumes effortlessly with the power of AI. This project features a Next.js frontend and a Node.js/Express backend, integrated with OpenAI for content generation and Stripe for payment processing.

## ✨ Key Features

*   **AI-Powered Content**: Automatically generate professional summaries for your resume using OpenAI's GPT models.
*   **Dynamic Resume Management**: Full CRUD functionality to create, read, update, and delete resumes.
*   **Modern UI/UX**: A sleek, responsive interface built with Next.js and Tailwind CSS.
*   **Customizable Templates**: Choose from multiple modern resume templates.
*   **PDF Generation**: Download your resume as a high-quality PDF.
*   **User Authentication**: Secure user sign-up and login with JWT-based authentication (access and refresh tokens).
*   **Subscription Plans**: A multi-tiered pricing page (Free, Basic, Pro) with different resume limits.
*   **Stripe Integration**: Seamless and secure payment processing for plan upgrades.
*   **User Dashboard**: Visualize credit usage and other stats with interactive charts.
*   **API Documentation**: Interactive API documentation powered by Swagger.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js
*   **Styling**: Tailwind CSS
*   **State Management**: React Hooks
*   **Forms**: React Hook Form & Yup
*   **API Client**: Axios
*   **Authentication**: NextAuth.js
*   **UI Components**: Lucide React (icons), Chart.js (charts), React Toastify (notifications)

### Backend
*   **Framework**: Express.js
*   **Database**: MongoDB with Mongoose
*   **Authentication**: JSON Web Token (JWT)
*   **AI Integration**: OpenAI SDK
*   **Payments**: Stripe
*   **PDF Generation**: Puppeteer
*   **API Documentation**: Swagger UI Express

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
*   Node.js (v18 or later)
*   npm or yarn
*   MongoDB instance (local or cloud)

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd resumebuilder-backend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_super_secret_access_token
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token
REFRESH_TOKEN_EXPIRY=10d

OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Finally, run the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd resumebuilder-frontend

# Install dependencies
npm install

# Create a .env.local file from the example
cp .env.local.example .env.local
```

Update the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_very_strong_secret_for_nextauth

NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=your_stripe_basic_price_id
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
```

Run the frontend development server:
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## 📖 API Documentation

Once the backend server is running, you can access the interactive API documentation at:
http://localhost:8000/api-docs

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

