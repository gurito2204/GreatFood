import React, { useContext } from "react";
import Home from "../home/Home";
import HomeHeader from "../home/HomeHeader/HomeHeader";
import Restaurants from "../restaurants/Restaurants";
import LocationContext from "../store/location/Location-context";
import { useLocationLocalStorage } from "../hook/LocationLocalStorage";

const HomePage = () => {
  const { fetchLocation } = useLocationLocalStorage();
  const locationContextCtx = useContext(LocationContext);
  const isLocation = fetchLocation().length > 0;
  
  return (
    <>
      <HomeHeader />
      {isLocation ? <Restaurants /> : <Home showHeader={false} />}
    </>
  );
};

export default HomePage;
