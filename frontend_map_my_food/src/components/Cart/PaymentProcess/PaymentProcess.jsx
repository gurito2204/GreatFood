import React, { useState, useContext } from "react";
import classes from "./PaymentProcess.module.css";
import CartContext from "../../store/cart/Cart-context";
import useUserOrder from "../../hook/useUserOrder";
import { useNotification } from "../../hook/useNotification";
import { formatPrice } from "../../../utils/formatPrice";

const PaymentProcess = () => {
  const cartContextCtx = useContext(CartContext);
  const { userOrderData } = useUserOrder();
  const { NotificationHandler } = useNotification();
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartItems = cartContextCtx.addItems;
  const totalAmount = cartContextCtx.totalAmount.toFixed(2);
  const deliveryCost = cartContextCtx.deliveryCost.toFixed(2);
  const GST = cartContextCtx.GST.toFixed(2);
  const address = cartContextCtx.deliverHere;
  const totalToPay = (+totalAmount + +deliveryCost + +GST);

  const orderNow = async () => {
    if (ordering) return; // Chặn double-click

    if (!window.confirm(
      `Xác nhận đặt hàng?\n\nTổng thanh toán: ${formatPrice(totalToPay)}\nĐịa chỉ: ${address}\n\nPhương thức: Thanh toán khi nhận hàng (COD)`
    )) return;

    setOrdering(true);
    try {
      const response = await userOrderData(
        cartItems,
        totalAmount,
        deliveryCost,
        GST,
        address
      );
      if (response) {
        setOrderSuccess(true);
        cartContextCtx.onClearCart();
      }
    } catch (err) {
      NotificationHandler("Đặt hàng thất bại!", "Error");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className={classes.box}>
      <h1>Thanh toán</h1>
      <div className={classes.location}>
        <img src="/greatfood/Logo/logo_2022.png" alt="" />
      </div>
      {address && <h1>Địa chỉ: {address}</h1>}

      {orderSuccess ? (
        <div className={classes.successMsg}>
          <span style={{ fontSize: "2rem" }}>🎉</span>
          <p>Đặt hàng thành công! Đơn hàng đang chờ xác nhận từ người bán.</p>
        </div>
      ) : (
        <div className={classes.buttons}>
          {address && cartItems.length > 0 && (
            <div
              className={`${classes.button} ${ordering ? classes.buttonDisabled : ""}`}
              onClick={orderNow}
            >
              {ordering ? "ĐANG ĐẶT..." : `ĐẶT HÀNG – ${formatPrice(totalToPay)}`}
            </div>
          )}
          <div className={classes.codNote}>
            💵 Thanh toán khi nhận hàng (COD)
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcess;
