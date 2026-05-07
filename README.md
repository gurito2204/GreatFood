# 🍴 Map-My-Food

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()
[![React](https://img.shields.io/badge/React-18.2-blue.svg)]()
[![Node](https://img.shields.io/badge/Node-16+-green.svg)]()

> A modern, location-based food marketplace connecting hungry users with the best local flavors.

Map-My-Food is a comprehensive C2C platform that simplifies how users discover and order food. Built with a focus on real-time interaction and location precision, it offers a seamless experience for both buyers and sellers.

---

## ✨ Key Features

- 📍 **Smart Location Services**: Real-time GPS tracking and address matching to find the nearest restaurants.
- 🛍️ **Comprehensive Marketplace**: Browse diverse food categories, view detailed menus, and manage carts effortlessly.
- 💬 **Real-time Chat**: Integrated communication between buyers and sellers using Socket.io.
- 🔐 **Secure Authentication**: Robust user and seller management with JWT-based security.
- 📊 **Seller Dashboard**: Advanced tools for sellers to manage inventory, track orders, and analyze performance.
- 🔔 **Instant Notifications**: Stay updated with order status changes and new messages.
- 💳 **Seamless Payments**: Integrated payment processing for a smooth checkout experience.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM 6
- **Styling**: CSS Modules
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **Security**: JWT (jsonwebtoken), bcryptjs
- **File Handling**: express-fileupload
- **Real-time**: Socket.io

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB account (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/Map-My-Food.git
   cd Map-My-Food
   ```

2. **Setup Backend**:
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=8080
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend_map_my_food
   npm install
   npm run dev
   ```

---

## 📸 Preview

*Images and walkthroughs of the application can be found in the documentation folder.*

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

Developed with ❤️ for the **Đồ án TMDT** project.
