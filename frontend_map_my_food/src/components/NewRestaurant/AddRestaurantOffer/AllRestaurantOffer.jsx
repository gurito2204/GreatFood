import React, { useEffect, useState } from "react";
import AddRestaurantOffer from "./AddRestaurantOffer";
import classes from "../AllRestaurant.module.css";
import SvgAddNew from "../../ui/User/SvgAddNew";
import useGetFoodsAndOffers from "../../hook/useGetFoodsAndOffers";
import { useLocationLocalStorage } from "../../hook/LocationLocalStorage";
import { useNotification } from "../../hook/useNotification";
import { useNavigate } from "react-router-dom";

const AllRestaurantOffer = () => {
  const { GetFoodsAndOffersData } = useGetFoodsAndOffers();
  const { fetchRestaurantId } = useLocationLocalStorage();
  const { NotificationHandler } = useNotification();
  const navigate = useNavigate();
  const isRestaurantId = fetchRestaurantId();
  const [allOffersData, setAllOffersData] = useState([]);
  const [isAddNew, setIsAddnew] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      const response = await GetFoodsAndOffersData("restaurantalloffers");
      setAllOffersData(response);
    };
    if (isRestaurantId != undefined) fetchdata();
  }, []);
  const toggleForm = () => {
    if (isRestaurantId != undefined) {
      setIsAddnew((prev) => !prev);
    } else {
      setIsAddnew(false);
      NotificationHandler("First make a Restaurant!", "Warn");
    }
  };
  return (
    <div className={classes.container}>
      {allOffersData.map((offer, index) => (
        <AddRestaurantOffer key={index} offer={offer} />
      ))}
      {isAddNew && <AddRestaurantOffer />}
      <div className={classes.buttons} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className={classes.button}>
          <div onClick={toggleForm}>
            <SvgAddNew />
          </div>
        </div>
        <div 
          style={{ cursor: "pointer", background: "#fc8019", color: "#fff", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold" }}
          onClick={() => window.location.reload()}
        >
          Hoàn tất
        </div>
      </div>
    </div>
  );
};

export default AllRestaurantOffer;
