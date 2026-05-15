import React, { useEffect, useState, useRef } from "react";
import classes from "./Orders.module.css";
import usegetUserOrder from "../../hook/usegetUserOrder";
import TasteRatingModal from "../../TasteRatingModal/TasteRatingModal";
import { formatPrice } from "../../../utils/formatPrice";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";
import { useNotification } from "../../hook/useNotification";
import { api } from "../../../services/api";
import { io } from "socket.io-client";

const STATUS_CONFIG = {
  pending:   { label: "Chờ xác nhận", color: "#ff9800", icon: "⏳" },
  confirmed: { label: "Đã xác nhận", color: "#2196f3", icon: "✅" },
  completed: { label: "Hoàn thành",  color: "#4caf50", icon: "🎉" },
  cancelled: { label: "Đã hủy",      color: "#f44336", icon: "❌" },
};

const Orders = () => {
  const { userOrderData } = usegetUserOrder();
  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const [orders, setOrders] = useState([]);
  const [ratingItem, setRatingItem] = useState(null);
  const [cancelling, setCancelling] = useState({});
  const socketRef = useRef(null);

  const fetchOrders = async () => {
    const response = await userOrderData();
    if (Array.isArray(response) && response.length > 0) {
      setOrders(response);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Socket: lắng nghe khi seller đổi trạng thái đơn
    const details = fetchPersonalDetails();
    if (details && details.data && details.data.id) {
      const userId = details.data.id;
      socketRef.current = io(import.meta.env.VITE_REACT_BACKEND_URL);
      socketRef.current.emit("join_room", `buyer_${userId}`);

      socketRef.current.on("order_status_changed", (data) => {
        const config = STATUS_CONFIG[data.newStatus] || {};
        NotificationHandler(
          `${config.icon || "📦"} Đơn #${(data.orderId || "").substring(0, 8)} → ${config.label || data.newStatus}`,
          data.newStatus === "cancelled" ? "Warn" : "Success"
        );
        fetchOrders(); // Refresh danh sách
      });
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    const details = fetchPersonalDetails();
    if (!details || !details.data) return;

    setCancelling(prev => ({ ...prev, [orderId]: true }));
    try {
      const data = await api.put(`/api/buyer/orders/${orderId}/cancel`, {
        userId: details.data.id,
      });
      NotificationHandler(data.message || "Đã hủy đơn hàng", "Info");
      fetchOrders();
    } catch (err) {
      NotificationHandler("Hủy đơn thất bại", "Error");
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleComplete = async (orderId) => {
    if (!window.confirm("Xác nhận bạn đã nhận được hàng?")) return;

    const details = fetchPersonalDetails();
    if (!details || !details.data) return;

    setCancelling(prev => ({ ...prev, [orderId]: true }));
    try {
      const data = await api.put(`/api/buyer/orders/${orderId}/complete`, {
        userId: details.data.id,
      });
      NotificationHandler(data.message || "Đã xác nhận thành công", "Success");
      fetchOrders();
    } catch (err) {
      NotificationHandler(err.response?.data?.message || "Xác nhận thất bại", "Error");
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className={classes.container}>
      {orders.length === 0 ? (
        <>
          <img src="/greatfood/User/empty-orders.png" alt="" />
          <h1>Chưa có đơn hàng</h1>
          <p>Bạn chưa đặt đơn hàng nào.</p>
        </>
      ) : (
        <div className={classes.orders}>
          {orders.map((orderItem, idx) => {
            const order = orderItem;
            const items = orderItem.order || [];
            const status = order.status || "pending";
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const total = (+order.totalAmount || 0) + (+order.deliveryCost || 0) + (+order.GST || 0);

            return (
              <div className={classes.order} key={order.orderId || idx}>
                {/* Header: index + status + time */}
                <div className={classes.orderHeader}>
                  <span className={classes.orderIndex}>
                    Đơn #{(order.orderId || "").substring(0, 8) || idx + 1}
                  </span>
                  <span
                    className={classes.orderStatus}
                    style={{ background: config.color }}
                  >
                    {config.icon} {config.label}
                  </span>
                </div>

                {/* Restaurant name + time */}
                <div className={classes.orderMeta}>
                  {order.restaurantName && (
                    <span className={classes.restaurantName}>🏪 {order.restaurantName}</span>
                  )}
                  {order.createdAt && (
                    <span className={classes.orderTime}>🕐 {formatTime(order.createdAt)}</span>
                  )}
                </div>

                <p>Địa chỉ: {order.address || "—"}</p>
                <h2>Tổng: {formatPrice(total)}</h2>

                {/* List items with rate button */}
                {items.length > 0 && (
                  <div className={classes.itemsList}>
                    {items.map((item, itemIdx) => (
                      <div className={classes.orderItem} key={itemIdx}>
                        <span>
                          {item.quantity ? `${item.quantity}x ` : ""}
                          {item.items?.name || item.name || `Món ${itemIdx + 1}`}
                        </span>
                        {status === "completed" && (
                          <button
                            className={classes.rateBtn}
                            onClick={() => setRatingItem({
                              itemId: item.itemId,
                              name: item.items?.name || item.name || "Món ăn",
                            })}
                          >
                            ⭐ Đánh giá
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cancel button – chỉ hiển thị khi pending */}
                {status === "pending" && (
                  <div className={classes.cancelRow}>
                    <button
                      className={classes.cancelBtn}
                      onClick={() => handleCancel(order.orderId)}
                      disabled={cancelling[order.orderId]}
                    >
                      {cancelling[order.orderId] ? "Đang xử lý..." : "❌ Hủy đơn"}
                    </button>
                  </div>
                )}
                
                {/* Complete button - khi confirmed */}
                {status === "confirmed" && (
                  <div className={classes.cancelRow}>
                    <button
                      className={classes.completeBtn || classes.cancelBtn}
                      style={{ background: "#4caf50" }}
                      onClick={() => handleComplete(order.orderId)}
                      disabled={cancelling[order.orderId]}
                    >
                      {cancelling[order.orderId] ? "Đang xử lý..." : "✅ Đã nhận được hàng"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Taste Rating Modal */}
      <TasteRatingModal
        isOpen={!!ratingItem}
        onClose={() => setRatingItem(null)}
        menuItem={ratingItem}
        onSubmit={(raw, cal) => console.log("Rating submitted:", { raw, cal })}
      />
    </div>
  );
};

export default Orders;
