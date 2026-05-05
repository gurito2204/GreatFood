import React, { useEffect, useState } from "react";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import { useNotification } from "../hook/useNotification";
import ShopLocationPicker from "../NewRestaurant/ShopLocationPicker/ShopLocationPicker";
import { api } from "../../services/api";
import classes from "./SellerSettings.module.css";

const SellerSettings = () => {
  const { fetchRestaurantId } = useLocationLocalStorage();
  const restaurantId = fetchRestaurantId();
  const { NotificationHandler } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    Restaurant: "",
    phone_number: "",
    address: "",
    location: "",
    pincode: "",
    Restaurant_dish: "",
    opening_hours: "",
    time: "",
    price: "",
    FreeDeliveryonOrderDistance: "",
    FreeDeliveryonOrderAbove: "",
  });
  const [image, setImage] = useState(null);

  const labelMapping = {
    Restaurant: "Tên quán / Tên người bán",
    phone_number: "Số điện thoại liên hệ",
    Restaurant_dish: "Chuyên món (VD: Cơm tấm, Trà sữa)",
    opening_hours: "Giờ hoạt động (VD: 08:00 - 22:00)",
    time: "Thời gian chuẩn bị dự kiến (Phút)",
    price: "Khoảng giá trung bình (VD: 20k - 50k)",
    FreeDeliveryonOrderDistance: "Freeship trong bán kính (Km)",
    FreeDeliveryonOrderAbove: "Freeship cho đơn hàng từ (VNĐ)",
  };

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await api.get(`/restaurant/${restaurantId}`);
        if (data) {
          setValues({
            Restaurant: data.Restaurant || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
            location: data.location || "",
            pincode: data.pincode || "",
            Restaurant_dish: data.Restaurant_dish || "",
            opening_hours: data.opening_hours || "",
            time: data.time || "",
            price: data.price || "",
            FreeDeliveryonOrderDistance: data.FreeDeliveryonOrderDistance || "",
            FreeDeliveryonOrderAbove: data.FreeDeliveryonOrderAbove || "",
          });
          setImage(data.image || null);
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restaurantId]);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleLocationChange = (locationData) => {
    setValues((prev) => ({
      ...prev,
      address: locationData.address || prev.address,
      location: locationData.location || prev.location,
      pincode: locationData.pincode || prev.pincode,
      ...(locationData.lat != null ? { lat: locationData.lat } : {}),
      ...(locationData.lng != null ? { lng: locationData.lng } : {}),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...values };
      // Use existing image path if no new image uploaded
      if (image) body.image = image;
      
      await api.put(`/api/seller/restaurant/${restaurantId}`, body);
      NotificationHandler("Cập nhật thông tin quán thành công!", "Success");
    } catch (err) {
      NotificationHandler("Cập nhật thất bại: " + (err.message || "Lỗi"), "Warn");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={classes.loading}>Đang tải thông tin quán...</div>;
  if (!restaurantId) return <div className={classes.loading}>Bạn chưa có gian hàng nào!</div>;

  // Fields to show in the form (exclude those handled by ShopLocationPicker)
  const editableFields = Object.entries(values).filter(
    ([key]) =>
      key !== "address" &&
      key !== "location" &&
      key !== "pincode" &&
      key !== "lat" &&
      key !== "lng" &&
      key !== "image"
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>⚙️ Quản Lý Thông Tin Quán</h1>
      <p className={classes.subtitle}>Chỉnh sửa thông tin quán của bạn</p>

      {/* Restaurant Image */}
      {image && (
        <div className={classes.imageSection}>
          <img
            src={`${import.meta.env.VITE_REACT_BACKEND_URL}${image}`}
            alt="Ảnh quán"
            className={classes.shopImage}
            onError={(e) => { e.target.onerror = null; e.target.src = image; }}
          />
          <p className={classes.imageHint}>Để thay ảnh, vào phần "Quản lý gian hàng" (/new-restaurant)</p>
        </div>
      )}

      {/* Location Picker */}
      <div className={classes.section}>
        <h3 className={classes.sectionTitle}>📍 Vị trí quán</h3>
        <div className={classes.currentAddress}>
          <strong>Địa chỉ hiện tại:</strong> {values.address || "Chưa có"}
          <br />
          <strong>Khu vực:</strong> {values.location || "Chưa có"} | <strong>Mã vùng:</strong> {values.pincode || "Chưa có"}
        </div>
        <ShopLocationPicker onChange={handleLocationChange} />
      </div>

      {/* Editable Fields */}
      <div className={classes.section}>
        <h3 className={classes.sectionTitle}>📝 Thông tin cơ bản</h3>
        <div className={classes.fieldsGrid}>
          {editableFields.map(([key, value]) => (
            <div key={key} className={classes.field}>
              <label className={classes.fieldLabel}>
                {labelMapping[key] || key}
              </label>
              <input
                type="text"
                value={value}
                onChange={handleChange(key)}
                className={classes.fieldInput}
                placeholder={labelMapping[key] || key}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className={classes.saveRow}>
        <button
          className={classes.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

export default SellerSettings;
