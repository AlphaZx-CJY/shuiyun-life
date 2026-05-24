---
name: verify-shuiyun-harness
description: >
  水韵名邸项目 Harness 验证 Skill。
  当需要验证代码合规性、检查项目结构完整性、运行测试、修复代码规范问题、
  提交代码前预检、或排查 TypeScript / ESLint / 结构测试错误时触发。
---

# verify-shuiyun-harness

## Harness 验证工作流

每次修改代码后，按以下顺序执行验证：

```bash
# 1. 类型检查 + ESLint
npm run check

# 2. 结构测试
npm test

# 3. 自动修复（如需要）
npm run check:fix
npm run format
```

**原则**：`npm run check && npm test` 必须全部通过，才能标记任务完成。

## npm Scripts 说明

| 命令                | 作用                                     | 使用场景                             |
| ------------------- | ---------------------------------------- | ------------------------------------ |
| `npm run check`     | `tsc --noEmit && eslint . --ext .ts,.js` | 每次修改后必跑                       |
| `npm run check:fix` | ESLint 自动修复                          | 出现可自动修复的 lint 错误时         |
| `npm run format`    | Prettier 格式化 JSON/WXML/WXSS/MD        | 提交前统一格式                       |
| `npm test`          | 运行结构测试脚本                         | 检查目录结构、文件完整性、硬编码色值 |

## 预提交钩子

已配置 husky + lint-staged，提交前自动执行：

1. `lint-staged` — 对暂存区文件执行 ESLint fix / Prettier
2. `npm run check` — 全量类型检查与 Lint
3. `npm test` — 结构测试

如果任何一步失败，提交会被阻止。

## 结构测试覆盖项

`scripts/structural-test.js` 检查以下内容：

1. **页面注册完整性**：每个 `pages/` 子目录必须在 `app.json` 的 `pages` 数组中注册
2. **四件套完整性**：每个页面/组件目录必须包含 `.ts`、`.wxml`、`.wxss`、`.json`
3. **类型引用一致性**：`services/api.ts` 引用的类型必须在 `types/data.ts` 中定义
4. **硬编码色值扫描**：`pages/**/*.wxss` 中禁止出现 `#` 开头的硬编码色值（应使用 CSS 变量）
5. **图片路径有效性**：检查 WXML/WXSS 中引用的图片路径是否存在于 `images/` 目录

## 常见问题排查

### TypeScript 编译错误

- `_id` 不存在：云数据库返回含 `_id`，业务类型未声明。使用 `(item as any)._id` 或扩展类型
- 隐式 any：回调参数需显式声明类型

### ESLint 错误

- `wx` 未定义：确认 `.eslintrc.json` 中已配置 `globals: { wx: true }`
- `Page` / `App` / `Component` 未定义：同上，需配置全局变量

### 结构测试失败

- 新增页面未注册 `app.json`
- 组件目录缺少 `.json` 文件
- WXSS 中使用了硬编码颜色如 `#FFFFFF` 而非 `var(--md-surface)`

## 脚本位置

- `scripts/structural-test.js` — 结构测试主脚本
