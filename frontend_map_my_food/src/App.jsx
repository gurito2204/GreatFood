import { useState, useContext, useEffect } from "react";
import classes from "./App.module.css";
import Location from "./components/Location/Location";
import Notifications from "./components/Notification/Notifications";
import Header from "./components/header/Header";
import { AllRoutes } from "./AllRoutes";
import Auth from "./components/Authentication/Auth";
import Footer from "./components/Footer/Footer";
import LocationContext from "./components/store/location/Location-context";
import { useLocationLocalStorage } from "./components/hook/LocationLocalStorage";
import { useLocationState } from "./components/hook/useLocationState";

function App() {
  const locationContextCtx = useContext(LocationContext);
  const { fetchLocation, fetchPersonalDetails } = useLocationLocalStorage();
  const { displayAddress } = useLocationState();
  const locations = fetchLocation();
  const [isLocation, setIsLocation] = useState(locations && locations.length > 0);
  const [islogIn, setIslogIn] = useState(fetchPersonalDetails());
  
  useEffect(() => {
    const locs = fetchLocation();
    setIsLocation(locs && locs.length > 0);
    setIslogIn(fetchPersonalDetails());
  }, [displayAddress]);

  return (
    <div className={classes.App}>
      <Location />
      <Notifications />
      {isLocation && (
        <div className={classes.header}>
          <Header />
        </div>
      )}
      <div className={`${isLocation ? classes.AllRoutes : classes.allRoute}`}>
        <AllRoutes islogIn={islogIn} />
      </div>
      <Auth />
      <Footer />
    </div>
  );
}

export default App;
