import React, { useEffect, useState, useContext } from "react";
import classes from "./HomeHeader.module.css";
import AuthenticationContext from "../../store/authentication/Authentication-context";
import LocationContext from "../../store/location/Location-context";
import useVietnamCitys from "../../hook/useVietnamCity";
import { useNotification } from "../../hook/useNotification";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";

const HomeHeader = () => {
  const [name, setName] = useState("Xem phim cả đêm?");
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState("");
  const [showSearchLocation, setSearchLocation] = useState({
    newVietnamCity: [],
  });
  const locationContextCtx = useContext(LocationContext);
  const AuthenticationCtx = useContext(AuthenticationContext);
  const { NotificationHandler } = useNotification();
  const { updateLocation } = useLocationLocalStorage();
  const setCustomerLocation = (customerLocation) => {
    updateLocation(customerLocation);
    setLocation("");
    locationContextCtx.onLocalStorageLocation(customerLocation);
  };
  const showHandler = (name) => {
    NotificationHandler(name, "Success");
    AuthenticationCtx.onShow(name);
  };
  useEffect(() => {
    const VietnamCity = useVietnamCitys(location);
    setSearchLocation(VietnamCity);
  }, [location]);
  useEffect(() => {
    setTimeout(() => {
      if (count % 4 == 0) setName("Đói bụng hả?");
      if (count % 4 == 1) setName("Xem phim cả đêm?");
      if (count % 4 == 2) setName("Khách đến bất ngờ?");
      if (count % 4 == 3) setName("Làm việc muộn ở công ty?");
      setCount((prev) => 1 + prev);
    }, 3000);
  }, [count]);

  return (
    <div className={classes.box}>
      <div className={classes.left}>
        <div className={classes.part1}>
          <div className={classes.part1_img}>
            <img src="/greatfood/Logo/logo_2022.png" alt="logo" />
            <h2>GreatFood</h2>
          </div>
          <div className={classes.buttons}>
            <button
              onClick={() => {
                showHandler("LogInOpen");
              }}
              className={classes.login}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                showHandler("signupOpen");
              }}
              className={classes.signup}
            >
              Đăng ký
            </button>
          </div>
        </div>
        <div className={classes.part2}>
          <div className={classes.overflowPart}>
            <h2>{name}</h2>
          </div>
          <p>Đặt đồ ăn từ các nhà hàng yêu thích quanh bạn.</p>
        </div>
        <div className={classes.part3}>
          <div className={classes.Input_searchLocations}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Nhập địa chỉ giao hàng của bạn"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
            {showSearchLocation.newVietnamCity.length == 0 ? (
              <></>
            ) : (
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
      <div className={classes.right}></div>
    </div>
  );
};

export default HomeHeader;
