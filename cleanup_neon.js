const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace arbitrary heavy neon box shadows with elegant, standard Tailwind soft layered shadows
  content = content.replace(/shadow-\[0_0_.*?\]/g, 'shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all');
  
  // Replace text glow drop-shadows with simple drop-shadow-md
  content = content.replace(/drop-shadow-\[0_0_.*?\]/g, 'drop-shadow-md');

  fs.writeFileSync(file, content);
});

console.log(`Cleaned up heavy neon shadows in ${files.length} files.`);
