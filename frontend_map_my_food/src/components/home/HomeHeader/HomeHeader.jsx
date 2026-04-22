import React, { useEffect, useState, useContext } from "react";
import classes from "./HomeHeader.module.css";
import AuthenticationContext from "../../store/authentication/Authentication-context";
import LocationContext from "../../store/location/Location-context";
import useVietnamCitys from "../../hook/useVietnamCity";
import { useNotification } from "../../hook/useNotification";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";

const HomeHeader = () => {
  const [name, setName] = useState("Movie marathon?");
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
      if (count % 4 == 0) setName("Hungry?");
      if (count % 4 == 1) setName("Movie marathon?");
      if (count % 4 == 2) setName("Unexpected Guest");
      if (count % 4 == 3) setName("Late Night at Office?");
      setCount((prev) => 1 + prev);
    }, 3000);
  }, [count]);

  return (
    <div className={classes.box}>
      <div className={classes.left}>
        <div className={classes.part1}>
          <div className={classes.part1_img}>
            <img src="/swiggey/Logo/logo_2022.png" alt="logo" />
            <h2>GreatFood</h2>
          </div>
          <div className={classes.buttons}>
            <button
              onClick={() => {
                showHandler("LogInOpen");
              }}
              className={classes.login}
            >
              Login
            </button>
            <button
              onClick={() => {
                showHandler("signupOpen");
              }}
              className={classes.signup}
            >
              Sign up
            </button>
          </div>
        </div>
        <div className={classes.part2}>
          <div className={classes.overflowPart}>
            <h2>{name}</h2>
          </div>
          <p>Order food from favourite restaurants near you.</p>
        </div>
        <div className={classes.part3}>
          <div className={classes.Input_searchLocations}>
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
          <button
            onClick={() => {
              console.log("Find Food");
            }}
          >
            FIND FOOD
          </button>
        </div>
        <div className={classes.part4}>
          <h2>KHU Vá»°C PHá»” BIáº¾N</h2>
          <p>
            <span>Thá»§ Äá»©c</span> DÄ© An <span>Thuáº­n An</span> Thá»§ Dáº§u Má»™t
            <span> BÃ¬nh Tháº¡nh </span> Linh Trung
            <span> Linh Chiá»ƒu </span> ÄÃ´ng HÃ²a <span> & nhiá»u nÆ¡i khÃ¡c.</span>
          </p>
        </div>
      </div>
      <div className={classes.right}></div>
    </div>
  );
};

export default HomeHeader;
