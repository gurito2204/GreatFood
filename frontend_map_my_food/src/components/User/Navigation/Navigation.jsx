import React from "react";
import classes from "./Navigation.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListIcon from "@atlaskit/icon/core/list-bulleted";
import StarIcon from "@atlaskit/icon/core/star-starred";
import LikeIcon from "@atlaskit/icon/core/heart";
import CreditCardIcon from "@atlaskit/icon/core/credit-card";
import LocationIcon from "@atlaskit/icon/core/location";
import SettingsIcon from "@atlaskit/icon/core/settings";
import SignOutIcon from "@atlaskit/icon/core/log-out";
import StoreIcon from "@atlaskit/icon/core/takeout-food";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (pathname) => {
    return location.pathname === pathname;
  };
  const { removePersonalDetails } = useLocationLocalStorage();
  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <Link
          to={"/my-account/orders"}
          className={`${
            isActive("/my-account/orders") ? classes.active : classes.item
          }`}
        >
          <ListIcon label="Orders" />
          Orders
        </Link>
        <Link
          to={"/my-account/super"}
          className={`${
            isActive("/my-account/super") ? classes.active : classes.item
          }`}
        >
          <StarIcon label="Super" />
          Super
        </Link>
        <Link
          to={"/my-account/favourites"}
          className={`${
            isActive("/my-account/favourites") ? classes.active : classes.item
          }`}
        >
          <LikeIcon label="Favourites" />
          Favourites
        </Link>
        <Link
          to={"/my-account/payments"}
          className={`${
            isActive("/my-account/payments") ? classes.active : classes.item
          }`}
        >
          <CreditCardIcon label="Payments" />
          Payments
        </Link>
        <Link
          to={"/my-account/manage_addresses"}
          className={`${
            isActive("/my-account/manage_addresses")
              ? classes.active
              : classes.item
          }`}
        >
          <LocationIcon label="Addresses" />
          Addresses
        </Link>
        <Link
          to={"/my-account/settings"}
          className={`${
            isActive("/my-account/settings") ? classes.active : classes.item
          }`}
        >
          <SettingsIcon label="Settings" />
          Settings
        </Link>
        <Link
          to={"/new-restaurant"}
          className={`${
            isActive("/new-restaurant") ? classes.active : classes.item
          }`}
        >
          <StoreIcon label="New Restaurant" />
          New Restaurant
        </Link>
        <div
          className={`${
            isActive("/my-account/logout") ? classes.active : classes.item
          }`}
          onClick={() => {
            removePersonalDetails();
            navigate("/");
          }}
        >
          <SignOutIcon label="Log out" />
          Log out
        </div>
      </div>
    </div>
  );
};

export default Navigation;
