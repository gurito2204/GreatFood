const http = require('http');

http.get('http://localhost:8080/nearbyrestaurants?lat=10.87&lng=106.80', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`Returned ${parsed.length} items`);
      console.log(parsed.map(r => r.about?.heading));
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
}).on('error', (e) => console.error(e));
