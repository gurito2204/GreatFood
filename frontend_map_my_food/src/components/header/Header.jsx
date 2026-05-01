import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./Header.module.css";
import Svgsearch from "../ui/Svg/Svgsearch";
import Svgoffers from "../ui/Svg/Svgoffers";
import Svghelp from "../ui/Svg/Svghelp";
import Svgsign from "../ui/Svg/Svgsign";
import CartContext from "../store/cart/Cart-context";
import LocationContext from "../store/location/Location-context";
import AuthenticationContext from "../store/authentication/Authentication-context";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const Header = () => {
  const cartContextCtx = useContext(CartContext);
  const locationCtx = useContext(LocationContext);
  const authenticationContextCtx = useContext(AuthenticationContext);
  const { fetchLocation, fetchPersonalDetails, fetchRestaurantId } = useLocationLocalStorage();
  const place = fetchLocation();
  const personalDetails = fetchPersonalDetails();
  const restaurantId = fetchRestaurantId();
  const [number, setNumber] = useState(cartContextCtx.addItems.length);
  const [unreadCount, setUnreadCount] = useState(0);
  const [authState, setAuthState] = useState(Date.now());
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => setAuthState(Date.now());
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    setNumber(cartContextCtx.addItems.length);
  }, [cartContextCtx.addItems.length]);

  useEffect(() => {
    if (restaurantId) {
      fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/api/seller/inbox/${restaurantId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.totalUnread !== undefined) {
            setUnreadCount(data.totalUnread);
          }
        })
        .catch(err => console.error(err));
    }
  }, [restaurantId, location.pathname]);

  const isActive = (pathname) => {
    return location.pathname.substring(0, 7) === pathname.substring(0, 7);
  };
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Link to={"/"} className={classes.left_image}>
          <img src="/greatfood/Logo/logo_2022.png" alt="logo" />
        </Link>
        <div
          className={classes.left_phone_other}
          onClick={() => {
            locationCtx.onShow();
          }}
        >
          Other
        </div>
        <div
          className={classes.left_place}
          onClick={() => {
            locationCtx.onShow();
          }}
        >
          <span>Other </span>
          {place[0]}
        </div>
        <i
          className={classes.left_image_arrow}
          onClick={() => {
            locationCtx.onShow();
          }}
        ></i>
      </div>
      <div className={classes.right}>
        <Link to={"/search"} className={classes.right_part}>
          <div className={classes.right_image}>
            <Svgsearch />
          </div>
          <div
            className={`${
              isActive("/search") ? classes.active : classes.right_text
            }`}
          >
            Search
          </div>
        </Link>
        <Link
          to={"/offers/restaurant"}
          className={`${classes.right_part} ${classes.offers}`}
        >
          <div className={classes.right_image}>
            <Svgoffers />
          </div>
          <div
            className={`${
              isActive("/offers") ? classes.active : classes.right_text
            } ${classes.offers_text}`}
          >
            Offers <span>NEW</span>
          </div>
        </Link>
        <Link to={"/supports"} className={classes.right_part}>
          <div className={classes.right_image}>
            <Svghelp />
          </div>
          <div
            className={`${
              isActive("/supports") ? classes.active : classes.right_text
            }`}
          >
            Help
          </div>
        </Link>
        {personalDetails ? (
          <React.Fragment>
            <Link to={"/seller/dashboard"} className={classes.right_part}>
              <div className={classes.right_image}>
                <Svgoffers /> {/* Reusing the offers icon for seller channel */}
              </div>
              <div
                className={`${
                  isActive("/seller/dashboard")
                    ? classes.active
                    : classes.right_text
                }`}
              >
                Kênh Người Bán
              </div>
            </Link>
            <Link to={"/seller/inbox"} className={classes.right_part}>
              <div className={classes.right_image} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>💬</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: '#fc8019',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 5px',
                    fontSize: '9px',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <div
                className={`${
                  isActive("/seller/inbox")
                    ? classes.active
                    : classes.right_text
                }`}
              >
                Tin nhắn
              </div>
            </Link>
            <Link to={"/my-account/orders"} className={classes.right_part}>
              <div className={classes.right_image}>
                <Svgsign />
              </div>
              <div
                className={`${
                  isActive("/my-account/orders")
                    ? classes.active
                    : classes.right_text
                }`}
              >
                {personalDetails.data.name.substr(0, 8)}
                {"..."}
              </div>
            </Link>
          </React.Fragment>
        ) : (
          <div
            className={classes.right_part}
            onClick={() => {
              authenticationContextCtx.onShow("LogInOpen");
            }}
          >
            <div className={classes.right_image}>
              <Svgsign />
            </div>
            <div
              className={`${
                isActive("/sign") ? classes.active : classes.right_text
              }`}
            >
              Sign In
            </div>
          </div>
        )}
        <Link to={"/checkout"} className={classes.right_part}>
          <div
            className={`${
              number == 0 ? classes.right_number : classes.right_number_green
            }`}
          >
            {number}
          </div>
          <div
            className={`${
              isActive("/checkout") ? classes.active : classes.right_text
            }`}
          >
            Cart
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
