import React, { useState, useEffect, useContext } from "react";
import classes from "./Location.module.css";
import Svgcross from "../ui/Svg/Svgcross";
import LocationContext from "../store/location/Location-context";
import useVietnamCitys from "../hook/useVietnamCity";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";
import useGPSLocation from "../hook/useGPSLocation";

const Location = () => {
  const locationCtx = useContext(LocationContext);
  const open = locationCtx.open;
  const { fetchLocation, updateLocation, updateGPSCoords } = useLocationLocalStorage();
  const pastSearchLocation = fetchLocation();
  const [location, setLocation] = useState("");
  const [showSearchLocation, setSearchLocation] = useState({ newVietnamCity: [] });

  const { status: gpsStatus, coords, displayAddress, error: gpsError, getGPSLocation } = useGPSLocation();

  useEffect(() => {
    const VietnamCity = useVietnamCitys(location);
    setSearchLocation(VietnamCity);
  }, [location]);

  // Khi GPS thành công → lưu coords + display address rồi đóng modal
  useEffect(() => {
    if (gpsStatus === "success" && coords && displayAddress) {
      updateGPSCoords(coords.lat, coords.lng);
      // Lưu địa chỉ GPS vào recentLocationSearch để hiện ở danh sách
      updateLocation(`📍 ${displayAddress}`);
      locationCtx.onHide();
      window.location.reload();
    }
  }, [gpsStatus, coords, displayAddress]);

  const setCustomerLocation = (customerLocation) => {
    updateLocation(customerLocation);
    setLocation("");
    locationCtx.onHide();
    window.location.reload();
  };

  return (
    <div className={classes.container}>
      {open && (
        <div className={classes.backdrop} onClick={() => locationCtx.onHide()}></div>
      )}
      {open && (
        <div className={classes.location}>
          <div className={classes.Input_searchLocations}>
            <div className={classes.close} onClick={() => locationCtx.onHide()}>
              <Svgcross />
            </div>

            <button
              type="button"
              className={`${classes.gps_btn} ${gpsStatus === "loading" ? classes.gps_loading : ""} ${gpsStatus === "success" ? classes.gps_success : ""}`}
              onClick={getGPSLocation}
            >
              {gpsStatus === "loading" ? (
                <><span className={classes.gps_spinner}></span> Đang xác định vị trí...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  </svg>
                  {gpsStatus === "success" ? `✅ ${displayAddress}` : "Dùng vị trí hiện tại"}
                </>
              )}
            </button>

            {gpsStatus === "error" && gpsError && (
              <div className={classes.gps_error}>⚠️ {gpsError}</div>
            )}

            <div className={classes.gps_divider}>hoặc tìm thủ công</div>

            <input
              type="text"
              placeholder="Nhập địa điểm giao hàng..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            {showSearchLocation.newVietnamCity.length > 0 && (
              <div className={classes.searchLocations}>
                {showSearchLocation.newVietnamCity.map((place, index) => (
                  <div
                    key={index}
                    className={classes.searchLocationBox}
                    onClick={() => setCustomerLocation(place)}
                  >
                    <img src="/greatfood/location.png" alt="" />
                    <div className={classes.searchLocation}>{place}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={classes.AllSearchLocationBox}>
            {pastSearchLocation.map((loc, index) => (
              <div key={index} className={classes.searchLocationBox}>
                <img src="/greatfood/location.png" alt="" />
                <div className={classes.searchLocation} onClick={() => setCustomerLocation(loc)}>
                  {loc}
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
