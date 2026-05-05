import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import classes from "./SellerDashboard.module.css";
import { api } from "../../services/api";

const SellerDashboard = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        // Fetch analytics
        const analytics = await api.get(`/api/seller/analytics/${restaurantId}`);
        setData(analytics);

        // Fetch restaurant info for isOpen
        const restaurant = await api.get(`/restaurant/${restaurantId}`);
        setIsOpen(restaurant?.isOpen !== undefined ? restaurant.isOpen : true);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [restaurantId]);

  const handleToggleOpen = async () => {
    setToggling(true);
    try {
      const newState = !isOpen;
      await api.put(`/api/seller/restaurant/${restaurantId}/toggle-open`, { isOpen: newState });
      setIsOpen(newState);
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className={classes.loading}>Đang tải thống kê...</div>;

  if (!restaurantId) {
    return (
      <div className={classes.noRestaurant}>
        Bạn chưa đăng ký nhà hàng nào. Vui lòng đăng ký bán hàng trước!
      </div>
    );
  }

  const tastes = data?.averageTaste || { salty: 0, sweet: 0, sour: 0, bitter: 0, spicy: 0 };
  
  // Helper to render simple CSS progress bar
  const renderBar = (label, value) => {
    // Value is 0-10
    const percentage = Math.min((value / 10) * 100, 100);
    return (
      <div className={classes.barContainer}>
        <div className={classes.barLabel}>
          <span>{label}</span>
          <span>{value} / 10</span>
        </div>
        <div className={classes.barTrack}>
          <div className={classes.barFill} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.dashboardContainer}>
      {/* Header with toggle */}
      <div className={classes.headerRow}>
        <h1 className={classes.title}>Thống Kê Gian Hàng</h1>
        <div className={classes.headerActions}>
          {/* Toggle Open/Close */}
          <div className={classes.toggleContainer}>
            <span className={classes.toggleLabel}>
              {isOpen ? "🟢 Đang mở" : "🔴 Đã đóng"}
            </span>
            <button
              className={`${classes.toggleSwitch} ${isOpen ? classes.toggleOn : classes.toggleOff}`}
              onClick={handleToggleOpen}
              disabled={toggling}
            >
              <span className={classes.toggleKnob}></span>
            </button>
          </div>
          <Link to="/seller/subscription" className={classes.premiumBtn}>
            ⭐ Nâng Cấp Premium
          </Link>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className={classes.statsRow}>
        <div className={classes.statCard}>
          <div className={classes.statValue}>
            {(data?.totalRevenue || 0).toLocaleString("vi-VN")}₫
          </div>
          <div className={classes.statLabel}>Tổng doanh thu</div>
        </div>
        <div className={classes.statCard}>
          <div className={classes.statValue}>{data?.completedOrders || 0}</div>
          <div className={classes.statLabel}>Đơn hoàn thành</div>
        </div>
        <div className={`${classes.statCard} ${(data?.pendingOrders || 0) > 0 ? classes.statCardPending : ""}`}>
          <div className={classes.statValue}>{data?.pendingOrders || 0}</div>
          <div className={classes.statLabel}>Đơn chờ xử lý</div>
          {(data?.pendingOrders || 0) > 0 && (
            <Link to="/seller/orders" className={classes.statAction}>Xem ngay →</Link>
          )}
        </div>
        <div className={classes.statCard}>
          <div className={classes.statValue}>
            {(data?.todayRevenue || 0).toLocaleString("vi-VN")}₫
          </div>
          <div className={classes.statLabel}>Doanh thu hôm nay</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className={classes.statsRow}>
        <div className={classes.statCard}>
          <div className={classes.statValue}>{data?.todayOrders || 0}</div>
          <div className={classes.statLabel}>Đơn hôm nay</div>
        </div>
        <div className={classes.statCard}>
          <div className={classes.statValue}>{data?.totalOrders || 0}</div>
          <div className={classes.statLabel}>Tổng số đơn</div>
        </div>
        <div className={classes.statCard}>
          <div className={classes.statValue}>{data?.views || 0}</div>
          <div className={classes.statLabel}>Lượt tương tác</div>
        </div>
        <div className={classes.statCard}>
          <div className={classes.statValue}>{data?.totalRatings || 0}</div>
          <div className={classes.statLabel}>Tổng lượt đánh giá</div>
        </div>
      </div>

      <div className={classes.chartSection}>
        <h2>Khẩu vị Trung Bình Của Thực Khách</h2>
        <p className={classes.chartDesc}>Dựa trên {data?.totalRatings || 0} đánh giá gần nhất</p>
        
        <div className={classes.barsWrapper}>
          {renderBar("Mặn", tastes.salty)}
          {renderBar("Ngọt", tastes.sweet)}
          {renderBar("Chua", tastes.sour)}
          {renderBar("Đắng", tastes.bitter)}
          {renderBar("Cay", tastes.spicy)}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
