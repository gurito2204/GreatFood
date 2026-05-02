import { useLocationState } from "./useLocationState";
import VietnamCity from "../TemporaryData/VietnamCity.json";

export const useLocationLocalStorage = () => {
  const { mode, coords, pincode, displayAddress, updateGPSLocation, updateManualLocation } = useLocationState();

  /**
   * fetchLocation — trả về ARRAY các địa chỉ gần đây (recent searches)
   * Đây là contract gốc mà Location.jsx dùng .map() trên kết quả.
   */
  const fetchLocation = () => {
    try {
      const storedData = localStorage.getItem("recentLocationSearch");
      return storedData ? JSON.parse(storedData) : [];
    } catch {
      return [];
    }
  };

  /**
   * updateLocation — thêm địa chỉ mới vào đầu mảng recent searches
   * Đồng thời cập nhật pincode và useLocationState.
   */
  const updateLocation = (newLocation) => {
    // 1. Cập nhật recentLocationSearch array
    let currentLocation = [];
    try {
      const pastLocation = localStorage.getItem("recentLocationSearch");
      if (pastLocation) currentLocation = JSON.parse(pastLocation);
    } catch { /* ignore */ }
    
    const isLocationExists = currentLocation.includes(newLocation);
    if (isLocationExists) {
      const index = currentLocation.indexOf(newLocation);
      currentLocation.splice(index, 1);
    }
    currentLocation.unshift(newLocation);
    localStorage.setItem("recentLocationSearch", JSON.stringify(currentLocation));

    // 2. Tìm pincode từ VietnamCity
    let newPincode = "";
    const nameToMatch = newLocation.split(",")[0].trim();
    for (let i = 0; i < VietnamCity.length; i++) {
      if (VietnamCity[i].name === nameToMatch) {
        newPincode = VietnamCity[i].pincode;
        break;
      }
    }

    // 3. Cập nhật useLocationState (lưu pincode + displayAddress)
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
