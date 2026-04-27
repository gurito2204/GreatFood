import VietnamCity from "../TemporaryData/VietnamCity.json";
export const useLocationLocalStorage = () => {
  const fetchLocation = () => {
    const storedData = localStorage.getItem("recentLocationSearch");
    const location = JSON.parse(storedData);
    return location;
  };
  const fetchPincode = () => {
    const storedData = localStorage.getItem("pincode");
    const pincode = JSON.parse(storedData);
    return pincode;
  };
  const updateLocation = (newLocation) => {
    let currentLocation = [];
    const pastLocation = localStorage.getItem("recentLocationSearch");
    if (pastLocation) currentLocation = JSON.parse(pastLocation);
    const isLocationExists = currentLocation.includes(newLocation);
    if (isLocationExists) {
      const index = currentLocation.indexOf(newLocation);
      currentLocation.splice(index, 1);
    }
    currentLocation.unshift(newLocation);
    localStorage.setItem(
      "recentLocationSearch",
      JSON.stringify(currentLocation)
    );
    updatePincode(newLocation);
  };
const updatePincode = (location) => {
    let pincode = "";
    // Lấy tên địa điểm (ví dụ: "Ký túc xá Khu A ĐHQG")
    const nameToMatch = location.split(",")[0].trim(); 
    
    // Quét trong data Việt Nam thay vì Ấn Độ
    for (let i = 0; i < VietnamCity.length; i++) {
      if (VietnamCity[i].name === nameToMatch) {
        pincode = VietnamCity[i].pincode;
        break;
      }
    }
    localStorage.setItem("pincode", JSON.stringify(pincode));
  };

  const updatePersonalDetails = (data) => {
    localStorage.setItem("PersonalDetails", JSON.stringify(data));
    if (data.data.ResturentId) updateRestaurantId(data.data.ResturentId);
    else localStorage.removeItem("restaurantId");
    window.dispatchEvent(new Event("authChanged"));
  };
  const fetchPersonalDetails = () => {
    const Data = localStorage.getItem("PersonalDetails");
    const response = JSON.parse(Data);
    return response;
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
    const Data = localStorage.getItem("restaurantId");
    const response = JSON.parse(Data);
    return response;
  };

  const updateGPSCoords = (lat, lng) => {
    localStorage.setItem("gpsCoords", JSON.stringify({ lat, lng }));
  };
  const fetchGPSCoords = () => {
    const data = localStorage.getItem("gpsCoords");
    return data ? JSON.parse(data) : null;
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
