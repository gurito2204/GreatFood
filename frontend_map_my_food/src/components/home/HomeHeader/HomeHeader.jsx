import React, { useEffect, useState, useContext } from "react";
import classes from "./HomeHeader.module.css";
import LocationContext from "../../store/location/Location-context";
import AuthenticationContext from "../../store/authentication/Authentication-context";
import useVietnamCitys from "../../hook/useVietnamCity";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";

const HomeHeader = () => {
  const [location, setLocation] = useState("");
  const [showSearchLocation, setSearchLocation] = useState({
    newVietnamCity: [],
  });
  const locationContextCtx = useContext(LocationContext);
  const AuthenticationCtx = useContext(AuthenticationContext);
  const { updateLocation, fetchLocation, fetchPersonalDetails } = useLocationLocalStorage();
  const isLocation = fetchLocation().length > 0;
  const isLoggedIn = !!fetchPersonalDetails();

  const setCustomerLocation = (customerLocation) => {
    updateLocation(customerLocation);
    setLocation("");
    locationContextCtx.onLocalStorageLocation(customerLocation);
  };

  useEffect(() => {
    const VietnamCity = useVietnamCitys(location);
    setSearchLocation(VietnamCity);
  }, [location]);

  return (
    <div className={classes.box}>
      <div className={classes.left}>
        {/* Hiện logo + nút đăng nhập/đăng ký khi chưa có địa chỉ (trang chào mừng) */}
        {!isLocation && (
          <div className={classes.part1}>
            <div className={classes.part1_img}>
              <img src="/greatfood/Logo/logo_2022.png" alt="logo" />
              <h2>GreatFood</h2>
            </div>
            {!isLoggedIn && (
              <div className={classes.buttons}>
                <button
                  onClick={() => AuthenticationCtx.onShow("LogInOpen")}
                  className={classes.login}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => AuthenticationCtx.onShow("signupOpen")}
                  className={classes.signup}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        )}
        <div className={classes.part2}>
          <h2>Vừa ngon vừa rẻ, tìm ngay tại GreatFood!</h2>
        </div>
        <div className={classes.part3}>
          <div className={classes.Input_searchLocations}>
            <div className={classes.inputWrapper}>
              <span className={classes.locationIcon}>📍</span>
              <input
                type="text"
                placeholder="Nhập địa chỉ giao hàng của bạn"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </div>
            {showSearchLocation.newVietnamCity.length > 0 && (
              <div className={classes.searchLocations}>
                {showSearchLocation.newVietnamCity.map((place, index) => (
                  <div
                    key={index}
                    className={classes.searchLocationBox}
                    onClick={() => {
                      setCustomerLocation(place);
                    }}
                  >
                    <img src="/greatfood/location.png" alt="" />
                    <div className={classes.searchLocation}>{place}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className={classes.findFoodBtn}
            onClick={() => {
              console.log("Find Food");
            }}
          >
            TÌM ĐỒ ĂN
          </button>
        </div>
        <div className={classes.part4}>
          <h2>KHU VỰC PHỔ BIẾN</h2>
          <p>
            <span>Thủ Đức</span> Dĩ An <span>Thuận An</span> Thủ Dầu Một
            <span> Bình Thạnh </span> Linh Trung
            <span> Linh Chiểu </span> Đông Hòa <span> & nhiều nơi khác.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
