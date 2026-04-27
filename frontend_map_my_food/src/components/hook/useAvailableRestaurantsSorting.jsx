import AvailablerestaurantsData from "../TemporaryData/AvailableRestaurantsData.json";
import { useLocationLocalStorage } from "./LocationLocalStorage";

const useAvailableRestaurantsSorting = () => {
  const { fetchPincode, fetchGPSCoords } = useLocationLocalStorage();
  const pincode = fetchPincode();
  const AvailableRestaurantsSortingData = async (sorting) => {
    let url = `${import.meta.env.VITE_REACT_BACKEND_URL}/availablerestaurants/${pincode}/${sorting}`;
    if (sorting === "nearest") {
      const coords = fetchGPSCoords();
      if (coords) url += `?lat=${coords.lat}&lng=${coords.lng}`;
    }
    const data = await fetch(url)
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        return AvailablerestaurantsData;
      });
    return data;
  };
  return { AvailableRestaurantsSortingData };
};

export default useAvailableRestaurantsSorting;
