import React, { useEffect, useState } from "react";
import classes from "./Payments.module.css";
import usegetUserOrder from "../../hook/usegetUserOrder";
import { formatPrice } from "../../../utils/formatPrice";

const Payments = () => {
  const { userOrderData } = usegetUserOrder();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await userOrderData();
      if (Array.isArray(response) && response.length > 0) {
        setPayments(response);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className={classes.container}>
      <h1 style={{ marginBottom: "20px" }}>Lịch sử thanh toán</h1>
      {payments.length === 0 ? (
        <p>Bạn chưa có giao dịch nào.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {payments.map((paymentItem, idx) => {
            const payment = paymentItem.order || paymentItem;
            const total = (+payment.GST || 0) + (+payment.totalAmount || 0) + (+payment.deliveryCost || 0);
            return (
              <div key={idx} style={{ padding: "15px", border: "1px solid #eee", borderRadius: "8px", background: "#f9f9f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <strong>Giao dịch #{idx + 1}</strong>
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>Thành công</span>
                </div>
                <p style={{ margin: "5px 0" }}>Ngày: {new Date(payment.createdAt || Date.now()).toLocaleDateString("vi-VN")}</p>
                <p style={{ margin: "5px 0" }}>Tổng tiền: <span style={{ color: "#fc8019", fontWeight: "bold" }}>{formatPrice(total)}</span></p>
                <p style={{ margin: "5px 0", fontSize: "0.9em", color: "#666" }}>Phương thức: Thanh toán khi nhận hàng (COD)</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Payments;
