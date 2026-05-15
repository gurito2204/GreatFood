const http = require('http');

http.get('http://localhost:8080/restaurantfood/2c555274-25f7-47c7-8992-ac3ae3d2a457', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
}).on('error', (e) => console.error(e));
