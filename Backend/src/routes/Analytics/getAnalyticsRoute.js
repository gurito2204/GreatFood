const getDb = require("../../db/db").getDb;

module.exports = {
  method: "get",
  path: "/api/seller/analytics/:restaurantId",
  handler: async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const connection = await getDb();
      
      // 1. Get food items for this restaurant
      const rf = await connection.collection("restaurantFood").findOne({ RestaurantId: restaurantId });
      let itemIds = [];
      if (rf && rf.food && Array.isArray(rf.food)) {
        itemIds = rf.food.map(f => f.itemId);
      }
      
      // 2. Query ratings
      const ratingsDocs = await connection.collection("foodRatings").find({ itemId: { $in: itemIds } }).toArray();
      
      // 3. Aggregate ratings
      let totalRatings = ratingsDocs.length;
      let categories = {
        salty: 0,
        sweet: 0,
        sour: 0,
        bitter: 0,
        spicy: 0
      };
      
      if (totalRatings > 0) {
        ratingsDocs.forEach(doc => {
          if (doc.ratings) {
            categories.salty += doc.ratings.salty || 0;
            categories.sweet += doc.ratings.sweet || 0;
            categories.sour += doc.ratings.sour || 0;
            categories.bitter += doc.ratings.bitter || 0;
            categories.spicy += doc.ratings.spicy || 0;
          }
        });
        
        categories.salty = (categories.salty / totalRatings).toFixed(1);
        categories.sweet = (categories.sweet / totalRatings).toFixed(1);
        categories.sour = (categories.sour / totalRatings).toFixed(1);
        categories.bitter = (categories.bitter / totalRatings).toFixed(1);
        categories.spicy = (categories.spicy / totalRatings).toFixed(1);
      }
      
      // Replace fake views with real views if available, else 0
      const restaurant = await connection.collection("restaurant").findOne({ RestaurantId: restaurantId });
      const views = restaurant?.views || 0;
      
      res.status(200).json({
        views,
        totalRatings,
        averageTaste: categories
      });
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
