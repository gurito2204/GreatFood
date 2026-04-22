import React, { useState, useEffect } from 'react';
import { calibrateScore } from '../../utils/tasteCalibration';
import classes from './TasteRatingModal.module.css';
import { useLocationLocalStorage } from '../hook/LocationLocalStorage';
import { useNotification } from '../hook/useNotification';

const FLAVORS = [
  { id: 'salty', label: 'Mặn', icon: '🧂' },
  { id: 'sweet', label: 'Ngọt', icon: '🍯' },
  { id: 'sour', label: 'Chua', icon: '🍋' },
  { id: 'bitter', label: 'Chát', icon: '🍵' },
];

const TasteRatingModal = ({ isOpen, onClose, menuItem, onSubmit }) => {
  const [ratings, setRatings] = useState({
    salty: 3,
    sweet: 3,
    sour: 3,
    bitter: 3,
  });
  const [calibratedRatings, setCalibratedRatings] = useState(null);

  const { fetchPersonalDetails } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const personalDetails = fetchPersonalDetails();
  const userHistory = personalDetails?.data?.tasteHistory || undefined;

  useEffect(() => {
    if (!isOpen) return;
    const calibrated = {
      salty: calibrateScore(ratings.salty, 'salty', userHistory?.salty?.avgRating),
      sweet: calibrateScore(ratings.sweet, 'sweet', userHistory?.sweet?.avgRating),
      sour: calibrateScore(ratings.sour, 'sour', userHistory?.sour?.avgRating),
      bitter: calibrateScore(ratings.bitter, 'bitter', userHistory?.bitter?.avgRating),
    };
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
      const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/restaurant/food/${menuItem.itemId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: personalDetails.data.id,
          ratings: ratings
        })
      });

      if (response.ok) {
        const resData = await response.json();
        NotificationHandler("Đã gửi đánh giá thành công!", "Info");
        
        // Optional: Update local storage tasteHistory to reflect the change immediately
        if (resData.tasteHistory) {
          const updatedDetails = { ...personalDetails };
          updatedDetails.data.tasteHistory = resData.tasteHistory;
          localStorage.setItem("PersonalDetails", JSON.stringify(updatedDetails));
        }
        
        if(onSubmit) onSubmit(ratings, calibratedRatings);
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
                  min="1" max="5" step="1" 
                  value={ratings[flavor.id]} 
                  onChange={(e) => handleChange(flavor.id, e.target.value)}
                  className={classes.slider}
                />
                <div className={classes.sliderMarks}>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>
              <div className={classes.scoreBox}>
                {ratings[flavor.id]}/5
              </div>
            </div>
          ))}

          <div className={classes.infoBox}>
            <p>💡 Dựa trên khẩu vị thường ngày của bạn, hệ thống điều chỉnh (chuẩn hóa) điểm đánh giá món này như sau:</p>
            <ul>
               <li>Mặn: {calibratedRatings?.salty}/5</li>
               <li>Ngọt: {calibratedRatings?.sweet}/5</li>
               <li>Chua: {calibratedRatings?.sour}/5</li>
               <li>Chát: {calibratedRatings?.bitter}/5</li>
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
