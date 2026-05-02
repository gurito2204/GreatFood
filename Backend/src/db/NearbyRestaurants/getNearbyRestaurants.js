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
module.exports = getNearbyRestaurants = async (userLat, userLng, radiusKm = 15) => {
  try {
    const connection = await getDb();
    const foods = await connection.collection("restaurantFood").find().toArray();

    const results = [];
    await Promise.all(
      foods.map(async (food) => {
        const restaurant = await getRestaurant(food.RestaurantId);
        if (!restaurant) return;

        const temp = {
          RestaurantId: food.RestaurantId,
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
        };

        // Bỏ qua các nhà hàng không có tọa độ
        if (restaurant.lat == null || restaurant.lng == null) {
          return;
        }

        const d = haversineKm(
          parseFloat(userLat),
          parseFloat(userLng),
          parseFloat(restaurant.lat),
          parseFloat(restaurant.lng)
        );
        temp.distanceKm = parseFloat(d.toFixed(1));
        
        // Lọc theo bán kính (15km cho food delivery)
        if (temp.distanceKm > radiusKm) return;

        results.push(temp);
      })
    );

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
