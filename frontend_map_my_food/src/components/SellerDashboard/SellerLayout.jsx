import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { api } from "../../services/api";
import classes from "./SellerLayout.module.css";

const NAV_ITEMS = [
  { path: "/seller/dashboard", icon: "📊", label: "Thống Kê" },
  { path: "/seller/orders",    icon: "📋", label: "Đơn Hàng",   badgeKey: "pendingOrders" },
  { path: "/seller/inventory", icon: "📦", label: "Kho Hàng" },
  { path: "/seller/inbox",     icon: "💬", label: "Tin Nhắn",    badgeKey: "unreadMessages" },
  { divider: true },
  { path: "/seller/settings",  icon: "⚙️", label: "Quản Lý Quán" },
  { path: "/seller/subscription", icon: "⭐", label: "Nâng Cấp" },
];

const SellerLayout = ({ children }) => {
  const location = useLocation();
  const { fetchRestaurantId } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const [badges, setBadges] = useState({});

  useEffect(() => {
    if (!restaurantId) return;

    // Fetch pending orders count
    api.get(`/api/seller/orders/${restaurantId}`)
      .then(data => {
        const pending = (data.orders || []).filter(o => (o.status || "pending") === "pending").length;
        setBadges(prev => ({ ...prev, pendingOrders: pending }));
      })
      .catch(() => {});

    // Fetch unread messages count
    api.get(`/api/seller/inbox/${restaurantId}`)
      .then(data => {
        setBadges(prev => ({ ...prev, unreadMessages: data.totalUnread || 0 }));
      })
      .catch(() => {});
  }, [restaurantId, location.pathname]);

  return (
    <div className={classes.layoutContainer}>
      <nav className={classes.sidebar}>
        <div className={classes.sidebarTitle}>Kênh Người Bán</div>
        {NAV_ITEMS.map((item, idx) => {
          if (item.divider) {
            return <div key={idx} className={classes.sidebarDivider} />;
          }

          const isActive = location.pathname === item.path;
          const badgeCount = item.badgeKey ? (badges[item.badgeKey] || 0) : 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${classes.navItem} ${isActive ? classes.navItemActive : ""}`}
            >
              <span className={classes.navIcon}>{item.icon}</span>
              <span className={classes.navLabel}>{item.label}</span>
              {badgeCount > 0 && (
                <span className={classes.navBadge}>{badgeCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

export default SellerLayout;
