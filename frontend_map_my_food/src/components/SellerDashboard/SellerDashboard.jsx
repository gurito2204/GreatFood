import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import classes from "./SellerDashboard.module.css";

const SellerDashboard = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/seller/analytics/${restaurantId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [restaurantId]);

  if (loading) return <div className={classes.loading}>Đang tải thống kê...</div>;

  if (!restaurantId) {
    return (
      <div className={classes.noRestaurant}>
        Bạn chưa đăng ký nhà hàng nào. Vui lòng đăng ký bán hàng trước!
      </div>
    );
  }

  const tastes = data?.averageTaste || { salty: 0, sweet: 0, sour: 0, bitter: 0 };
  
  // Helper to render simple CSS progress bar
  const renderBar = (label, value) => {
    // Value is 0-5
    const percentage = (value / 5) * 100;
    return (
      <div className={classes.barContainer}>
        <div className={classes.barLabel}>
          <span>{label}</span>
          <span>{value} / 5</span>
        </div>
        <div className={classes.barTrack}>
          <div className={classes.barFill} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.dashboardContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className={classes.title} style={{ marginBottom: 0 }}>Thống Kê Gian Hàng</h1>
        <Link to="/seller/subscription" style={{ background: '#fc8019', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          ⭐ Nâng Cấp Premium
        </Link>
      </div>
      
      <div className={classes.statsRow}>
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
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
