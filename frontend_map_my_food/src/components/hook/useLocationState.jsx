import { useState, useEffect } from "react";
import { api } from "../../services/api";

const getSavedState = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveState = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const useLocationState = () => {
  const [mode, setMode] = useState(() => getSavedState("locationMode", "manual"));
  const [coords, setCoords] = useState(() => getSavedState("gpsCoords", null));
  const [pincode, setPincode] = useState(() => getSavedState("pincode", ""));
  const [displayAddress, setDisplayAddress] = useState(() => {
    const saved = getSavedState("displayAddress", "");
    if (/^[0-9.-]+,\s*[0-9.-]+$/.test(saved)) return "";
    return saved;
  });

  useEffect(() => {
    saveState("locationMode", mode);
  }, [mode]);

  useEffect(() => {
    saveState("gpsCoords", coords);
  }, [coords]);

  useEffect(() => {
    saveState("pincode", pincode);
  }, [pincode]);

  useEffect(() => {
    saveState("displayAddress", displayAddress);
  }, [displayAddress]);

  const updateGPSLocation = async (lat, lng) => {
    setMode("gps");
    saveState("locationMode", "gps");
    try {
      const response = await api.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
      const json = response.data;
      const address = json.address || {};
      
      let ward = address.suburb || address.quarter || address.neighbourhood;
      let province = address.state || address.city;

      // Sửa lỗi Nominatim map sai Quận Phú Nhuận thành Phường Phú Nhuận và nhét vào Thủ Đức
      if (ward && ward.includes("Phú Nhuận")) {
        ward = "Quận Phú Nhuận";
        province = "Hồ Chí Minh";
      }
      if (ward && ward.includes("Bình Thạnh")) {
        ward = "Quận Bình Thạnh";
        province = "Hồ Chí Minh";
      }
      if (province === "Thành phố Thủ Đức" && json.display_name?.includes("Hồ Chí Minh")) {
        // Thuộc HCMC nhưng Nominatim hay gán lầm city là Thủ Đức cho các quận khác
        if (ward && !ward.includes("Thủ Đức") && !ward.includes("Quận 2") && !ward.includes("Quận 9")) {
          province = "Hồ Chí Minh";
        }
      }

      const parts = [ward, province].filter(Boolean);
      const display = parts.length > 0
        ? parts.join(", ")
        : json.display_name?.split(",").slice(0, 2).join(",").trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      setDisplayAddress(display);
      saveState("displayAddress", display);
    } catch (err) {
      console.warn("Proxy Nominatim failed", err);
      const display = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setDisplayAddress(display);
      saveState("displayAddress", display);
    }
  };

  const updateManualLocation = (newPincode, newDisplay) => {
    setMode("manual");
    saveState("locationMode", "manual");
    setPincode(newPincode);
    saveState("pincode", newPincode);
    setDisplayAddress(newDisplay);
    saveState("displayAddress", newDisplay);
    setCoords(null);
    saveState("gpsCoords", null);
  };

  const fetchAvailableRestaurants = async () => {
    if (mode === "gps" && coords) {
      return api.get(`/nearbyrestaurants?lat=${coords.lat}&lng=${coords.lng}`)
        .catch(err => { console.error(err); return []; });
    } else if (pincode) {
      return api.get(`/availablerestaurants/${pincode}`)
        .catch(err => { console.error(err); return []; });
    }
    return [];
  };

  return {
    mode,
    coords,
    pincode,
    displayAddress,
    updateGPSLocation,
    updateManualLocation,
    fetchAvailableRestaurants,
  };
};
