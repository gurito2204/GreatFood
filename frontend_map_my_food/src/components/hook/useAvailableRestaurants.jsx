import { useLocationLocalStorage } from "./LocationLocalStorage";

const useAvailableRestaurants = () => {
  const { fetchPincode, fetchGPSCoords } = useLocationLocalStorage();

  const AvailableRestaurantsData = async () => {
    const gpsCoords = fetchGPSCoords();

    // Nếu có GPS coords → gọi /nearbyrestaurants (không cần pincode)
    if (gpsCoords) {
      const { lat, lng } = gpsCoords;
      const data = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/nearbyrestaurants?lat=${lat}&lng=${lng}`
      )
        .then((res) => res.json())
        .catch((err) => { console.error(err); return []; });
      return data;
    }

    // Fallback: dùng pincode như cũ
    const pincode = fetchPincode();
    const data = await fetch(
      `${import.meta.env.VITE_REACT_BACKEND_URL}/availablerestaurants/${pincode}`
    )
      .then((res) => res.json())
      .catch((err) => { console.error(err); return []; });
    return data;
  };

  return { AvailableRestaurantsData };
};

export default useAvailableRestaurants;
