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
   * addToRecentSearch — Thêm địa chỉ vào mảng recentLocationSearch KHÔNG chạm state GPS
   */
  const addToRecentSearch = (displayStr) => {
    let current = [];
    try {
      const stored = localStorage.getItem("recentLocationSearch");
      if (stored) current = JSON.parse(stored);
    } catch { /* ignore */ }
    
    current = current.filter(x => x !== displayStr);
    current.unshift(displayStr);
    localStorage.setItem("recentLocationSearch", JSON.stringify(current));
  };

  /**
   * updateLocation — thêm địa chỉ mới vào đầu mảng recent searches
   * Đồng thời cập nhật pincode và useLocationState.
   */
  const updateLocation = (newLocation) => {
    addToRecentSearch(newLocation);

    // 2. Tìm pincode từ VietnamCity
    let newPincode = "";
    let nameToMatch = newLocation.split(",")[0].trim();
    nameToMatch = nameToMatch.replace("📍 ", "");
    
    // Thử match chính xác theo tên trước
    for (let i = 0; i < VietnamCity.length; i++) {
      if (VietnamCity[i].name === nameToMatch) {
        newPincode = VietnamCity[i].pincode;
        break;
      }
    }
    
    // Nếu không tìm thấy, thử tìm xem trong chuỗi newLocation có chứa tên quận nào không
    if (!newPincode) {
      const locationLower = newLocation.toLowerCase();
      for (let i = 0; i < VietnamCity.length; i++) {
        const stateLower = VietnamCity[i].state ? VietnamCity[i].state.toLowerCase() : "";
        // Extract district from state (e.g. "quận phú nhuận" from "quận phú nhuận, hồ chí minh")
        const district = stateLower.split(",")[0].trim();
        if (district && locationLower.includes(district.replace("quận ", "").replace("huyện ", ""))) {
          newPincode = VietnamCity[i].pincode;
          break;
        }
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
    if (data && data.data && data.data.restaurantId) {
      updateRestaurantId(data.data.restaurantId);
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
    addToRecentSearch,
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
