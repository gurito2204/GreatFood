import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { useNotification } from "../hook/useNotification";
import GoogleMapsLink from "../ui/GoogleMapsLink/GoogleMapsLink";
import { api } from "../../services/api";
import { io } from "socket.io-client";
import classes from "./SellerOrders.module.css";

const STATUS_CONFIG = {
  pending:   { label: "Chờ xác nhận", color: "#ff9800", icon: "⏳" },
  confirmed: { label: "Đã xác nhận", color: "#2196f3", icon: "✅" },
  completed: { label: "Hoàn thành",  color: "#4caf50", icon: "🎉" },
  cancelled: { label: "Đã hủy",      color: "#f44336", icon: "❌" },
};

const TABS = [
  { key: "all",       label: "Tất cả" },
  { key: "pending",   label: "⏳ Chờ xác nhận" },
  { key: "confirmed", label: "✅ Đã xác nhận" },
  { key: "completed", label: "🎉 Hoàn thành" },
  { key: "cancelled", label: "❌ Đã hủy" },
];

const SellerOrders = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const restaurantId = fetchRestaurantId();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [updating, setUpdating] = useState({});
  const socketRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) return;
    try {
      const data = await api.get(`/api/seller/orders/${restaurantId}`);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();

    // Setup socket for real-time new order notifications
    socketRef.current = io(import.meta.env.VITE_REACT_BACKEND_URL);
    
    if (restaurantId) {
      socketRef.current.emit("join_seller_room", restaurantId);

      socketRef.current.on("new_order", (data) => {
        NotificationHandler("🔔 Có đơn hàng mới!", "Success");
        fetchOrders(); // Refresh list immediately
      });
    }

    // Keep polling as fallback (every 30s)
    const interval = setInterval(fetchOrders, 30000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [fetchOrders, restaurantId]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await api.put(`/api/seller/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const filtered = activeTab === "all"
    ? orders
    : orders.filter(o => (o.status || "pending") === activeTab);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;
    return d.toLocaleDateString("vi-VN");
  };

  if (loading) return <div className={classes.loading}>Đang tải đơn hàng...</div>;
  if (!restaurantId) return <div className={classes.loading}>Bạn chưa đăng ký gian hàng nào!</div>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>📋 Đơn Hàng Của Tôi</h1>

      {/* Tabs */}
      <div className={classes.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${classes.tab} ${activeTab === tab.key ? classes.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className={classes.tabCount}>
                {orders.filter(o => (o.status || "pending") === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className={classes.empty}>
          <div className={classes.emptyIcon}>📭</div>
          <p>Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className={classes.ordersList}>
          {filtered.map((order) => {
            const status = order.status || "pending";
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const items = order.order || [];
            const total = (+order.totalAmount || 0) + (+order.deliveryCost || 0) + (+order.GST || 0);

            return (
              <div className={classes.orderCard} key={order.orderId}>
                {/* Header */}
                <div className={classes.orderHeader}>
                  <div className={classes.orderId}>
                    Đơn #{(order.orderId || "").substring(0, 8)}
                  </div>
                  <div className={classes.orderStatus} style={{ background: config.color }}>
                    {config.icon} {config.label}
                  </div>
                  <div className={classes.orderTime}>{formatTime(order.createdAt)}</div>
                </div>

                {/* Address */}
                {order.address && (
                  <div className={classes.orderAddress}>
                    <GoogleMapsLink address={order.address}>
                      📍 {order.address}
                    </GoogleMapsLink>
                  </div>
                )}

                {/* Items */}
                <div className={classes.itemsList}>
                  {items.map((item, idx) => (
                    <div className={classes.itemRow} key={idx}>
                      <span className={classes.itemQty}>{item.quantity || 1}x</span>
                      <span className={classes.itemName}>
                        {item.items?.name || item.name || `Món ${idx + 1}`}
                      </span>
                      <span className={classes.itemPrice}>
                        {(+item.items?.price || 0).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className={classes.orderTotal}>
                  <span>Tổng cộng:</span>
                  <span className={classes.totalAmount}>
                    {total.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                {/* Actions */}
                <div className={classes.actions}>
                  {status === "pending" && (
                    <>
                      <button
                        className={classes.btnConfirm}
                        onClick={() => updateStatus(order.orderId, "confirmed")}
                        disabled={updating[order.orderId]}
                      >
                        {updating[order.orderId] ? "..." : "✅ Xác nhận"}
                      </button>
                      <button
                        className={classes.btnCancel}
                        onClick={() => updateStatus(order.orderId, "cancelled")}
                        disabled={updating[order.orderId]}
                      >
                        {updating[order.orderId] ? "..." : "❌ Từ chối"}
                      </button>
                    </>
                  )}
                  {status === "confirmed" && (
                    <>
                      <button
                        className={classes.btnComplete}
                        onClick={() => updateStatus(order.orderId, "completed")}
                        disabled={updating[order.orderId]}
                      >
                        {updating[order.orderId] ? "..." : "🎉 Hoàn thành"}
                      </button>
                      <button
                        className={classes.btnCancel}
                        onClick={() => updateStatus(order.orderId, "cancelled")}
                        disabled={updating[order.orderId]}
                      >
                        {updating[order.orderId] ? "..." : "❌ Hủy"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
