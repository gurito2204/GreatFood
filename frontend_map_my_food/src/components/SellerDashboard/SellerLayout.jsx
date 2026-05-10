import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { api } from "../../services/api";
import classes from "./SellerLayout.module.css";
import DashboardIcon from "@atlaskit/icon/core/dashboard";
import ListIcon from "@atlaskit/icon/core/list-bulleted";
import PakkageIcon from "@atlaskit/icon/core/takeout-food";
import CommentIcon from "@atlaskit/icon/core/comment";
import SettingsIcon from "@atlaskit/icon/core/settings";
import StarIcon from "@atlaskit/icon/core/star-starred";

const NAV_ITEMS = [
  { path: "/seller/dashboard", icon: <DashboardIcon label="Stats" />, label: "Thống Kê" },
  { path: "/seller/orders",    icon: <ListIcon label="Orders" />, label: "Đơn Hàng",   badgeKey: "pendingOrders" },
  { path: "/seller/inventory", icon: <PakkageIcon label="Inventory" />, label: "Kho Hàng" },
  { path: "/seller/inbox",     icon: <CommentIcon label="Messages" />, label: "Tin Nhắn",    badgeKey: "unreadMessages" },
  { divider: true },
  { path: "/seller/settings",  icon: <SettingsIcon label="Manage" />, label: "Quản Lý Quán" },
  { path: "/seller/subscription", icon: <StarIcon label="Upgrade" />, label: "Nâng Cấp" },
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
