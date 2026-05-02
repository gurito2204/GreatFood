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

  content = content.replace(/import { useLocationLocalStorage } from "\.\/LocationLocalStorage";/g, 'import { useLocationLocalStorage } from "./LocationLocalStorage";\nimport { api } from "../../services/api";');
  if (!content.includes('import { api }') && !content.includes('useLocationLocalStorage')) {
      content = 'import { api } from "../../services/api";\n' + content;
  }

  content = content.replace(/const data = await fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*\)\s*\.then\(\(res\)\s*=>\s*res\.json\(\)\s*\)\s*\.catch\(\(err\) => \{\s*console\.error\(err\);\s*return\s+(null|\[\]);\s*\}\);/g, 'const data = await api.get($1).catch((err) => { console.error(err); return ; });');

  content = content.replace(/const data = await fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*\)\s*\.then\(\(response\)\s*=>\s*\{\s*return\s+response\.json\(\);\s*\}\s*\)\s*\.catch\(\(err\)\s*=>\s*\{\s*console\.error\(err\);\s*return\s+(null|\[\]);\s*\}\);/g, 'const data = await api.get($1).catch((err) => { console.error(err); return ; });');
  
  // Custom case for url parameter like in Sorting
  content = content.replace(/const data = await fetch\(url\)\s*\.then\(\(response\)\s*=>\s*\{\s*return\s+response\.json\(\);\s*\}\s*\)\s*\.catch\(\(err\)\s*=>\s*\{\s*console\.error\(err\);\s*return\s+\[\];\s*\}\);/g, 'const data = await api.get(url.replace(import.meta.env.VITE_REACT_BACKEND_URL, "")).catch((err) => { console.error(err); return []; });');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
  }
});
