# 🍲 GreatFood

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.2-blue.svg)]()
[![Node](https://img.shields.io/badge/Node-16+-green.svg)]()

> A premium, hyper-local food discovery and C2C marketplace platform.

**GreatFood** is not just another food delivery app. It is a sophisticated ecosystem designed to bridge the gap between local food vendors and discerning customers through advanced location services, real-time engagement, and data-driven personalization.

---

## 🌟 Advanced Features

### 🛒 For Buyers
- 📍 **Precision Geo-Location**: Leverages Google Maps and reverse geocoding to suggest the most relevant nearby restaurants.
- 👅 **Taste Calibration System**: A unique Mean-Centering algorithm that adjusts food ratings based on individual user bias, ensuring more objective and personalized recommendations.
- 💬 **Direct Real-time Chat**: Connect directly with sellers via integrated Socket.io rooms for order inquiries and customizations.
- 🥘 **Recipe & Category Discovery**: Explore food by category or discover new recipes directly within the platform.
- 🎫 **Smart Offers**: Context-aware payment and restaurant-specific promotional offers.

### 🏢 For Sellers
- 📊 **Business Analytics Dashboard**: Track sales, performance metrics, and customer engagement in a centralized view.
- 📦 **Inventory & Stock Management**: Real-time control over food availability, pricing, and restaurant status (Open/Closed).
- 🏷️ **Dynamic Offer Management**: Create, update, and delete promotional campaigns on the fly.
- 📥 **Centralized Inbox**: Manage all customer interactions efficiently with read/unread tracking.
- 💳 **Subscription Model**: Tiered access for sellers to unlock premium marketplace features.

---

## 🛠️ Technology Stack & Architecture

### Frontend
- **Framework**: React 18 with Vite for ultra-fast development and optimized builds.
- **State & Context**: Context API for localized state management (Location, Auth).
- **Communication**: `socket.io-client` for persistent, low-latency bi-directional communication.
- **Styling**: Scoped CSS Modules for maintainable and collision-free UI design.

### Backend (Modular Architecture)
- **Runtime**: Node.js & Express.
- **Database**: MongoDB (NoSQL) for flexible data schema (Users, Restaurants, Orders, Chat).
- **Security**: JWT-based authentication with bcrypt hashing and OTP generation capabilities.
- **API Design**: Modular route structure with over 40 specialized endpoints for high scalability.
- **Real-time Engine**: Integrated Socket.io for notifications and chat orchestration.

---

## 📂 Project Structure

```text
├── Backend/                 # Express API & MongoDB Logic
│   ├── src/
│   │   ├── routes/          # Modular API endpoint definitions
│   │   ├── db/              # Database schemas and seeders
│   │   └── chatHandler.js   # Socket.io orchestration
├── frontend_map_my_food/    # React SPA
│   ├── src/
│   │   ├── components/      # Atomic UI components & Dashboards
│   │   ├── utils/           # Taste calibration & helper logic
│   │   └── hooks/           # Custom React hooks (Location, Auth)
```

---

## 🚀 Getting Started

### Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-repo/GreatFood.git
   ```

2. **Backend Setup**:
   ```bash
   cd Backend
   npm install
   # Configure your .env with MONGO_URI, JWT_SECRET, and PORT
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend_map_my_food
   npm install
   npm run dev
   ```

---

## 📄 License

Distributed under the ISC License.

---

Developed with ❤️ for the **GreatFood (Đồ án TMDT)** project.
