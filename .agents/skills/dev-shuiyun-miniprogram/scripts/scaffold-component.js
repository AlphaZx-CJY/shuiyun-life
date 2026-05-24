#!/usr/bin/env node
/**
 * 组件脚手架脚本
 * 用法: node scaffold-component.js <component-name>
 * 示例: node scaffold-component.js my-component
 * 将在 components/<component-name>/ 目录下生成四件套文件
 */

const fs = require('fs');
const path = require('path');

const compName = process.argv[2];

if (!compName) {
  console.error('Usage: node scaffold-component.js <component-name>');
  process.exit(1);
}

const baseDir = path.resolve(__dirname, '..', '..', '..', '..', 'components', compName);

if (fs.existsSync(baseDir)) {
  console.error(`Error: components/${compName}/ already exists.`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

const tsContent = `Component({
  properties: {
    // define properties here
  },

  data: {
    // internal data
  },

  lifetimes: {
    attached() {
      // initialization
    },
  },

  methods: {
    // event handlers
  },
});
`;

const wxmlContent = `<view class="${compName}">
  <!-- ${compName} component -->
</view>
`;

const wxssContent = `.${compName} {
  /* component styles */
}
`;

const jsonContent = JSON.stringify({
  component: true,
  usingComponents: {},
}, null, 2) + '\n';

fs.writeFileSync(path.join(baseDir, `${compName}.ts`), tsContent);
fs.writeFileSync(path.join(baseDir, `${compName}.wxml`), wxmlContent);
fs.writeFileSync(path.join(baseDir, `${compName}.wxss`), wxssContent);
fs.writeFileSync(path.join(baseDir, `${compName}.json`), jsonContent);

console.log(`✅ Created components/${compName}/ with 4 files.`);
