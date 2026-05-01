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
  const [displayAddress, setDisplayAddress] = useState(() => getSavedState("displayAddress", ""));

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
    setCoords({ lat, lng });
    try {
      const json = await api.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
      const address = json.address || {};
      const ward = address.suburb || address.quarter || address.neighbourhood;
      const province = address.state;
      const parts = [ward, province].filter(Boolean);
      const display = parts.length > 0
        ? parts.join(", ")
        : json.display_name?.split(",").slice(0, 2).join(",").trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setDisplayAddress(display);
    } catch (err) {
      console.warn("Proxy Nominatim failed", err);
      setDisplayAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  };

  const updateManualLocation = (newPincode, newDisplay) => {
    setMode("manual");
    setPincode(newPincode);
    setDisplayAddress(newDisplay);
    setCoords(null);
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
