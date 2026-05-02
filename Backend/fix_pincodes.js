const fs = require('fs');
const { MongoClient } = require('mongodb');

const districtToPincode = {
  'Quận Thủ Đức': '700000',
  'Quận 1': '700001',
  'Quận 2': '700002',
  'Quận 3': '700003',
  'Quận 4': '700004',
  'Quận 5': '700005',
  'Quận 6': '700006',
  'Quận 7': '700007',
  'Quận 8': '700008',
  'Quận 9': '700009',
  'Quận 10': '700010',
  'Quận 11': '700011',
  'Quận 12': '700012',
  'Quận Gò Vấp': '700013',
  'Quận Bình Thạnh': '700014',
  'Bình Thạnh': '700014',
  'Quận Tân Bình': '700015',
  'Quận Tân Phú': '700016',
  'Quận Phú Nhuận': '700017',
  'Phú Nhuận': '700017',
  'Quận Bình Tân': '700018',
  'Huyện Củ Chi': '700019',
  'Huyện Hóc Môn': '700020',
  'Huyện Bình Chánh': '700021',
  'Huyện Nhà Bè': '700022',
  'Huyện Cần Giờ': '700023',
  'Dĩ An': '820000',
  'Thủ Dầu Một': '820001',
  'Thuận An': '820002'
};

async function run() {
  // Update VietnamCity.json
  const path = '../frontend_map_my_food/src/components/TemporaryData/VietnamCity.json';
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  data.forEach(d => {
    for (const [district, pincode] of Object.entries(districtToPincode)) {
      if (d.state && d.state.includes(district)) {
        d.pincode = pincode;
        break;
      }
    }
  });
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  console.log("VietnamCity.json updated!");

  // Update Database
  const client = new MongoClient('mongodb+srv://abc:123@clustertmdt.cckp5yy.mongodb.net/mymongoDB?appName=ClusterTMDT');
  await client.connect();
  const db = client.db('mymongoDB');
  
  const restaurants = await db.collection('restaurant').find({}).toArray();
  let updatedCount = 0;
  for (const r of restaurants) {
    let matchedPincode = null;
    const addressStr = (r.address || '') + ' ' + (r.location || '');
    
    for (const [district, pincode] of Object.entries(districtToPincode)) {
      if (addressStr.includes(district)) {
        matchedPincode = pincode;
        break;
      }
    }
    
    if (matchedPincode && matchedPincode !== r.pincode) {
      await db.collection('restaurant').updateOne({ _id: r._id }, { $set: { pincode: matchedPincode } });
      await db.collection('restaurantFood').updateMany({ RestaurantId: r.RestaurantId }, { $set: { pincode: matchedPincode } });
      console.log(`Updated ${r.Restaurant} to pincode ${matchedPincode}`);
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} restaurants in DB.`);
  process.exit(0);
}

run();
