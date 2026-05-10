const getDb = require("../db").getDb;
const getRestaurant = require("../Restaurant/getRestaurant");

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

/**
 * Lấy TẤT CẢ nhà hàng, tính distanceKm từ userLat/userLng,
 * sort gần nhất lên đầu. Không cần pincode.
 */
module.exports = getNearbyRestaurants = async (userLat, userLng, radiusKm = 5) => {
  try {
    const connection = await getDb();
    const restaurants = await connection.collection("restaurant").find().toArray();

    const results = [];
    
    for (const restaurant of restaurants) {
      const rId = restaurant.RestaurantId || restaurant.restaurantId;
      if (!rId) continue;

      const temp = {
        RestaurantId: rId,
        image: restaurant.image,
        about: {
          heading: restaurant.Restaurant,
          name: restaurant.Restaurant_dish,
        },
        last: {
          star: restaurant.rating,
          time: restaurant.time,
          cost: restaurant.price,
        },
        subscriptionTier: restaurant.subscriptionTier || "BASIC",
        distanceKm: null,
        lat: restaurant.lat || null,
        lng: restaurant.lng || null,
        address: restaurant.address || null,
        isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true,
      };

      // Bỏ qua các nhà hàng không có tọa độ
      if (restaurant.lat == null || restaurant.lng == null) {
        continue;
      }

      const d = haversineKm(
        parseFloat(userLat),
        parseFloat(userLng),
        parseFloat(restaurant.lat),
        parseFloat(restaurant.lng)
      );

      if (isNaN(d)) continue; // Bỏ qua nếu tọa độ không hợp lệ

      temp.distanceKm = parseFloat(d.toFixed(1));
      
      // Lọc theo bán kính (tạm thời để 50km để test dễ hơn, hoặc giữ radiusKm)
      if (temp.distanceKm > radiusKm) continue;

      results.push(temp);
    }

    // Sort: PREMIUM trước, rồi sort theo khoảng cách (null xuống cuối)
    results.sort((a, b) => {
      if (a.subscriptionTier === "PREMIUM" && b.subscriptionTier !== "PREMIUM") return -1;
      if (a.subscriptionTier !== "PREMIUM" && b.subscriptionTier === "PREMIUM") return 1;
      if (a.distanceKm == null && b.distanceKm == null) return 0;
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });

    return results;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
