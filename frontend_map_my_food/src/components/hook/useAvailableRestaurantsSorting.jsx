import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useAvailableRestaurantsSorting = () => {
  const { fetchPincode, fetchGPSCoords } = useLocationLocalStorage();
  const pincode = fetchPincode();
  
  const AvailableRestaurantsSortingData = async (sorting) => {
    try {
      let path = `/availablerestaurants/${pincode}/${sorting}`;
      if (sorting === "nearest") {
        const coords = fetchGPSCoords();
        if (coords) path += `?lat=${coords.lat}&lng=${coords.lng}`;
      }
      return await api.get(path);
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  return { AvailableRestaurantsSortingData };
};

export default useAvailableRestaurantsSorting;
