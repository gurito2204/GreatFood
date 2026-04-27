const getAvailableRestaurants = require("../AvailableRestaurants/getAvailableRestaurants");

/**
 * Haversine formula – tính khoảng cách (km) giữa 2 toạ độ GPS.
 */
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = getAvailableRestaurantsSorting = async (pincode, sorting, userLat, userLng) => {
  try {
    const response = await getAvailableRestaurants(pincode);
    if (sorting == "low") {
      response.sort((a, b) => {
        const costA = parseInt(a.last.cost);
        const costB = parseInt(b.last.cost);
        return costA - costB;
      });
    } else if (sorting == "high") {
      response.sort((a, b) => {
        const costA = parseInt(a.last.cost);
        const costB = parseInt(b.last.cost);
        return costB - costA;
      });
    } else if (sorting == "rating") {
      response.sort((a, b) => {
        const costA = parseInt(a.last.star);
        const costB = parseInt(b.last.star);
        return costB - costA;
      });
    } else if (sorting == "time") {
      response.sort((a, b) => {
        const nameA = a.last.time.toLowerCase();
        const nameB = b.last.time.toLowerCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
      });
    } else if (sorting == "relevance") {
      response.sort((a, b) => {
        const nameA = a.about.name.toLowerCase();
        const nameB = b.about.name.toLowerCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
      });
    } else if (sorting == "nearest" && userLat != null && userLng != null) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);
      response.forEach((r) => {
        if (r.lat != null && r.lng != null) {
          r.distanceKm = parseFloat(haversineKm(lat, lng, r.lat, r.lng).toFixed(1));
        } else {
          r.distanceKm = null;
        }
      });
      response.sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return 0;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }
    return response;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

