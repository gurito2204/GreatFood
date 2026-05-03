import React from "react";
import classes from "./SellerSubscription.module.css";
import { Link } from "react-router-dom";
import { useNotification } from "../hook/useNotification";

const SellerSubscription = () => {
  const { NotificationHandler } = useNotification();
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Nâng Cấp Gian Hàng</h1>
      <p className={classes.subtitle}>Chọn gói phù hợp để tăng doanh số bán hàng của bạn!</p>
      
      <div className={classes.pricingCards}>
        {/* BASIC TIER */}
        <div className={classes.card}>
          <h2 className={classes.tierName}>BASIC</h2>
          <div className={classes.price}>Miễn Phí</div>
          <ul className={classes.features}>
            <li>✔️ Hiển thị gian hàng trên hệ thống</li>
            <li>✔️ Nhận đơn đặt hàng</li>
            <li>✔️ Chat trực tiếp với khách</li>
            <li className={classes.disabled}>❌ Không có huy hiệu Premium</li>
            <li className={classes.disabled}>❌ Hiển thị ở vị trí thấp</li>
          </ul>
          <button className={classes.currentBtn}>Đang sử dụng</button>
        </div>

        {/* PREMIUM TIER */}
        <div className={`${classes.card} ${classes.premiumCard}`}>
          <div className={classes.popularTag}>ĐỀ XUẤT</div>
          <h2 className={classes.tierName}>PREMIUM 👑</h2>
          <div className={classes.price}>150.000 VNĐ<span>/tháng</span></div>
          <ul className={classes.features}>
            <li>✔️ Hiển thị gian hàng trên hệ thống</li>
            <li>✔️ Nhận đơn đặt hàng</li>
            <li>✔️ Chat trực tiếp với khách</li>
            <li>✔️ <b>Huy hiệu Premium 👑 nổi bật</b></li>
            <li>✔️ <b>Ưu tiên hiển thị trên cùng</b></li>
          </ul>
          <button className={classes.upgradeBtn} onClick={() => NotificationHandler("Tính năng thanh toán sẽ ra mắt sớm!", "Info")}>
            Nâng cấp ngay
          </button>
        </div>
      </div>
      
      <div className={classes.backLink}>
        <Link to="/seller/dashboard">← Quay lại Dashboard</Link>
      </div>
    </div>
  );
};

export default SellerSubscription;
