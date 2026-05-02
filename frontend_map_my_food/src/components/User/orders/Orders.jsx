import React, { useEffect, useState } from "react";
import classes from "./Orders.module.css";
import usegetUserOrder from "../../hook/usegetUserOrder";
import TasteRatingModal from "../../TasteRatingModal/TasteRatingModal";

const Orders = () => {
  const { userOrderData } = usegetUserOrder();
  const [orders, setOrders] = useState([]);
  const [ratingItem, setRatingItem] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await userOrderData();
      if (Array.isArray(response) && response.length > 0) {
        setOrders(response);
      }
    };
    fetchOrders();
  }, []);

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
            const order = orderItem.order || orderItem;
            const items = order.order || [];
            return (
              <div className={classes.order} key={idx}>
                <div className={classes.orderHeader}>
                  <span className={classes.orderIndex}>Đơn #{idx + 1}</span>
                  <span className={classes.orderStatus}>
                    {order.status || "pending"}
                  </span>
                </div>
                <p>Địa chỉ: {order.address || "—"}</p>
                <h2>
                  Tổng: {(
                    (+order.GST || 0) + (+order.totalAmount || 0) + (+order.deliveryCost || 0)
                  ).toLocaleString("vi-VN")}₫
                </h2>
                <p>Số món: {items.length}</p>

                {/* List items with rate button */}
                {items.length > 0 && (
                  <div className={classes.itemsList}>
                    {items.map((item, itemIdx) => (
                      <div className={classes.orderItem} key={itemIdx}>
                        <span>{item.items?.name || item.name || `Món ${itemIdx + 1}`}</span>
                        <button
                          className={classes.rateBtn}
                          onClick={() => setRatingItem({
                            itemId: item.itemId,
                            name: item.items?.name || item.name || "Món ăn",
                          })}
                        >
                          ⭐ Đánh giá
                        </button>
                      </div>
                    ))}
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
