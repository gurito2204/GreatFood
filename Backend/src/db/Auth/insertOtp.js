const getDb = require("../db").getDb;

module.exports = insertOtp = async (number, otp) => {
  try {
    const connection = await getDb();
    // Lưu ý: Cần tạo TTL index một lần trên MongoDB:
    //   db.otps.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 300 })
    const { insertedId } = await connection.collection("otps").insertOne(
      {
        number: number,
        otp: otp,
        createdAt: new Date(),
      }
    );
    return insertedId;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
