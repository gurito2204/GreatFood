import React, { useState } from "react";
import classes from "./AvailableRestaurantsHeader.module.css";
import useAvailableRestaurantsSorting from "../../../hook/useAvailableRestaurantsSorting";
import { useLocationLocalStorage } from "../../../hook/LocationLocalStorage";
import LocationContext from "../../../store/location/Location-context";
import { useContext } from "react";

const AvailableRestaurantsHeader = ({ numberOfRestaurants, setData }) => {
  const [index, setIndex] = useState(-1);
  const { AvailableRestaurantsSortingData } = useAvailableRestaurantsSorting();
  const { fetchGPSCoords } = useLocationLocalStorage();
  const locationCtx = useContext(LocationContext);
  const hasGPS = !!fetchGPSCoords();
  const Sorting = async (sorting, newIndex) => {
    if (sorting === "nearest" && !hasGPS) {
      locationCtx.onShow();
      return;
    }
    const response = await AvailableRestaurantsSortingData(sorting);
    setData(response);
    setIndex(newIndex);
  };
  return (
    <div className={classes.header}>
      <div className={classes.header_left}>
        {numberOfRestaurants} restaurants
      </div>
      <div className={classes.header_right}>
        <div
          className={
            index === 0
              ? classes.header_right_text_active
              : classes.header_right_text
          }
          onClick={() => {
            Sorting("relevance", 0);
          }}
        >
          Relevance
        </div>
        <div
          className={
            index === 1
              ? classes.header_right_text_active
              : classes.header_right_text
          }
          onClick={() => {
            Sorting("time", 1);
          }}
        >
          Delivery Time
        </div>
        <div
          className={
            index === 2
              ? classes.header_right_text_active
              : classes.header_right_text
          }
          onClick={() => {
            Sorting("rating", 2);
          }}
        >
          Rating
        </div>
        <div
          className={
            index === 3
              ? classes.header_right_text_active
              : classes.header_right_text
          }
          onClick={() => {
            Sorting("low", 3);
          }}
        >
          Cost: Low To High
        </div>
        <div
          className={
            index === 4
              ? classes.header_right_text_active
              : classes.header_right_text
          }
          onClick={() => {
            Sorting("high", 4);
          }}
        >
          Cost: High To Low
        </div>
        <div className={classes.header_right_text}>Filters</div>
        <div
          className={
            index === 5
              ? classes.header_right_text_active
              : hasGPS ? classes.header_right_text : classes.header_right_text_disabled
          }
          onClick={() => { Sorting("nearest", 5); }}
          title={hasGPS ? "" : "Bật GPS để dùng tính năng này"}
        >
          📍 Gần nhất
        </div>
      </div>
    </div>
  );
};

export default AvailableRestaurantsHeader;
