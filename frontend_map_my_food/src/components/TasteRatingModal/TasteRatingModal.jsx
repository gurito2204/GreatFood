import React, { useState, useEffect } from 'react';
import { calibrateScore } from '../../utils/tasteCalibration';
import classes from './TasteRatingModal.module.css';
import { useLocationLocalStorage } from '../hook/LocationLocalStorage';
import { useNotification } from '../hook/useNotification';
import { api } from '../../services/api';

const FLAVORS = [
  { id: 'salty', label: 'Mặn', icon: '🧂' },
  { id: 'sweet', label: 'Ngọt', icon: '🍯' },
  { id: 'sour', label: 'Chua', icon: '🍋' },
  { id: 'spicy', label: 'Cay', icon: '🌶️' },
  { id: 'bitter', label: 'Đắng', icon: '🍵' },
];

const TasteRatingModal = ({ isOpen, onClose, menuItem, onSubmit }) => {
  const [ratings, setRatings] = useState({
    salty: 5,
    sweet: 5,
    sour: 5,
    spicy: 5,
    bitter: 5,
  });
  const [calibratedRatings, setCalibratedRatings] = useState(null);

  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const personalDetails = fetchPersonalDetails();
  const userHistory = personalDetails?.data?.tasteHistory || {};

  useEffect(() => {
    if (!isOpen) return;
    const calibrated = {};
    for (const f of FLAVORS) {
      calibrated[f.id] = calibrateScore(ratings[f.id], f.id, userHistory[f.id]?.bias);
    }
    setCalibratedRatings(calibrated);
  }, [ratings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (flavorId, value) => {
    setRatings(prev => ({ ...prev, [flavorId]: parseInt(value) }));
  };

  const handleSubmit = async () => {
    if (!personalDetails) {
      NotificationHandler("Bạn cần đăng nhập để đánh giá khẩu vị!", "Error");
      onClose();
      return;
    }

    try {
      const data = await api.post(`/restaurant/food/${menuItem.itemId}/rating`, {
        userId: personalDetails.data.id,
        ratings: ratings,
      });

      if (data.success) {
        NotificationHandler("Đã gửi đánh giá thành công!", "Info");

        // Update local tasteHistory to reflect the change immediately
        if (data.tasteHistory) {
          const updatedDetails = { ...personalDetails };
          updatedDetails.data.tasteHistory = data.tasteHistory;
          localStorage.setItem("PersonalDetails", JSON.stringify(updatedDetails));
        }

        if (onSubmit) onSubmit(ratings, calibratedRatings);
      } else {
        NotificationHandler("Có lỗi xảy ra, thử lại sau!", "Error");
      }
    } catch (error) {
      NotificationHandler("Lỗi kết nối!", "Error");
    }

    onClose();
  };

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.modal} onClick={e => e.stopPropagation()}>
        <div className={classes.header}>
          <h3>⭐ Đánh giá khẩu vị</h3>
          <button className={classes.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={classes.body}>
          <p className={classes.itemTitle}>Món: <strong>{menuItem?.name || "Món ăn"}</strong></p>
          <hr className={classes.divider}/>

          {FLAVORS.map(flavor => (
            <div key={flavor.id} className={classes.sliderRow}>
              <div className={classes.sliderLabel}>
                {flavor.icon} {flavor.label}
              </div>
              <div className={classes.sliderWrapper}>
                <input 
                  type="range" 
                  min="1" max="10" step="1" 
                  value={ratings[flavor.id]} 
                  onChange={(e) => handleChange(flavor.id, e.target.value)}
                  className={classes.slider}
                />
                <div className={classes.sliderMarks}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n}>{n}</span>)}
                </div>
              </div>
              <div className={classes.scoreBox}>
                {ratings[flavor.id]}/10
              </div>
            </div>
          ))}

          <div className={classes.infoBox}>
            <p>💡 Dựa trên khẩu vị thường ngày của bạn, hệ thống điều chỉnh (chuẩn hóa) điểm đánh giá món này như sau:</p>
            <ul>
               {FLAVORS.map(f => (
                 <li key={f.id}>{f.icon} {f.label}: {calibratedRatings?.[f.id]}/10</li>
               ))}
            </ul>
          </div>
        </div>

        <div className={classes.footer}>
          <button className={classes.cancelBtn} onClick={onClose}>Huỷ</button>
          <button className={classes.submitBtn} onClick={handleSubmit}>Gửi đánh giá ✓</button>
        </div>
      </div>
    </div>
  );
};

export default TasteRatingModal;
