import React, { useContext } from "react";
import Home from "../home/Home";
import Restaurants from "../restaurants/Restaurants";
import LocationContext from "../store/location/Location-context";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const HomePage = () => {
  const { fetchLocation } = useLocationLocalStorage();
  const locationContextCtx = useContext(LocationContext);
  const isLocation = fetchLocation();
  
  return <>{isLocation ? <Restaurants /> : <Home />}</>;
};

export default HomePage;
