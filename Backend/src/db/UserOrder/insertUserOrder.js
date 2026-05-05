const getDb = require("../db").getDb;
const v4 = require("uuid").v4;

module.exports = insertUserOrder = async (userId, order) => {
  try {
    const connection = await getDb();

    // Validate: kiểm tra tất cả items có available không
    const orderItems = order.order || [];
    for (const item of orderItems) {
      if (!item.itemId) continue;
      const foodDoc = await connection.collection("restaurantFood").findOne({ "food.itemId": item.itemId });
      if (!foodDoc) continue;
      const foodItem = foodDoc.food.find(f => f.itemId === item.itemId);
      if (foodItem && foodItem.available === false) {
        throw new Error(`Món "${foodItem.name || item.itemId}" đã hết hàng hoặc tạm ngưng bán`);
      }
    }

    // Validate: kiểm tra quán có đang mở không
    if (order.restaurantId) {
      const restaurant = await connection.collection("restaurant").findOne({ RestaurantId: order.restaurantId });
      if (restaurant && restaurant.isOpen === false) {
        throw new Error("Quán đang đóng cửa, không thể đặt hàng");
      }
    }

    const orderId = v4();
    const { insertId } = await connection
      .collection("orders")
      .insertOne({ 
        userId, 
        ...order, 
        orderId, 
        status: "pending", 
        createdAt: new Date() 
      });

    // Trừ stock cho mỗi item trong order
    const items = order.order || [];
    for (const item of items) {
      if (!item.itemId) continue;
      const qty = item.quantity || 1;
      // Tìm food doc chứa item này
      const foodDoc = await connection.collection("restaurantFood").findOne({ "food.itemId": item.itemId });
      if (!foodDoc) continue;
      const foodItem = foodDoc.food.find(f => f.itemId === item.itemId);
      if (!foodItem) continue;
      // Chỉ trừ nếu stock > 0 (stock = -1 nghĩa là không giới hạn)
      const currentStock = foodItem.stock ?? -1;
      if (currentStock > 0) {
        const newStock = Math.max(0, currentStock - qty);
        const updateFields = { "food.$.stock": newStock };
        if (newStock === 0) {
          updateFields["food.$.available"] = false;
        }
        await connection.collection("restaurantFood").updateOne(
          { "food.itemId": item.itemId },
          { $set: updateFields }
        );
      }
    }

    return orderId;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
