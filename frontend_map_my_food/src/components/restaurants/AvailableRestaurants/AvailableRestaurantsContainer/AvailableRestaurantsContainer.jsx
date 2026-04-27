import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AvailableRestaurantsContainer.module.css";

const AvailableRestaurantsContainer = ({ datas }) => {
  const navigate = useNavigate();
  return (
    <div className={classes.bottom_container}>
      {datas.map((data, index) => (
        <div key={index} className={classes.bottom_box} onClick={() => { if(data.RestaurantId) navigate(`/search/${data.RestaurantId}`) }}>
          <div className={classes.bottom_box_image}>
            {data.subscriptionTier === "PREMIUM" && (
              <div className={classes.bottom_box_tag} style={{ backgroundColor: "#FFD700", color: "#000", fontWeight: "bold" }}>PREMIUM 👑</div>
            )}
            <img
              src={`${import.meta.env.VITE_REACT_BACKEND_URL}${data.image}`}
              alt=""
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = data.image;
              }}
            />
          </div>
          <div className={classes.bottom_box_about}>
            <div className={classes.bottom_box_about_heading}>
              {data.about.heading}
            </div>
            <div className={classes.bottom_box_about_para}>
              {data.about.name}
            </div>
          </div>
          <div className={classes.bottom_box_last}>
            <div className={classes.bottom_box_last_star}>
              <span>★</span> {data.last.star}
            </div>
            <div className={classes.bottom_box_last_time}>• {data.last.time}</div>
            {data.distanceKm != null && (
              <div className={classes.bottom_box_last_distance}>📍 {data.distanceKm} km</div>
            )}
            <div className={classes.bottom_box_last_cost}>{data.last.cost}</div>
          </div>
          <div className={classes.quick_view}>QUICK VIEW</div>
        </div>
      ))}
    </div>
  );
};
export default AvailableRestaurantsContainer;
