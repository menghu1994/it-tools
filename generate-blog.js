import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'public/blog');
const outputFilePath = path.join(__dirname, 'src/blog/blog-routes.js');

function readFiles(dir) {
  const result = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      result.push({ title: file, children: readFiles(fullPath) });
    } else if (stats.isFile()) {
      result.push({ title: file });
    }
  });

  return result;
}

const fileStructure = readFiles(assetsDir);

const routeConfig = `
// 自动生成的博客路由 - 请勿手动修改
export const blogRoutes = ${JSON.stringify(fileStructure, null, 2)};
`;
fs.writeFileSync(outputFilePath, routeConfig, 'utf-8');
console.log('JSON file generated at:', outputFilePath);
