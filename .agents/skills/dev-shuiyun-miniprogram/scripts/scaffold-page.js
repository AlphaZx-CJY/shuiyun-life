#!/usr/bin/env node
/**
 * 页面脚手架脚本
 * 用法: node scaffold-page.js <page-name>
 * 示例: node scaffold-page.js activity
 * 将在 pages/activity/ 目录下生成四件套文件
 */

const fs = require('fs');
const path = require('path');

const pageName = process.argv[2];

if (!pageName) {
  console.error('Usage: node scaffold-page.js <page-name>');
  process.exit(1);
}

const baseDir = path.resolve(__dirname, '..', '..', '..', '..', 'pages', pageName);

if (fs.existsSync(baseDir)) {
  console.error(`Error: pages/${pageName}/ already exists.`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

const interfaceName = `I${pageName.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase())}Data`;

const tsContent = `interface ${interfaceName} {
  loading: boolean;
}

Page<${interfaceName}>({
  data: {
    loading: true,
  },

  onLoad() {
    this.setData({ loading: false });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '${pageName}',
      path: '/pages/${pageName}/${pageName}',
    };
  },
});
`;

const wxmlContent = `<view class="page-container">
  <!-- ${pageName} page -->
</view>
`;

const wxssContent = `.page-container {
  min-height: 100vh;
  background-color: var(--md-surface);
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}
`;

const jsonContent = JSON.stringify({
  navigationBarTitleText: pageName,
  usingComponents: {},
}, null, 2) + '\n';

fs.writeFileSync(path.join(baseDir, `${pageName}.ts`), tsContent);
fs.writeFileSync(path.join(baseDir, `${pageName}.wxml`), wxmlContent);
fs.writeFileSync(path.join(baseDir, `${pageName}.wxss`), wxssContent);
fs.writeFileSync(path.join(baseDir, `${pageName}.json`), jsonContent);

console.log(`✅ Created pages/${pageName}/ with 4 files.`);
console.log(`⚠️  Remember to register "pages/${pageName}/${pageName}" in app.json`);
