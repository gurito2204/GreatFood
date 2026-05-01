import { useLocationLocalStorage } from "./LocationLocalStorage";
import { api } from "../../services/api";

const useAvailableRestaurants = () => {
  const { fetchPincode, fetchGPSCoords } = useLocationLocalStorage();

  const AvailableRestaurantsData = async () => {
    const gpsCoords = fetchGPSCoords();

    // Nếu có GPS coords → gọi /nearbyrestaurants (không cần pincode)
    if (gpsCoords) {
      const { lat, lng } = gpsCoords;
      const data = await api.get(`/nearbyrestaurants?lat=${lat}&lng=${lng}`)
        .catch((err) => { console.error(err); return []; });
      return data;
    }

    // Fallback: dùng pincode như cũ
    const pincode = fetchPincode();
    const data = await api.get(`/availablerestaurants/${pincode}`)
      .catch((err) => { console.error(err); return []; });
    return data;
  };

  return { AvailableRestaurantsData };
};

export default useAvailableRestaurants;
