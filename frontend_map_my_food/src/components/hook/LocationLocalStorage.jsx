import { useLocationState } from "./useLocationState";
import VietnamCity from "../TemporaryData/VietnamCity.json";

export const useLocationLocalStorage = () => {
  const { mode, coords, pincode, displayAddress, updateGPSLocation, updateManualLocation } = useLocationState();

  const fetchLocation = () => {
    return displayAddress || pincode || null;
  };

  const updateLocation = (newLocation) => {
    let newPincode = "";
    const nameToMatch = newLocation.split(",")[0].trim(); 
    for (let i = 0; i < VietnamCity.length; i++) {
      if (VietnamCity[i].name === nameToMatch) {
        newPincode = VietnamCity[i].pincode;
        break;
      }
    }
    updateManualLocation(newPincode, newLocation);
  };

  const fetchPincode = () => {
    return pincode;
  };

  const updatePersonalDetails = (data) => {
    localStorage.setItem("PersonalDetails", JSON.stringify(data));
    if (data && data.data && data.data.ResturentId) {
      updateRestaurantId(data.data.ResturentId);
    } else {
      localStorage.removeItem("restaurantId");
    }
    window.dispatchEvent(new Event("authChanged"));
  };

  const fetchPersonalDetails = () => {
    try {
      const Data = localStorage.getItem("PersonalDetails");
      return Data ? JSON.parse(Data) : null;
    } catch {
      return null;
    }
  };

  const removePersonalDetails = () => {
    localStorage.removeItem("PersonalDetails");
    localStorage.removeItem("restaurantId");
    window.dispatchEvent(new Event("authChanged"));
  };

  const updateRestaurantId = (data) => {
    localStorage.setItem("restaurantId", JSON.stringify(data));
  };

  const fetchRestaurantId = () => {
    try {
      const Data = localStorage.getItem("restaurantId");
      return Data ? JSON.parse(Data) : null;
    } catch {
      return null;
    }
  };

  const updateGPSCoords = (lat, lng) => {
    updateGPSLocation(lat, lng);
  };

  const fetchGPSCoords = () => {
    return coords;
  };

  return {
    fetchLocation,
    updateLocation,
    fetchPincode,
    updatePersonalDetails,
    fetchPersonalDetails,
    removePersonalDetails,
    updateRestaurantId,
    fetchRestaurantId,
    updateGPSCoords,
    fetchGPSCoords,
  };
};
