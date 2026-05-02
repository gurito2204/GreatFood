const fs = require('fs');
const path = require('path');

const hooksToUpdate = [
  'useRestaurant.jsx',
  'useRestaurantFood.jsx',
  'useRecipes.jsx',
  'useCategoryWiseFood.jsx',
  'useSmallSearch.jsx',
  'usePaymentOffers.jsx',
  'useAvailableRestaurantsSorting.jsx',
  'useGetFoodsAndOffers.jsx',
  'useGetUserAddresses.jsx',
  'usegetUserOrder.jsx'
];

hooksToUpdate.forEach(hookName => {
  const filePath = path.join('frontend_map_my_food/src/components/hook', hookName);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/const data = await fetch\([\s\S]*?\)\s*\.then\([\s\S]*?\.json\(\)[^)]*\)\s*\.catch\([\s\S]*?\);/g, (match) => {
      let urlMatch = match.match(/\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)/);
      if(urlMatch) {
          let returnMatch = match.match(/return\s+(null|\[\])/);
          let retVal = returnMatch ? returnMatch[1] : 'null';
          return 'const data = await api.get(' + urlMatch[1] + ').catch(err => { console.error(err); return ' + retVal + '; });';
      }
      return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
  }
});
