import React from "react";
import classes from "./GoogleMapsLink.module.css";

/**
 * GoogleMapsLink – Click để mở Google Maps tại vị trí chỉ định.
 * Ưu tiên lat/lng (chính xác), fallback sang address (tên).
 *
 * Props:
 *   lat, lng   – toạ độ GPS (number, optional)
 *   address    – tên địa chỉ fallback (string, optional)
 *   children   – nội dung hiển thị bên trong link
 *   className  – class CSS bổ sung (optional)
 *   showIcon   – hiện icon 🗺️ (default: true)
 */
const GoogleMapsLink = ({ lat, lng, address, children, className, showIcon = true }) => {
  // Không có đủ data → render children bình thường, không link
  if (!lat && !lng && !address) {
    return <span className={className}>{children}</span>;
  }

  let url;
  if (lat && lng) {
    url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  } else if (address) {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  const handleClick = (e) => {
    e.stopPropagation(); // Ngăn click propagate lên parent (VD: card navigate)
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes.link} ${className || ""}`}
      onClick={handleClick}
      title="Mở trên Google Maps"
    >
      {children}
      {showIcon && <span className={classes.icon}>🗺️</span>}
    </a>
  );
};

export default GoogleMapsLink;
