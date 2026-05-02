const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const files = walkSync('./frontend_map_my_food/src/components').filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: await fetch(${import.meta.env.VITE_REACT_BACKEND_URL}/endpoint).then(res => res.json())
  content = content.replace(/await\s+fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*\)\s*\.then\(\(res\)\s*=>\s*res\.json\(\)\s*\)/g, 'await api.get($1)');
  content = content.replace(/await\s+fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*\)\s*\.then\(\(response\)\s*=>\s*\{\s*return\s+response\.json\(\);\s*\}\s*\)/g, 'await api.get($1)');

  // Pattern 2: await fetch(${...}/..., { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(res => res.json())
  content = content.replace(/await\s+fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*,\s*\{\s*method:\s*"POST"\s*,\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"\s*\}\s*,\s*body:\s*JSON\.stringify\(([^)]+)\)\s*\}\s*\)\s*\.then\(\(res\)\s*=>\s*res\.json\(\)\s*\)/g, 'await api.post($1, )');
  content = content.replace(/await\s+fetch\(\s*\$\{import\.meta\.env\.VITE_REACT_BACKEND_URL\}([^]+)\s*,\s*\{\s*method:\s*"POST"\s*,\s*headers:\s*\{\s*"Content-Type":\s*"application\/json"\s*\}\s*,\s*body:\s*JSON\.stringify\(([^)]+)\)\s*,\s*\}\s*\)\s*\.then\(\(res\)\s*=>\s*res\.json\(\)\s*\)/g, 'await api.post($1, )');
  
  if (content !== original) {
    if (!content.includes('import { api }')) {
      content = 'import { api } from "../../services/api";\n' + content; // this is a rough import, might need manual fix
    }
    fs.writeFileSync(file, content);
  }
});
