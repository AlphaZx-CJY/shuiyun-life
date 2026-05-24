#!/usr/bin/env node
/**
 * 结构测试脚本
 * 不依赖外部测试框架，纯 Node.js 实现
 * 运行: node structural-test.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const PAGES_DIR = path.join(PROJECT_ROOT, 'pages');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const APP_JSON = path.join(PROJECT_ROOT, 'app.json');
const TYPES_FILE = path.join(PROJECT_ROOT, 'types', 'data.ts');
const API_FILE = path.join(PROJECT_ROOT, 'services', 'api.ts');

let failCount = 0;
let passCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  ✅ ${message}`);
  } else {
    failCount++;
    console.log(`  ❌ ${message}`);
  }
}

function runTests() {
  console.log('\n🏗️  Structural Tests for shuiyun-life\n');

  // 1. 读取 app.json
  let appConfig;
  try {
    appConfig = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
  } catch (e) {
    console.error('❌ Failed to parse app.json:', e.message);
    process.exit(1);
  }

  const registeredPages = new Set(appConfig.pages || []);

  // 2. 检查 pages/ 目录
  const pageDirs = fs.existsSync(PAGES_DIR)
    ? fs.readdirSync(PAGES_DIR).filter(f => fs.statSync(path.join(PAGES_DIR, f)).isDirectory())
    : [];

  console.log(`📁 Checking ${pageDirs.length} page directories...`);

  pageDirs.forEach(dir => {
    const pagePath = `pages/${dir}/${dir}`;
    assert(registeredPages.has(pagePath), `Page "${dir}" is registered in app.json`);

    const requiredFiles = [`${dir}.ts`, `${dir}.wxml`, `${dir}.wxss`, `${dir}.json`];
    requiredFiles.forEach(file => {
      const filePath = path.join(PAGES_DIR, dir, file);
      assert(fs.existsSync(filePath), `pages/${dir}/${file} exists`);
    });
  });

  // 3. 检查 components/ 目录
  const compDirs = fs.existsSync(COMPONENTS_DIR)
    ? fs.readdirSync(COMPONENTS_DIR).filter(f => fs.statSync(path.join(COMPONENTS_DIR, f)).isDirectory())
    : [];

  console.log(`\n📦 Checking ${compDirs.length} component directories...`);

  function checkComponentDir(basePath, relPath) {
    const entries = fs.readdirSync(basePath);
    const hasSubDirs = entries.some(f => fs.statSync(path.join(basePath, f)).isDirectory());
    const baseName = path.basename(basePath);

    if (hasSubDirs) {
      // 嵌套组件目录（如 md3/），递归检查子目录
      entries.forEach(entry => {
        const entryPath = path.join(basePath, entry);
        if (fs.statSync(entryPath).isDirectory()) {
          checkComponentDir(entryPath, `${relPath}/${entry}`);
        }
      });
    } else {
      // 叶子组件目录，检查四件套
      const requiredFiles = [`${baseName}.ts`, `${baseName}.wxml`, `${baseName}.wxss`, `${baseName}.json`];
      requiredFiles.forEach(file => {
        const filePath = path.join(basePath, file);
        assert(fs.existsSync(filePath), `${relPath}/${file} exists`);
      });
    }
  }

  compDirs.forEach(dir => {
    checkComponentDir(path.join(COMPONENTS_DIR, dir), `components/${dir}`);
  });

  // 4. 检查 types/data.ts 中导出的接口被 api.ts 引用
  console.log(`\n🔗 Checking type references...`);
  if (fs.existsSync(TYPES_FILE) && fs.existsSync(API_FILE)) {
    const typesContent = fs.readFileSync(TYPES_FILE, 'utf8');
    const apiContent = fs.readFileSync(API_FILE, 'utf8');

    // 简单检查：api.ts 中 import 的接口名是否在 data.ts 中定义
    const importMatch = apiContent.match(/import\s+.*?from\s+'\.\.\/types\/data'/s);
    if (importMatch) {
      const importedTypes = [];
      const importBlock = importMatch[0];
      // 提取 import { A, B, C } 中的大写开头的标识符（类型名）
      const typeMatches = importBlock.matchAll(/\b([A-Z]\w+)\b/g);
      const checkedTypes = new Set();
      for (const m of typeMatches) {
        const typeName = m[1];
        if (checkedTypes.has(typeName)) continue;
        checkedTypes.add(typeName);
        const defined = typesContent.includes(`export interface ${typeName}`) ||
                        typesContent.includes(`export type ${typeName}`);
        assert(defined, `Type "${typeName}" is defined in types/data.ts`);
      }
    }
  }

  // 5. 检查硬编码色值（pages/**/*.wxss 中不应出现 # 开头的色值，应使用 CSS 变量）
  console.log(`\n🎨 Checking hardcoded colors in page styles...`);
  pageDirs.forEach(dir => {
    const wxssPath = path.join(PAGES_DIR, dir, `${dir}.wxss`);
    if (fs.existsSync(wxssPath)) {
      const content = fs.readFileSync(wxssPath, 'utf8');
      // 排除 CSS 变量定义和注释中的色值
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // 跳过注释行
        if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) return;
        // 匹配硬编码色值：# 后跟 3/6/8 位十六进制
        const match = line.match(/#[0-9A-Fa-f]{3,8}\b/);
        if (match && !line.includes('var(--')) {
          // 允许在 app.wxss 中定义变量，但页面级不应直接使用
          assert(false, `pages/${dir}/${dir}.wxss:${idx + 1} has hardcoded color ${match[0]}`);
        }
      });
    }
  });

  // 6. 检查图片路径有效性
  console.log(`\n🖼️  Checking image references...`);
  const imagesDir = path.join(PROJECT_ROOT, 'images');
  const allImages = new Set();
  if (fs.existsSync(imagesDir)) {
    function collectImages(dir) {
      fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          collectImages(full);
        } else {
          allImages.add(path.relative(PROJECT_ROOT, full).replace(/\\/g, '/'));
        }
      });
    }
    collectImages(imagesDir);
  }

  [PAGES_DIR, COMPONENTS_DIR].forEach(baseDir => {
    if (!fs.existsSync(baseDir)) return;
    fs.readdirSync(baseDir).forEach(dir => {
      const dirPath = path.join(baseDir, dir);
      if (!fs.statSync(dirPath).isDirectory()) return;
      ['.wxml', '.wxss', '.ts'].forEach(ext => {
        const filePath = path.join(dirPath, dir + ext);
        if (!fs.existsSync(filePath)) return;
        const content = fs.readFileSync(filePath, 'utf8');
        const imgMatches = content.matchAll(/["']\/images\/[^"']+["']/g);
        for (const m of imgMatches) {
          const raw = m[0].slice(1, -1);
          if (raw.includes('{{')) continue; // skip template expressions
          const imgPath = raw.substring(1); // remove leading /
          assert(allImages.has(imgPath), `Referenced image exists: ${imgPath}`);
        }
      });
    });
  });

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Results: ${passCount} passed, ${failCount} failed`);
  console.log(`${'='.repeat(40)}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
