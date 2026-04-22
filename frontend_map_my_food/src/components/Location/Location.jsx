import React, { useState, useEffect, useContext } from "react";
import classes from "./Location.module.css";
import Svgcross from "../ui/Svg/Svgcross";
import LocationContext from "../store/location/Location-context";
import useVietnamCitys from "../hook/useVietnamCity";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const Location = () => {
  const locationCtx = useContext(LocationContext);
  const open = locationCtx.open;
  const { fetchLocation, updateLocation } = useLocationLocalStorage();
  const pastSearchLocation = fetchLocation();
  const [location, setLocation] = useState("");
  const [showSearchLocation, setSearchLocation] = useState({
    newVietnamCity: [], // Đổi tên biến ở đây
  });
useEffect(() => {
    // Không cần logic upper/lower rối rắm cũ nữa vì hook mới lo hết rồi
    const VietnamCity = useVietnamCitys(location);
    setSearchLocation(VietnamCity);
  }, [location]);
  const setCustomerLocation = (customerLocation) => {
    updateLocation(customerLocation);
    setLocation("");
  };

  return (
    <div className={classes.container}>
      {open && (
        <div
          className={classes.backdrop}
          onClick={() => {
            locationCtx.onHide();
          }}
        ></div>
      )}
      {open && (
        <div className={classes.location}>
          <div className={classes.Input_searchLocations}>
            <div
              className={classes.close}
              onClick={() => {
                locationCtx.onHide();
              }}
            >
              <Svgcross />
            </div>
            <input
              type="text"
              name=""
              id=""
              placeholder="Enter your delivery location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            {showSearchLocation.newVietnamCity.length == 0 ? (
              <></>
            ) : (
              <div className={classes.searchLocations}>
                {/* Đổi chữ ở map */}
                {showSearchLocation.newVietnamCity.map((place, index) => (
                  <div
                    key={index}
                    className={classes.searchLocationBox}
                    onClick={() => {
                      setCustomerLocation(place);
                    }}
                  >
                    <img src="/swiggey/location.png" alt="" />
                    <div className={classes.searchLocation}>{place}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={classes.AllSearchLocationBox}>
            {pastSearchLocation.map((location, index) => (
              <div key={index} className={classes.searchLocationBox}>
                <img src="/swiggey/location.png" alt="" />
                <div
                  className={classes.searchLocation}
                  onClick={() => {
                    setCustomerLocation(location);
                  }}
                >
                  {location}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
